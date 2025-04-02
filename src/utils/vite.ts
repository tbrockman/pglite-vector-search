// TODO: fix `Uncaught (in promise) TypeError: WebAssembly: Response already consumed`

import { parse } from 'csv-parse';
import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import { Plugin } from 'vite';


import { TRIALS_TABLE } from '../constants';
import { Pipeline } from './extractor';
import { setupDatabase } from './db';

function normalizeDateFormat(dateStr: string): string | null {
    if (!dateStr) return null;

    const yearMonthPattern = /^\d{4}-\d{2}$/;
    if (yearMonthPattern.test(dateStr)) {
        return `${dateStr}-01`;
    }
    return dateStr;
}

async function insertBatch(pglite: PGlite, columnNames: string[], batch: any[]) {
    if (batch.length < 1) return

    const placeholders = batch.map((b, i) => b.map((_: any, j: number) => `$${(b.length * i) + j + 1}`).join(', '))
    const query = `INSERT INTO trials (${columnNames.join(', ')}) VALUES ${batch.map((_, i) => `(${placeholders[i]})`).join(', ')}`;
    await pglite.query(query, batch.flat());
}

export type IngestCSVProps = {
    src?: string,
    dest?: string,
}

/**
 * Vite plugin for parsing trial rows in a specified CSV, generating embeddings, and storing the result (to be fetched in the browser)
 */
export function ingestCSV({ src = 'data/trials.csv', dest = 'public/pglite.bin' }: IngestCSVProps = {}): Plugin {

    return {
        name: 'ingest-csv',
        async buildStart() {
            if (fs.existsSync(dest)) return

            const entries = Object.entries(TRIALS_TABLE)
            const pglite = await setupDatabase(entries);
            const names = entries.map(([name]) => name)
            const columnNameToIndex = new Map(names.map((name, i) => [name, i]))
            const columnsToEmbed: (keyof typeof TRIALS_TABLE)[] = ['study_title', 'conditions', 'brief_summary']
            const columnIndexToEmbed = columnsToEmbed.map(c => columnNameToIndex.get(c) as number)

            const batchSize = 100;
            let batch: any[] = [];

            const parser = fs.createReadStream(src, 'utf-8')
                .pipe(parse({
                    from: 2,
                    cast: (value, context) => {
                        const [, type] = entries[context.index + 1] // csv doesn't contain id

                        if (type === 'date') {
                            return normalizeDateFormat(value)
                        }
                        return value === '' && type !== 'text' ? null : value
                    }
                }));

            const classifier = await Pipeline.get()

            for await (const record of parser) {
                // i-1 as records do not contain the `id` column
                const textToEmbed = columnIndexToEmbed.map(i => record[i - 1]).join(' | ');
                const embedding = await classifier(textToEmbed, { pooling: 'mean', normalize: true });
                batch.push([...record, `[${embedding.tolist()}]`]);

                if (batch.length >= batchSize) {
                    await insertBatch(pglite, names.slice(1), batch);
                    batch = [];
                }
            }
            await insertBatch(pglite, names.slice(1), batch);

            // dump database to file
            const dump = await pglite.dumpDataDir('none');
            fs.writeFileSync(
                dest,
                Buffer.from(await dump.arrayBuffer())
            );
        }
    }
}
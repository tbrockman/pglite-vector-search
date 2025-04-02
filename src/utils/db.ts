import { PGlite } from "@electric-sql/pglite";
import { vector } from '@electric-sql/pglite/vector';
import { fuzzystrmatch } from '@electric-sql/pglite/contrib/fuzzystrmatch';
import { TRIALS_TABLE } from "../constants";

/**
 * Creates a `pglite` database
 * @param columns Entries of [column name, column type]
 * @returns 
 */
export async function setupDatabase(columns: [string, string][]) {
    const pglite = await PGlite.create({ extensions: { vector, fuzzystrmatch } });
    const schema = columns
        .map(([colName, colType]) => `${colName} ${colType}`)
        .join(', ');
    await pglite.exec(`
    CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
    CREATE EXTENSION IF NOT EXISTS vector;
    CREATE TABLE IF NOT EXISTS trials (${schema});
    CREATE INDEX IF NOT EXISTS trials_embedding_idx ON trials USING hnsw (embedding vector_l2_ops);
  `);
    return pglite;
}

/**
 * Determine whether a given database exists in indexedDB already
 * @param dbName 
 * @returns 
 */
export async function databaseExists(dbName: string) {
    if (!indexedDB.databases) {
        console.warn("indexedDB.databases() is not supported in this browser.");
        return false;
    }
    const databases = await indexedDB.databases();
    return databases.some(db => db.name === dbName);
}

const embedCache = new Map<string, string>();
/**
 * A dumb AI generated function to replace the templated embed function (rather than include a whole templating library)
 * @param input Input template query potentially containing embed calls
 * @param embed Function to call with parsed arguments
 * @returns 
 */
export async function parseEmbeds(
    input: string,
    embed: (text: string) => Promise<number[]>
): Promise<[string, string[]]> {
    const pattern = /\{\{\s*embed\(\s*"([^"]*)"\s*\)\s*\}\}/g;
    const params: string[] = [];
    const seen = new Map<string, number>();

    let paramIndex = 1;
    let output = input;

    const matches = Array.from(input.matchAll(pattern));
    for (const match of matches) {
        const [fullMatch, arg] = match;

        let index: number;
        if (seen.has(arg)) {
            index = seen.get(arg)!;
        } else {
            if (!embedCache.has(arg)) {
                const result = await embed(arg);
                embedCache.set(arg, JSON.stringify(result));
            }
            index = paramIndex++;
            seen.set(arg, index);
            params.push(embedCache.get(arg)!);
        }
        output = output.replace(fullMatch, `$${index}`);
    }

    return [output, params];
}

/**
 * Helper for returning the SQL query template
 * @param query TextField input to template into the default query
 * @param tableName Table name to template into the query
 * @returns 
 */
export const getQueryTemplate = (query: string, tableName: string) => {
    return `select * from ${tableName}
where ${tableName}.embedding <-> {{ embed("${query}") }} < 0.8
order by ${tableName}.embedding <-> {{ embed("${query}") }}
limit 10;

/* trials: ${JSON.stringify(TRIALS_TABLE, null, 2)} */`
}
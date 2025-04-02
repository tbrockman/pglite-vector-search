import { useEffect, useState } from 'react';
import { PGlite } from '@electric-sql/pglite'
import { vector } from '@electric-sql/pglite/vector';
import { fuzzystrmatch } from '@electric-sql/pglite/contrib/fuzzystrmatch';
import { databaseExists } from '../utils/db';
import { CLINICAL_TRIALS_DB_PATH, CLINICAL_TRIALS_DB_NAME } from '../constants';

/**
 * Hook to load `pglite` either from indexedDb, falling back to a fetch from `/pglite.bin`
 * @returns 
 */
export function usePGlite() {
  const [db, setDb] = useState<PGlite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initDb() {

      try {
        const pglite = await PGlite.create(`idb://${CLINICAL_TRIALS_DB_NAME}`, {
          extensions: { vector, fuzzystrmatch },
          // only fetch and load the database if it hasn't been initialized already
          loadDataDir: await databaseExists(CLINICAL_TRIALS_DB_PATH) ?
            undefined :
            await fetch('/pglite.bin').then(async res => res.blob())
        });

        setDb(pglite);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
      } finally {
        setLoading(false);
      }
    }

    initDb();
  }, []);

  return { db, loading, error };
}
import { useState } from 'react';
import { MantineProvider, Container, Text, LoadingOverlay, Box } from '@mantine/core';
import Masonry from 'react-masonry-css';

import '@mantine/core/styles.css';

import { SearchBar } from './components/SearchBar';
import { usePGlite } from './hooks/usePGlite';
import { Trial } from './types';
import TrialCard from './components/TrialCard';
import { theme } from './theme';

import './App.css';

function App() {
  const { db, loading, error } = usePGlite();
  const [trials, setTrials] = useState<Trial[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query: string, params: string[]) => {
    if (!db) return;

    setSearching(true);
    try {
      const results = await db.query(query, params || undefined)
      setTrials(results.rows as Trial[]);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <MantineProvider theme={theme}>
      {loading && <LoadingOverlay visible />}
      {error && !loading && (
        <Container size="md" py="xl">
          <Text c="red">Error: {error.message}</Text>
        </Container>
      )}
      {!error && !loading && (
        <Box style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
          <Box
            style={{
              borderBottom: '1px solid var(--mantine-color-gray-3)',
              position: "sticky",
              top: 0,
              zIndex: 100,
              padding: "1rem",
            }}
          >
            <SearchBar onSearch={handleSearch} loading={searching} />
          </Box>
          <Box
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              position: "relative",
            }}
          >
            <Masonry
              breakpointCols={{
                default: 3,
                1100: 2,
                700: 1
              }}
              className="masonry-grid"
              columnClassName="masonry-column"
            >
              {trials.map((t) => <TrialCard key={t.id} trial={t} />)}
            </Masonry>
          </Box>
        </Box>
      )}
    </MantineProvider>
  );
}

export default App;
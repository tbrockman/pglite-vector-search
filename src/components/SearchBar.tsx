import * as comlink from 'comlink';
import {
  TextInput, Button, Group, Collapse, Loader, Stack, Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { TbCode, TbMinus, TbSearch } from 'react-icons/tb';

import { SqlEditor } from './SqlEditor';
import { getQueryTemplate, parseEmbeds } from '../utils/db';
import { TRIALS_TABLE_NAME } from '../constants';
import { Pipeline } from '../utils/extractor';

interface SearchBarProps {
  onSearch: (query: string, params: string[]) => Promise<void>;
  loading?: boolean;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [textQuery, setTextQuery] = useState('');
  const [sqlQuery, setSqlQuery] = useState(() => getQueryTemplate(textQuery, TRIALS_TABLE_NAME));
  const [pending, setPending] = useState(false);
  const [workerReady, setWorkerReady] = useState(false);
  const [classifyFn, setClassifyFn] = useState<((text: string) => Promise<number[]>) | null>(null);
  const [showAdvanced, { toggle }] = useDisclosure(false);

  useEffect(() => {
    const loadWorker = async () => {
      const worker = new SharedWorker(new URL('../workers/embed.worker.ts', import.meta.url), { type: 'module' });
      const api = comlink.wrap<{ classify: typeof Pipeline.classify }>(worker.port);
      setClassifyFn(() => api.classify);
      setWorkerReady(true);
    };
    loadWorker();
  }, []);

  useEffect(() => {
    if (classifyFn && workerReady) {
      onExecute();
    }
  }, [classifyFn, workerReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onExecute();
  };

  const onExecute = async () => {
    if (!classifyFn) return;
    setPending(true);
    const [templated, params] = await parseEmbeds(sqlQuery, classifyFn);
    await onSearch(templated, params);
    setPending(false);
  };

  useEffect(() => {
    setSqlQuery(getQueryTemplate(textQuery, TRIALS_TABLE_NAME));
  }, [textQuery]);

  const searchIcon = pending
    ? <Loader color="gray" size="xs" />
    : <TbSearch />;

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={0} w="min(100%, 860px)">
        <Group>
          <TextInput
            flex={1}
            disabled={pending || !workerReady}
            autoFocus
            placeholder={"Search clinical trials (eg.\"cancer\") "}
            value={textQuery}
            onSubmit={(e) => handleSubmit(e)}
            onChange={(e) => setTextQuery(e.target.value)}
            rightSection={searchIcon}
            radius="md"
            size="md"
            variant="filled"
          />
          <Button
            radius="md"
            size="md"
            variant="filled"
            color="dark"
            onClick={toggle}
            rightSection={showAdvanced ? <TbMinus /> : <TbCode />}
          >
            Edit SQL
          </Button>
        </Group>

        <Collapse in={showAdvanced}>
          <Box pt="1rem" style={{ borderRadius: '4px' }}>
            <SqlEditor
              value={sqlQuery}
              onChange={setSqlQuery}
              onExecute={onExecute}
            />
          </Box>
        </Collapse>
      </Stack>
    </form>
  );
}

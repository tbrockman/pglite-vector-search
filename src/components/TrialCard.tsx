import {
  Card,
  Text,
  Anchor,
  Group,
  Collapse,
  Stack,
  Box,
  Title,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TbChevronDown, TbChevronUp } from 'react-icons/tb';

import { Trial } from '../types';

import './TrialCard.css';

const IGNORED_FIELDS = ['id', 'embedding', 'study_url'];

const formatLabel = (key: string) =>
  key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export type TrialCardProps = {
  trial: Partial<Trial>
}
const TrialCard = ({ trial }: TrialCardProps) => {
  const [opened, { toggle }] = useDisclosure(false);
  const entries = Object.entries(trial).filter(
    ([key, value]) => value != null && !IGNORED_FIELDS.includes(key)
  );
  const startDateString = trial.start_date?.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const completionDateString = trial.completion_date?.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card className='trial' radius="md" withBorder p={0} mb="md" display='block'>
      <Stack gap="xs" >
        <Box className='study-title'>
          {trial.study_url ?
            <Anchor href={trial.study_url as string} target="_blank" rel="noopener noreferrer">
              <Title fw='normal' size='2.5rem'>{trial.study_title?.toString()}</Title>
            </Anchor> :
            <Title fw='normal' size='2.5rem'>{trial.study_title?.toString()}</Title>
          }
          <Text c='gray' size="md">{startDateString} – {completionDateString}</Text>
        </Box>
        <Box className='brief-summary'>
          <Text size='1.75rem' lh='2rem' lineClamp={opened ? undefined : 10}>{trial.brief_summary?.toString()}</Text>
        </Box>
        {entries.length > 0 && (
          <>
            <Group className='entry-expand' justify="start" p={0} style={{ borderRadius: 0 }}>
              <ActionIcon
                flex={1}
                variant='white'
                h='unset'
                w='unset'
                p='1rem'
                c='dark'
                size="xs"
                onClick={toggle}
              >
                {opened ? <TbChevronUp size={14} /> : <TbChevronDown size={14} />}
              </ActionIcon>
            </Group>
            <Collapse in={opened}>
              <Stack gap="xs" mt="xs" pb='md'>
                {entries.filter(([key]) => key !== 'brief_summary').map(([key, value]) => (
                  value &&
                  <Box key={key}>
                    <Title order={3} fw={500} size="lg" mt='8px' mb='8px'>{formatLabel(key)}</Title>
                    <Text size="sm">
                      {(value instanceof Date) ?
                        value?.toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }) :
                        value?.toString()
                      }
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Collapse>
          </>
        )}
      </Stack>
    </Card>
  );
};

export default TrialCard;
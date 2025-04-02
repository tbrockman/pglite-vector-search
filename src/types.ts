import { TRIALS_TABLE } from "./constants";

type ColumnType =
  | 'bigint primary key generated always as identity'
  | 'text'
  | 'integer'
  | 'date'
  | 'vector (384)';

type SQLToType<T extends ColumnType> =
  T extends 'bigint primary key generated always as identity' ? bigint :
  T extends 'text' ? string :
  T extends 'integer' ? number :
  T extends 'date' ? Date :
  // eslint-disable-next-line
  T extends `vector (${infer _})` ? number[] :
  never;

type TypeFromSchema<T extends Record<string, any>> = {
  [K in keyof T]: SQLToType<T[K]>;
};

// Resulting Type:
export type Trial = TypeFromSchema<typeof TRIALS_TABLE>;
export interface SearchResult {
  trials: Trial[];
  total: number;
}
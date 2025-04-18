# `examples/pglite-vector-search`
> Vector similarity in the browser using `pglite`, `codemirror`, and `react`
> 
> <p align="right"><sup>- by <a href="https://theo.lol">theo</a><sup>with a good amount of credit due to <a href="https://supabase.com/blog/in-browser-semantic-search-pglite">this Supabase blog post</a> which I swear I discovered <i>after</i> I started</sup></sup></p>

An example of ingesting CSV data into [`pglite`](https://pglite.dev/) to be filtered using [`pgvector`](https://github.com/pgvector/pgvector), in your browser

Originally written as a takehome project to create a user interface for an executive to understand the data included in [`data/trials.csv`](data/trials.csv). 

<img src='data/screenshot.png' width='600' alt='Screenshot of the app'>

## Features
* No server, everything is done in the browser <sup>*except the things done at build-time*</sup>
* PostgreSQL instance ([`pglite`](https://pglite.dev/)) for search (using [`pgvector`](https://github.com/pgvector/pgvector), though the [`fuzzystrmatch`](https://www.postgresql.org/docs/current/fuzzystrmatch.html) extension is also available)
* [`transformer.js`](https://huggingface.co/docs/transformers.js/en/index) + [`Supabase/gte-small`](https://huggingface.co/Supabase/gte-small) model for extracting embeddings from user query as well as dataset
* [`CodeMirror`](https://codemirror.net/) editor for writing SQL (used to query the dataset)
* [`EB Garamond`](http://www.georgduffner.at/ebgaramond/) for font fanciness

## Getting started

```sh
pnpm i && pnpm dev
```

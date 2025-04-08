# example: pglite-vector-search

An interactive example of ingesting CSV data into `pglite` to be filtered using `pgvector`.

For a project to create a user interface for an executive to understand the data included in [`data/trials.csv`](data/trials.csv). 

<img src='data/screenshot.png' width='600' alt='Screenshot of the app'>

* Expected time: 2 hours
* Actual time: ...a bit longer. 

Features: 
* No server, everything is done in the browser <sup>*except the things done at build-time*</sup>
* PostgreSQL instance (`pglite`) for search (using `pgvector`, though the `fuzzystrmatch` extension is also available)
* `transformer.js` model for extracting embeddings from user query as well as dataset
* `CodeMirror` editor for writing SQL (used to query the dataset)

## Getting started

```sh
pnpm i && pnpm dev
```

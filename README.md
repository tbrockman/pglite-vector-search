# argonai

> [!NOTE]
>  I got carried away and definitely spent more than 2 hours on this. It started with wanting to try out `pglite`, wanting to learn more about `pgvector`, curious as to how good a transformer model which can be downloaded and ran in the browser would be, and trying to make things prettier than stuffing all the data within a `@tanstack/react-table`.
> I was working on the idea before I encountered it, but some amount of credit goes to [this supabase article](https://supabase.com/blog/in-browser-semantic-search-pglite) for validating some of my approach

Features: 
* PostgreSQL instance (`pglite`) for search (using `pgvector`, though the `fuzzystrmatch` extension is also available)
* `transformer.js` model for extracting embeddings from user query as well as dataset
* `CodeMirror` editor for writing raw SQL to query dataset

## Getting started

```sh
pnpm i && pnpm dev
```

## Q & A

### How would you handle state management between components?

Depending on anticipated level of complexity at most using a store like [`zustand`](https://github.com/pmndrs/zustand), otherwise mainly defaulting to passing-down state.

### If Sarah wanted to filter trials by additional criteria (e.g., trial phase, sponsor), how would you extend the functionality

Technically this already exists since there's a raw SQL editor in the app, but realistically it seems like for an executive you would probably want to create a user interface as close to Excel as possible. Or just straight up build a Google Sheets/Excel plugin.

### What techniques would you use to ensure efficient rendering of the table, especially when dealing with large datasets?

Some amount of query pagination by default. Only render as many results as can be displayed in the viewport, lazily rendering more results as they scroll into view (faking the scroll bar length with estimated height). 

### What compromises did you make in your solution, and why were those compromises necessary?

1. I didn't render the results as a table, because it seemed like there was just too much information to cram in (even hiding certain columns) and that adding UI elements to then also allow filtering and everything on top of that also seemed like it would be pretty messy/difficult.
2. I didn't build a "real" search interface for slicing and dicing data, I would have liked to have had something that had a `Lucene`-like syntax, with context-aware autocomplete -- but didn't find anything usable off the shelf and so I opted to satisfy the requirement by allowing raw SQL queries (though I wouldn't be surprised if Sarah didn't know SQL)
3. I didn't write any tests, didn't have the time.

### How would you identify opportunities to improve the user experience of this application, and what would you prioritize first?

* a simple (and accessible) form for submitting feedback
* end-to-end application instrumentation/metrics (latency, throughput, errors, etc.)
* exploring other proxies for whether search results are helpful 

I would maximize `impact / cost` (what seems most worthwhile with the least investment--sometimes `impact` is swayed by what I find interesting as well)

## Bonus points

### NSCLC has many different representations in the dataset. For example, it could be “non small cell lung cancer”, “non small cell lung carcinoma”, “NSCLC”, “carcinoma of the lungs, non small cell”, etc. How do we capture all the relevant clinical trials for searches on any disease?

Some sort of system which builds a numerical representation of text/phrases which can be used to compare "distance" between concepts and find things that are closely related might be useful.

### How do we allow her to search for NSCLC trials -AND- immunotherapy related drugs?

`AND` (don't think I've _fully_ understood the question here)

### How would you deploy your software?

If I'm only deploying it to be managed by myself, with as little vendor lock-in and as low-cost as possible. Usually I take advantage of Cloudflare's generous free-tier. If enough people on the team are familiar, I like the flexibility of `k8s` when it comes to leveraging open-source and switching clouds. I've found that the more your cloud provider does for you, the less you can debug on your own (and the more time they charge you for support).

### What are the alternatives to loading the dataset into memory, and why would you want to use those alternatives?

Distributing the dataset and search over multiple machines. Often to parallelize computation/horizonatally scale/improve reliability.

### How do we evaluate completeness of results?

Develop a curated set of queries with expected results.

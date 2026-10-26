# Book4.0

The existing dark Book4.0 interface now lists five real, free EPUB titles from [Project Gutenberg](https://www.gutenberg.org/). EPUBs and covers are stored in `public/books`, with catalogue metadata in `src/data/books.js`.

Open a book to read it directly in the browser. The reader supports chapter navigation, page turns, a progress slider, bookmarks, font size, three paper themes, keyboard arrows, and resuming from the last position. Progress and settings are saved in the current browser.

```sh
npm ci
npm start
npm run build
```

The catalogue and reader work without an API. The legacy account and subscription flows need the sibling `book-platform-backEnd` project with PostgreSQL and Redis. In production, API requests use the current origin; during local development they default to `http://localhost:9999`. Set `REACT_APP_API_BASE_URL` before building to override this.

The included titles are believed to be public domain in the United States. Check the law in other places before distributing their EPUB files.

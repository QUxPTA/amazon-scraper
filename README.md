# Amazon Product Scraper

A simple web scraper for Amazon product listings.

## Setup

### Backend (Bun)

1. Clone the repository:

```bash
git clone https://github.com/QUxPTA/amazon-scraper.git
```

2. Install dependencies:

```bash
bun i
```

3. Start the server:

```bash
bun run index.ts
```

### Frontend (Vite) --> (In a separate terminal)

1. Install dependencies:

```bash
cd amazon-scraper-frontend && npm i
```

2. Start the development server:

```bash
 npm run dev
```

## Usage

1. Open the frontend in your browser

```
http://localhost:5173/
```

2. Enter a search keyword and click "Search"
3. View the results

## Notes

- This is a basic implementation and may not work for all Amazon search results due to their dynamic content and anti-scraping measures.
- Make sure to respect Amazon's robots.txt and terms of service.
- Consider using official Amazon APIs for production use.

This project was created using `bun init` in bun v1.2.10. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

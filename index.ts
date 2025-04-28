// This code is a simple web scraper for Amazon product listings using Express, axios and jsdom.
import Express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

// Initialize express
const app = Express();
const port = 3000;

// Define the structure of a Product object
interface Product {
  title: string; // The title of the product.
  rating: string; // The rating of the product (e.g., "4.5 out of 5 stars").
  reviews: string; // The number of reviews for the product.
  image: string; // The URL of the product's image.
}

// Main scraping function
async function scrapeAmazon(keyword: string): Promise<Product[]> {
  try {
    // Construct the Amazon search URL with the provided keyword
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

    // Set headers to mimic a real browser request
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    };

    // Make an HTTP GET request to the Amazon search page
    const response = await axios.get(url, { headers });

    // Parse the HTML response using JSDOM
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Select all product elements from the search results
    const products = Array.from(
      document.querySelectorAll('.s-result-item') // Amazon uses this class for product items.
    ).map((element) => {
      // Extract product details from the HTML
      const title =
        element.querySelector('.a-text-normal')?.textContent?.trim() || 'N/A'; // Product title
      const rating =
        element.querySelector('.a-icon-alt')?.textContent?.trim() || 'N/A'; // Product rating
      const reviews =
        element.querySelector('.a-size-base')?.textContent?.trim() || 'N/A'; // Number of reviews
      const image =
        (
          element.querySelector(
            'img[data-image-latency="s-product-image"]'
          ) as HTMLImageElement
        )?.src || 'N/A'; // Product image URL

      // Return the product details as an object
      return {
        title,
        rating,
        reviews,
        image,
      };
    });

    // Return the list of products
    return products;
  } catch (error) {
    // Log any errors that occur during scraping
    console.error('Scraping error:', error);
    return []; // Return an empty array if an error occurs
  }
}

// Define an Express route for the API
app.get('/api/scrape', async (req: any, res: any) => {
  const keyword = req.query.keyword as string; // Get the 'keyword' query parameter from the request

  // If no keyword is provided, return a 400 Bad Request response
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  try {
    // Call the scraping function with the provided keyword
    const products = await scrapeAmazon(keyword);

    // Send the scraped products as a JSON response
    res.json(products);
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    res.status(500).json({ error: 'Scraping failed' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

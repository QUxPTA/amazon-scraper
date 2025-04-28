async function scrapeProducts() {
  const keyword = document.getElementById('_keyword').value.trim();
  const resultsContainer = document.getElementById('_results');
  const loadingContainer = document.getElementById('_loading');
  const errorContainer = document.getElementById('_error'); // Error message container

  // Clear previous error message
  errorContainer.textContent = '';

  if (!keyword) {
    // Display an inline error message
    errorContainer.textContent = 'Please enter a keyword to search.';
    return;
  }

  // Show loading indicator
  resultsContainer.innerHTML = '';
  loadingContainer.style.display = 'block';

  try {
    const response = await fetch(
      `http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();

    // Hide loading indicator
    loadingContainer.style.display = 'none';

    // Display results
    resultsContainer.innerHTML = products
      .map((product) => {
        const rating = parseFloat(product.rating.split(' ')[0]) || 0; // Extract numeric rating
        const fullStars = Math.floor(rating); // Number of full stars
        const halfStar = rating % 1 >= 0.25 && rating % 1 < 0.75; // Check if there's a half star
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Remaining empty stars

        const starsHTML = `
          ${'<span class="star">★</span>'.repeat(fullStars)}
          ${
            halfStar ? '<span class="star half-star">★</span>' : ''
          } <!-- Half star -->
          ${'<span class="star">☆</span>'.repeat(emptyStars)}
        `;

        const formattedReviews = product.reviews.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ','
        ); // Format review count

        return `
          <div class="product-card">
            <img src="${product.image}" alt="${product.title}" />
            <h2 class="product-title">${product.title}</h2>
            <div class="star-rating">${starsHTML}</div>
            <div class="review-count">${formattedReviews} reviews</div>
          </div>
        `;
      })
      .join('');
  } catch (error) {
    console.error('Scraping error:', error);
    loadingContainer.style.display = 'none';
    resultsContainer.innerHTML =
      '<p>Failed to fetch products. Please try again later.</p>';
  }
}

window.scrapeProducts = scrapeProducts;

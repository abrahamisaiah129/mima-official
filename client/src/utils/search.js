/**
 * Advanced Search Utility
 * Implements "Deep Search" with fuzzy matching and multi-field targeting.
 */

// Simple Levenshtein distance for fuzzy matching
const getLevenshteinDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  // increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

/**
 * Filter products based on a smart deep search.
 * @param {Array} products - List of products
 * @param {String} query - The search string
 * @returns {Array} - Filtered list
 */
export const smartSearch = (products, query) => {
  if (!query) return products;

  const lowerQuery = query.toLowerCase().trim();
  const queryWords = lowerQuery.split(/\s+/); // Split "red stileto" -> ["red", "stileto"]

  return products.filter((product) => {
    // 1. Prepare Searchable Text Fields
    const title = product.title.toLowerCase();
    const category = product.category.toLowerCase();
    const description = product.description.toLowerCase();
    
    // Helper to check colors
    const colorNames = product.colors ? product.colors.map(c => c.name.toLowerCase()).join(" ") : "";
    
    // Combine all text for broad matching
    const allText = `${title} ${category} ${description} ${colorNames}`;

    // 2. Logic: EVERY word in the query must match SOMETHING in the product (fuzzy or exact)
    // This allows "Red Stileto" to match a product that has "Red" and "Stilettos" strings.
    return queryWords.every(word => {
      // A. Exact Substring Match (Fast & Strict)
      if (allText.includes(word)) return true;

      // B. Fuzzy Match (For typos like "stileto" -> "stilettos")
      // Check word against title words, category, or color names
      const productKeywords = [
          ...title.split(/\s+/),
          category,
          ...colorNames.split(/\s+/)
      ];

      // If matches any keyword within distance of 2 (allows 1-2 typos)
      return productKeywords.some(keyword => {
          // Skip fuzzy for very short words to avoid noise
          if (word.length < 3 || keyword.length < 3) return false; 
          
          const dist = getLevenshteinDistance(word, keyword);
          // Allow 1 mistake for short words (4-6 chars), 2 for long words (>6 chars)
          const allowedMistakes = word.length > 6 ? 2 : 1;
          
          return dist <= allowedMistakes;
      });
    });
  });
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchProducts() {
  const response = await fetch(`${BASE_URL}/products`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return response.json();
}
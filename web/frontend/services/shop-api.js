export async function getShopInfo() {

  const response = await fetch('/api/shop/info');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}







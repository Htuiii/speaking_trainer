const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getApiStatus() {
  const response = await fetch(`${API_URL}/api/status`);

  if (!response.ok) {
    throw new Error(`API status request failed: ${response.status}`);
  }

  return response.json() as Promise<{ ready: boolean; message: string }>;
}

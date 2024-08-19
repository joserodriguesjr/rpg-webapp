import axios from 'axios';

export const { protocol, hostname } = window.location;
export const port = 3000;
export const API_BASE_URL = `${protocol}//${hostname}:${port}`;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const mountImagePath = (image: string) => {
  return `${API_BASE_URL}/public/${image}`;
};

export const fetchUVTTFile = async (
  location: string,
  map: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  // TODO: any -> uvttData type
  try {
    const response = await api.get(`/uvtt/${location}/${map}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching UVTT file:', error);
    throw error;
    // Handle error appropriately, e.g., display error message to the user
  }
};

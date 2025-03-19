const CAT_API_KEY = 'live_0vG9nN0KZsZXYREot5CPCkdKoVDhqSfLnRk54MFWvuoojEwME5XYidHTKHdzJNdU';

const API_URL = 'https://api.thecatapi.com/v1/images/search';

export const fetchCatImage = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'x-api-key': CAT_API_KEY,
      },
    });
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Error fetching cat image:', error);
    throw error;
  }
};

export const fetch10CatImages = async () => {
  try {
    const response = await fetch(`${API_URL}?limit=10`, {
      headers: {
        'x-api-key': CAT_API_KEY,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching 10 cat images:', error);
    throw error;
  }
};
import axios from 'axios';

const OPENCAGE_API_KEY = '0c3fe9f7e0604478bda0d6c7e9752428'; // Replace with your actual API key

export const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        key: OPENCAGE_API_KEY,
        q: `${latitude}+${longitude}`,
        pretty: 1,
        no_annotations: 1,
      },
    });

    if (response.data.results.length > 0) {
      const { city, town, village, state } = response.data.results[0].components;
      return {
        city: city || town || village || 'Unknown',
        state: state || 'Unknown',
      };
    } else {
      return { city: 'Unknown', state: 'Unknown' };
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return { city: 'Unknown', state: 'Unknown' };
  }
};

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import getImage from './images/helpers/getImage';
import { TokenState } from '@features/reducers/token';

const useImage = (src: any) => {
  const [imageDataUrl, setImageDataUrl] = useState<any>(null);
  const token = useSelector((state: TokenState) => state.token)

  useEffect(() => {
    const fetchImage = async () => {
      // Your image fetching logic using the getImage function here
      try {
        // Assuming you have the getImage function defined elsewhere
        const image = await getImage(src, token, '/');
        setImageDataUrl(image);
      } catch (error) {
        console.error('Error retrieving image:', error);
      }
    };

    fetchImage();
  }, [src]);

  return imageDataUrl;
};

export default useImage;
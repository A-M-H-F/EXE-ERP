import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import getImage from './helpers/getImage';

const useProfilePicture = (src: any) => {
  const [imageDataUrl, setImageDataUrl] = useState<any>(null);
  const token = useSelector((state: any) => state.token)

  useEffect(() => {
    const fetchImage = async () => {
      // Your image fetching logic using the getImage function here
      try {
        // Assuming you have the getImage function defined elsewhere
        const image = await getImage(src, token, '/profile/picture');
        setImageDataUrl(image);
      } catch (error) {
        // console.error('Error retrieving image:', error);
      }
    };

    fetchImage();
  }, [src]);

  return imageDataUrl;
};

export default useProfilePicture;
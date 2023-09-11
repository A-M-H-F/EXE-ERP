import endUrl from "@utils/endUrl";
import axios from "axios";

const getImage = async (src: string, token: string, url: string) => {
    if (!src) return null;

    try {
        const response = await axios.get(`${endUrl}/images${url}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { src: src },
            responseType: 'arraybuffer', // Receive the image data as an array buffer
        });

        const imageBlob = new Blob([response.data], { type: response.headers['content-type'] });
        const imageObjectURL = URL.createObjectURL(imageBlob);
                
        return imageObjectURL;
    } catch (error: any) {
        // console.error('Error retrieving image:', error);
        return null;
    }
};

export default getImage;
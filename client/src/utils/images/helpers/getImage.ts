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

        // Convert the array buffer to a base64-encoded data URL
        const image = `data:${response.headers['content-type']};base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
        return image;
    } catch (error: any) {
        // console.error('Error retrieving image:', error);
        return null;
    }
};

export default getImage;
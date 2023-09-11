import { CircleLoader } from 'react-spinners'
// import HashLoader from "react-spinners/HashLoader"

const colors = [
    '#36d7b7',
    '#000000',
    '#00ff19',
    '#8000ff',
    '#ff00d6',
    '#ff0000'
]

type Loader = {
    size: number
}

const LoaderWithRandomColor = ({ size }: Loader) => {
    const randomColorIndex = Math.floor(Math.random() * colors.length)
    const randomColor = colors[randomColorIndex];
                    {/* <HashLoader color="#36d7b7" /> */}

                    {/* <CircleLoader size={150} color={''} /> */}
    return <CircleLoader size={size} color={randomColor} />
};

export default LoaderWithRandomColor
import { EyeOutlined } from '@ant-design/icons'
import useBuildingImage from '@utils/images/useBuildingImage'
import { Image, Tooltip } from 'antd'
import { useState } from 'react'

type BuildingImageProps = {
    image: string | any
}

const BuildingImage = ({ image }: BuildingImageProps) => {
    const [visible, setVisible] = useState(false)

    return (
        <>
            {image === '' || !image ?
                'Building Image Not Available' :
                <Tooltip title='View Building Image'>
                    <EyeOutlined
                        onClick={() => setVisible(true)}
                    />
                </Tooltip>
            }
            <Image
                style={{ display: 'none' }}
                src={image === '' ? '' : useBuildingImage(image)}
                preview={{
                    visible: visible,
                    scaleStep: 0.5,
                    src: image === '' ? '' : useBuildingImage(image),
                    onVisibleChange: (value) => {
                        setVisible(value);
                    },
                }}
            />
        </>
    )
}

export default BuildingImage
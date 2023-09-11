import { Button, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import { MdKeyboardReturn } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { AddNewLocation } from '../components/addNew'
import useDocumentMetadata from '@hooks/useDocumentMetadata'

const AddNewLocationPage = () => {
    useDocumentMetadata('EX - Add New Location', 'Extreme Engineering - Add New Location Page')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [])

    return (
        <Skeleton loading={loading} active paragraph={{ rows: 8 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <Link to={'/locations'}>
                    <Button
                        style={{
                            marginTop: '1em',
                            color: 'green'
                        }}
                        icon={<MdKeyboardReturn />}
                    >
                        Back To Locations List
                    </Button>
                </Link>
            </div>

            <AddNewLocation />
        </Skeleton>
    )
}

export default AddNewLocationPage
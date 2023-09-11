import React from 'react'
import { Button, Result } from 'antd'
import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { useNavigate } from 'react-router-dom'

const NotFound: React.FC = () => {
    useDocumentMetadata('EX - Not Found', 'Extreme Engineering - Not Found 404')

    const navigate = useNavigate()
    const handleNavigateToHome = () => {
        navigate('/')
    }

    return (
        <div
        style={{
            display: 'flex',
            justifyContent: 'center'
        }}
        >
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button onClick={handleNavigateToHome} type="primary">Back Home</Button>}
                style={{
                    maxWidth: 'fit-content'
                }}
            />
        </div>
    )
}

export default NotFound

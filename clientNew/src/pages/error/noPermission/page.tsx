import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import useDocumentMetadata from '@hooks/useDocumentMetadata';

const NoPermissionPage: React.FC = () => {
    useDocumentMetadata('EX - No Permission', 'Extreme Engineering - No Permission Page')

    const navigate = useNavigate()
    const handleNavigateToHome = () => {
        navigate('/')
    }

    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button onClick={handleNavigateToHome} type="primary">Back Home</Button>}
        />
    )
}

export default NoPermissionPage
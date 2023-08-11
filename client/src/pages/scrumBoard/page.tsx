import React from 'react'
import { ScrumBoardLayout } from './layout';
import useDocumentMetadata from '@hooks/useDocumentMetadata';

const ScrumBoard: React.FC = () => {
    useDocumentMetadata('EX - Scrum Board', 'Extreme Engineering - Scrum Board Page')
    return (
        <ScrumBoardLayout />
    );
}

export default ScrumBoard
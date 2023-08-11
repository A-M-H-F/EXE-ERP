import React, { useState, useEffect } from 'react'
import { VStack } from '@chakra-ui/react'
import LoaderWithRandomColor from './Loader'
import { useLocation } from 'react-router-dom'

// interface Props {
//     loadingTime: number;
// }
// (WrappedComponent: React.ComponentType<P>, loadingTime: number)
const useLoader = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    // return (props: P && Props)
    return (props: P) => {
        const [loading, setLoading] = useState(true);
        let location = useLocation()

        useEffect(() => {
            setLoading(true);
            // Simulating a long-running task
            setTimeout(() => {
                setLoading(false)
            }, 1500);
        }, [location]);

        if (loading) {
            return (
                <VStack mt={'20%'}>
                    <LoaderWithRandomColor size={150} />
                </VStack>
            )
        }

        return <WrappedComponent {...props} />
    }
}

export default useLoader
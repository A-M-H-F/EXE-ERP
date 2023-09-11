import React, { useState, useEffect } from 'react'
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
            }, 800);
        }, [location]);

        if (loading) {
            return (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                        padding: '48px 32px'
                    }}
                >
                    <LoaderWithRandomColor size={150} />
                </div>
            )
        }

        return <WrappedComponent {...props} />
    }
}

export default useLoader
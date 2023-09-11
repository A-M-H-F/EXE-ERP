import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const socketProvider = io("http://localhost:5000", {
    reconnectionDelayMax: 1000,
    autoConnect: true,
    withCredentials: true,
});

export function useSocket() {
    const [isConnected, setIsConnected] = useState(socketProvider.connected);
    const [isGlobalRoomJoined, setIsRoomJoined] = useState(false);

    useEffect(() => {
        const handleConnect = () => {
            // socketProvider.connect()
            socketProvider.emit('joinRoom', 'all');
            setIsConnected(true);
            // console.log('Connected to server');
        };

        const handleRoomJoined = () => {
            setIsRoomJoined(true);
        };

        const handleDisconnect = () => {
            setIsConnected(false);
            setIsRoomJoined(false);
            // handleConnect()
            // console.log('Disconnected from server. Attempting to reconnect...');
        };

        socketProvider.on('connect', handleConnect);
        socketProvider.on('reconnect', handleConnect);
        socketProvider.on('disconnect', handleDisconnect);
        socketProvider.on('roomJoined', handleRoomJoined);

        socketProvider.on('error', () => {
            // handleConnect()
            // console.error('Socket connection error:', error);
        });

        return () => {
            socketProvider.off('connect', handleConnect);
            socketProvider.off('reconnect', handleConnect);
            socketProvider.off('disconnect', handleDisconnect);
            socketProvider.off('roomJoined', handleRoomJoined);
        };
    }, []);

    // useEffect(() => {
    //     const join = () => {
    //         socketProvider.emit('joinRoom', 'all');
    //     };

    //     if (!isRoomJoined) {
    //         join()
    //     }

    //     return () => {
    //         socketProvider.off('roomJoined', join);
    //     };
    // }, [isRoomJoined])

    return { socketProvider, isConnected, isGlobalRoomJoined };
}
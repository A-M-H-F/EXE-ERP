import { io } from 'socket.io-client';

export const socketProvider = io("http://localhost:5000", {
    reconnectionDelayMax: 2000,
    autoConnect: true,
    // auth: {
    //   token: "123"
    // }
});

socketProvider.on("connect", () => {
    socketProvider.emit("joinRoom", "admin");
});
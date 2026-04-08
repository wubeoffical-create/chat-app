import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5678";
const socket = io(SOCKET_URL);

export default socket;

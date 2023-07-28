import io from "socket.io-client"
const CONN_PORT='localhost:3001/';

let socket;
export default socket=io(CONN_PORT)
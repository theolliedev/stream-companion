import {io, Socket} from "socket.io-client";
import {invoke} from "@tauri-apps/api/core";

let client: Socket;

const init = async () => {
    client = io("127.0.0.1:8754", {
        auth: {
            token: await invoke("get_auth_token")
        }
    }).connect();

    client.on("connect", () => {
        console.log("Websocket: Connected")
    })

    client.on("connect_error", (message) => {
        console.log("Websocket: Failed to connect", message)
    })

    client.on("disconnect", (message) => {
        console.log("Websocket: Disconnected", message)
    })

    return client;
}

export { init, client }
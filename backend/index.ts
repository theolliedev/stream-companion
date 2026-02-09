import {aiInit, aiMessage, aiStart} from "./src/ai.js";
import {Server} from "socket.io";
import {WebSocketServer} from "ws";

let userConfig: any;
let sendMessage: StreamCompanionCallback | null;
type StreamCompanionCallback = (message: string) => void;

const io = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const wss = new WebSocketServer({
    port: 6562
})


wss.on("connection", (client) => {
    console.log("Websocket: Connected");

    sendMessage = (message: string) => {
        try {
            client.send(message);
        } catch (e) {
            console.log(e);
        }
    }

    client.on("message", async (message: string) => {
        console.log("Websocket: Prompting");
        const res = await aiMessage(message);
        if (sendMessage && res.success && typeof res.message == "string") {
            console.log(`Websocket: ${res.message}`);
            console.log("Websocket: Sending Message")
            sendMessage(res.message);
        }
    })

    client.on("close", () => {
        console.log("Websocket: Disconnected");
    })
})

io.on("connection", (socket) => {
    console.log("Socket.io: Connected");

    socket.on("ai:init", async (data, callback) => {
        userConfig = data;
        callback(await aiInit(data));
    })

    socket.on("ai:restart", async (data, callback) => {
        console.log("Socket.io: Restarting AI")
        if (data) {
            userConfig = data;
            callback(await aiStart(data));
        } else {
            callback(await aiStart(userConfig));
        }
    })

    socket.on("ai:message", async (data, callback) => {
        console.log("Socket.io: Prompting");
        const res = await aiMessage(data);
        console.log(`Socket.io: ${res.message}`);
        if (sendMessage && res.success && typeof res.message == "string") {
            console.log(`Socket.io: ${res.message}`);
            console.log("Socket.io: Sending Message");
            sendMessage(res.message);
        }
        console.log("Socket.io: Callback");
        callback(res);
    })

    socket.on('disconnect', () => {
        console.log("Socket.io: Disconnected");
    })
});

io.listen(8754)
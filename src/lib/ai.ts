import {Socket} from "socket.io-client";
import {toast} from "sonner";
import * as stronghold from "@/lib/stronghold.ts"

const init = (client: Socket, apiKey: string, context: string, callback: (res: boolean) => void) => {
    toast.promise(new Promise(async (resolve, reject) => {
        try {
            client.emit("ai:init", {
                apiKey: apiKey,
                message: JSON.stringify({
                    type: "system",
                    context: context
                })
            }, (res: any) => {
                console.log(res)

                if (res.success) {
                    resolve("");
                    callback(true);
                    return;
                }

                throw new Error("AI Companion failed to start");
            })
        } catch (e) {
            console.error(e)
            reject("");
            callback(false);
        }
    }), {
        loading: "Starting AI Companion...",
        success: "AI Companion started successfully",
        error: "Failed to start AI Companion"
    })
}

const restart = (client: Socket, context: string, callback: (res: boolean) => void) => {
    toast.promise(new Promise(async (resolve, reject) => {
        try {
            const apiKey = await fetchAPIKey();

            if (!apiKey) {
                reject("");
                callback(false);
                return;
            }

            client.emit("ai:restart", {
                apiKey: apiKey,
                message: JSON.stringify({
                    type: "system",
                    context: context
                })
            }, (res: any) => {
                console.log(res)

                if (res.success) {
                    resolve("");
                    callback(true);
                    return;
                }

                throw new Error("AI Companion failed to restart");
            })
        } catch (e) {
            console.error(e)
            reject("");
            callback(false);
        }
    }), {
        loading: "Restarting AI Companion...",
        success: "AI Companion restarted successfully",
        error: "Failed to restart AI Companion"
    })
}

const fetchAPIKey = async () => {
    const { getRecord } = await stronghold.init();
    if (!getRecord) return;

    return await getRecord("apiKey");
}

const updateAPIKey = async (key: string) => {
    const { insertRecord } = await stronghold.init();
    if (!insertRecord) return;
    await insertRecord("apiKey", key);
}

export { init, restart, fetchAPIKey, updateAPIKey }
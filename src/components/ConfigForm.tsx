import {Field, FieldDescription, FieldGroup} from "@/components/ui/field.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
// import {
//     Combobox,
//     ComboboxContent,
//     ComboboxEmpty,
//     ComboboxInput,
//     ComboboxItem,
//     ComboboxList
// } from "@/components/ui/combobox"
import {Status} from "@/components/Status.tsx";
import {toast} from "sonner";
import * as config from "@/lib/config.ts";
import * as ai from "@/lib/ai.ts";
import {client} from "@/lib/backend.ts";
import {updateAPIKey} from "@/lib/ai.ts";
import {useEffect, useRef} from "react";

// const aiModels = [
//     "gpt-4o"
// ]

const ConfigForm = ({ userConfig, setUserConfig, setConfigLoadingState, loadingState, setAiState, aiState }: { userConfig: any, setUserConfig: any, setConfigLoadingState: any, loadingState: any, setAiState: any, aiState: any }) => {
    const apiKeyInputRef = useRef<HTMLInputElement>(null);

    const updateConfig = (data: any) => {
        const newConfig = {...userConfig, ...data};
        setUserConfig(newConfig);
    }

    const configFormHandler = async (event: any) => {
        event.preventDefault();
        setConfigLoadingState(true);

        const key = apiKeyInputRef.current?.value ?? "";

        toast.promise(() => new Promise(async (resolve) => {
            await config.save(userConfig)
            await updateAPIKey(key);

            if (key) {
                setAiState(false);
                ai.restart(client, userConfig.context, async (res) => {
                    setAiState(res);
                })
            }

            setConfigLoadingState(false);
            resolve("");
        }), {
            loading: "Saving...",
            success: () => `Settings have been saved!`,
            error: "Error",
        })
    }

    const restartHandling = async (event: any) => {
        event.preventDefault();
        setConfigLoadingState(true);

        const currentConfig = await config.fetch();
        setAiState(false);

        ai.restart(client, currentConfig.context, async (res) => {
            setAiState(res);
        })

        setConfigLoadingState(false);
    }

    useEffect(() => {
        const aiInitialization = async () => {
            toast.promise(new Promise(async (resolve) => {
                const fetchedConfig = await config.fetch();
                const apiKey = await ai.fetchAPIKey();

                setUserConfig(fetchedConfig);

                if (apiKey && apiKeyInputRef.current) {
                    apiKeyInputRef.current.value = apiKey;
                    ai.init(client, apiKey, userConfig.context, (res) => {
                        setAiState(res);
                    });
                }

                setConfigLoadingState(false);

                resolve("")
            }), {
                loading: "Loading configuration...",
                success: () => `Configuration has been loaded!`,
                error: "Error",
            })
        }
        aiInitialization();
    }, [apiKeyInputRef]);

    return (
        <form>
            <FieldGroup>
                <div className="flex gap-3 items-center">
                    <Status state={aiState} />
                    <h2 className="scroll-m-20 text-3xl font-semibold tracking-none first:mt-0">
                        AI Companion
                    </h2>
                </div>
                <FieldGroup className="grid">
                    {/*<Field>*/}
                    {/*    <Label htmlFor="aimodel">AI Model</Label>*/}
                    {/*    <FieldDescription>Choose which AI Model you want to use.</FieldDescription>*/}
                    {/*    <Combobox id="aimodel" value="gpt-4o" items={aiModels}>*/}
                    {/*        <ComboboxInput disabled placeholder="Select an AI Model" />*/}
                    {/*        <ComboboxContent>*/}
                    {/*            <ComboboxEmpty>No items found.</ComboboxEmpty>*/}
                    {/*            <ComboboxList>*/}
                    {/*                {(item) => (*/}
                    {/*                    <ComboboxItem key={item} value={item}>*/}
                    {/*                        {item}*/}
                    {/*                    </ComboboxItem>*/}
                    {/*                )}*/}
                    {/*            </ComboboxList>*/}
                    {/*        </ComboboxContent>*/}
                    {/*    </Combobox>*/}
                    {/*</Field>*/}
                    <Field>
                        <Label htmlFor="apikey" className="mb-1">API Key</Label>
                        <FieldDescription>Enter your API Key here.</FieldDescription>
                        <Input ref={apiKeyInputRef} id="apikey" type="password" placeholder="sk-proj..." disabled={loadingState} />
                    </Field>
                </FieldGroup>
                <Field>
                    <Label htmlFor="aicontext">AI Context</Label>
                    <FieldDescription>Describe how you want your companion will behave!</FieldDescription>
                    <Textarea id="aicontext" className="max-h-40" placeholder="You are a..."
                              disabled={loadingState} onChange={(e) => updateConfig({context: e.target.value})}
                              value={userConfig.context ?? ""}/>
                </Field>
                <Field orientation="horizontal">
                    <Button onClick={configFormHandler} disabled={loadingState}>
                        Save
                    </Button>
                    <Button onClick={restartHandling} disabled={loadingState || !aiState}>
                        Restart
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}

export { ConfigForm }
import "./App.css";
import {ConfigForm} from "@/components/ConfigForm.tsx";
import {MessageForm} from "@/components/MessageForm.tsx";
import {useEffect, useState} from "react";
import * as backend from "@/lib/backend.ts"
import {Config} from "@/lib/config.ts";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

function App() {
  const [userConfig, setUserConfig] = useState<Config>({ context: "" })
  const [configLoadingState, setConfigLoadingState] = useState(true);
  const [aiState, setAiState] = useState(false)

  useEffect(() => {
    backend.init();
  }, []);

  return (
    <main className="w-full h-screen grid lg:grid-cols-2">
          <ScrollArea className="flex flex-col lg:h-screen bg-gray-100">
            <div className="flex flex-col px-8 py-12 gap-y-12">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Configuration
              </h1>
              <ConfigForm
                  userConfig={userConfig}
                  setUserConfig={setUserConfig}
                  loadingState={configLoadingState}
                  setConfigLoadingState={setConfigLoadingState}
                  aiState={aiState}
                  setAiState={setAiState}
              />
            </div>
          </ScrollArea>
        <div className="flex flex-col w-full px-8 py-12 bg-gray-200">
          <MessageForm isAiReady={aiState} />
        </div>
    </main>
  );
}

export default App;

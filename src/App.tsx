import "./App.css";
import {ConfigForm} from "@/components/ConfigForm.tsx";
import {MessageForm} from "@/components/MessageForm.tsx";
import {useEffect, useState} from "react";
import * as backend from "@/lib/backend.ts"
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {toast} from "sonner";

function App() {
  const [backendReady, setBackendReady] = useState(false);
  const [aiReady, setAiReady] = useState(false);

  useEffect(() => {
    const backendInit = async () => {
      try {
        const client = await backend.init();
        if (!client) {
          toast.error("Failed to initialize backend connection.");
          return;
        }
        setBackendReady(true);
      } catch (error) {
        console.error("Error initializing backend:", error);
        toast.error("Failed to initialize backend connection.");
      }
    }
    backendInit();
  }, []);

  return (
    <main className="w-full h-screen grid lg:grid-cols-2">
          <ScrollArea className="flex flex-col lg:h-screen bg-gray-100">
            <div className="flex flex-col px-8 py-12 gap-y-12">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Configuration
              </h1>
              <ConfigForm backendReady={backendReady} aiReady={aiReady} setAiReady={setAiReady} />
            </div>
          </ScrollArea>
        <div className="flex flex-col w-full px-8 py-12 bg-gray-200">
          <MessageForm isAiReady={aiReady} />
        </div>
    </main>
  );
}

export default App;

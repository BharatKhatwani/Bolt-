import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StepsList } from "../components/StepsList";
import { FileExplorer } from "../components/FileExplorer";
import { TabView } from "../components/TabView";
import { CodeEditor } from "../components/CodeEditor";
import { PreviewFrame } from "../components/PreviewFrame";
import type { Step, FileItem } from "../types";
import { useWebContainer } from "../hook/useWebContainer";
import { Loader } from "../components/Loader";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { parseXml } from "../steps";

export function Builder() {
  const location = useLocation();
  const { prompt } = (location.state as { prompt: string }) || { prompt: "" };

  // UI States
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [llmMessages, setLlmMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const webcontainer = useWebContainer();

  // Initialize template and chat steps
  async function init() {
    setLoading(true);
    try {
      // Validate prompt
      if (!prompt || !prompt.trim()) {
        console.error("Prompt is empty");
        alert("Please provide a valid prompt");
        return;
      }

      console.log("Sending prompt:", prompt.trim());

      // 1️⃣ Fetch template from backend
      const templateRes = await axios.post(`${BACKEND_URL}/template`, {
        prompt: prompt.trim(),
      });

      const { prompts, uiPrompts } = templateRes.data;

      // 2️⃣ Parse UI steps
      const initialSteps: Step[] = uiPrompts[0]
        ? parseXml(uiPrompts[0]).map((x: Step, index: number) => ({
            ...x,
            id: x.id || index + 1,
            status: "pending",
          }))
        : [];
      setSteps(initialSteps);

      // 3️⃣ Fetch chat steps
      const chatRes = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [...prompts, prompt].map((content: string) => ({
          role: "user",
          content,
        })),
      });

      const chatSteps: Step[] = parseXml(chatRes.data.response).map((x: Step) => ({
        ...x,
        status: "pending",
      }));

      // 4️⃣ Update steps & LLM messages
      setSteps(prev => [...prev, ...chatSteps]);
      setLlmMessages([
        ...prompts.map((c: string) => ({ role: "user", content: c })),
        { role: "user", content: prompt },
        { role: "assistant", content: chatRes.data.response },
      ]);
    } catch (error: any) {
      console.error("Error fetching template/chat:", error);
      
      // Show detailed error message
      const errorMsg = error.response?.data?.error || error.message || "Unknown error occurred";
      alert(`Error: ${errorMsg}\n\nPlease check the console for more details.`);
    } finally {
      setLoading(false);
    }
  }

  // Load template/chat on mount
  useEffect(() => {
    init();
  }, []);

  // Convert steps to file structure
  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;

    // Set pending steps to in-progress
    const pendingSteps = steps.filter(step => step.status === "pending");
    if (pendingSteps.length > 0) {
      setSteps(s =>
        s.map(step => 
          step.status === "pending" 
            ? { ...step, status: "in-progress" as const }
            : step
        )
      );
    }

    steps
      .filter(step => step.status === "in-progress")
      .forEach(step => {
        updateHappened = true;
        if (step.type === "CreateFile") {
          let parsedPath = step.path?.split("/") ?? [];
          let currentFileStructure = [...originalFiles];
          let finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              // final file
              let file = currentFileStructure.find(x => x.path === currentFolder);
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              // folder
              let folder = currentFileStructure.find(x => x.path === currentFolder);
              if (!folder) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }
              currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
      // Add a small delay to show the loading state
      setTimeout(() => {
        setFiles(originalFiles);
        setSteps(s =>
          s.map(step => ({
            ...step,
            status: "completed",
          }))
        );
      }, 1000); // 1 second delay to show the loader
    }
  }, [steps]);

  // Mount files to WebContainer
  useEffect(() => {
    if (!webcontainer || files.length === 0) return;

    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, parent: Record<string, any>) => {
        if (file.type === "folder") {
          const dirContents: Record<string, any> = {};
          if (file.children) {
            file.children.forEach(child => processFile(child, dirContents));
          }
          parent[file.name] = {
            directory: dirContents,
          };
        } else {
          parent[file.name] = {
            file: { contents: file.content || "" },
          };
        }
      };

      files.forEach(file => processFile(file, mountStructure));
      return mountStructure;
    };

    const mountStructure = createMountStructure(files);
    console.log("Mounting files to WebContainer:", mountStructure);
    
    webcontainer.mount(mountStructure).then(() => {
      console.log("Files mounted successfully");
    }).catch((err) => {
      console.error("Failed to mount files:", err);
    });
  }, [files, webcontainer]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-100">Website Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </header>

      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-1 grid grid-cols-4 gap-6 p-6 overflow-hidden">
          {/* Steps */}
          <div className="col-span-1 h-full overflow-auto">
            <StepsList steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />
          </div>

          {/* File Explorer */}
          <div className="col-span-1 h-full overflow-auto">
            <FileExplorer files={files} onFileSelect={setSelectedFile} selectedFile={selectedFile} />
          </div>

          {/* Editor / Preview */}
          <div className="col-span-2 flex flex-col bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 relative min-h-0">
              {loading && <Loader />}
              {activeTab === "code" ? <CodeEditor file={selectedFile} /> : webcontainer ? <PreviewFrame webContainer={webcontainer} files={files} /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

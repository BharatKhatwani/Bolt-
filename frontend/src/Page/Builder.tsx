import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import type { Step, FileItem } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hook/useWebContainer';
import { Textarea } from '../components/ui/textarea.tsx';
import { Loader } from '../components/Loader';
import { Button } from '../components/ui/button.tsx';

import JSZip from 'jszip';
import { Download, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);



const handleDownloadZip = async () => {
    const zip = new JSZip();

    // Recursive function to add files to zip
    const addFilesToZip = (items: FileItem[], folder: JSZip | null = null) => {
      items.forEach(item => {
        if (item.type === 'file') {
          const content = item.content || '';
          // Remove leading slash from path for cleaner zip structure
          const zipPath = item.path?.startsWith('/') ? item.path.slice(1) : item.path || item.name;
          
          if (folder) {
            folder.file(item.name, content);
          } else {
            zip.file(zipPath, content);
          }
        } else if (item.type === 'folder' && item.children) {
          // Create folder in zip
          const folderPath = item.path?.startsWith('/') ? item.path.slice(1) : item.path || item.name;
          const newFolder = folder ? folder.folder(item.name) : zip.folder(folderPath);
          
          if (newFolder) {
            addFilesToZip(item.children, newFolder);
          }
        }
      });
    };

    // Add all files to the zip
    addFilesToZip(files);

    // Generate zip file
    try {
      const blob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'project.zip';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating zip file:', error);
      alert('Failed to generate zip file. Please try again.');
    }
  };






  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === 'CreateFile') {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
    console.log(files);
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
  
    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });
    setTemplateSet(true);
    
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

    setLoading(false);

    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

    setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}])
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
 <header className="border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-blue-400">BOLT</h1>
          
          {/* Actions */}
          <div className="flex space-x-4 items-center text-gray-100">
            {/* Show download button only when all steps are completed */}
            {steps.length > 0 && steps.every(step => step.status === 'completed') && (
              <button 
                onClick={handleDownloadZip}
                disabled={files.length === 0}
                className="flex items-center space-x-1 cursor-pointer hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download size={18} />
                <span>Download Zip File</span>
              </button>
            )}
            <Link to="/" className="flex items-center space-x-1 hover:text-blue-400">
              <Home size={18} />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </header>

      
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-4 p-4">
          <div className="col-span-1 flex flex-col h-[calc(100vh-7rem)]">
            <div className="flex-1 overflow-hidden mb-4">
              <StepsList
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
            </div>
            <div className="border-t border-gray-700 pt-4 pb-2">
              {(loading || !templateSet) ? (
                <div className="flex justify-center">
                  <Loader />
                </div>
              ) : (
                <div className="flex gap-2">
                  <Textarea
                    value={userPrompt} 
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt..."
                    className="flex-1 p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[80px]"
                  />
                  <Button
                    onClick={async () => {
                      const newMessage = {
                        role: "user" as "user",
                        content: userPrompt
                      };

                      setLoading(true);
                      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                        messages: [...llmMessages, newMessage]
                      });
                      setLoading(false);

                      setLlmMessages(x => [...x, newMessage]);
                      setLlmMessages(x => [...x, {
                        role: "assistant",
                        content: stepsResponse.data.response
                      }]);
                      
                      setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                        ...x,
                        status: "pending" as "pending"
                      }))]);

                      setPrompt("");
                    }} 
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer  text-white px-6 rounded-lg font-medium transition-colors duration-200 self-end"
                  >
                    Send
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-1 h-[calc(100vh-7rem)]">
            <FileExplorer 
              files={files} 
              onFileSelect={setSelectedFile}
            />
          </div>
          <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg flex flex-col h-[calc(100vh-7rem)]">
  <TabView activeTab={activeTab} onTabChange={setActiveTab} />
  <div className="flex-1 overflow-hidden">
    {activeTab === 'code' ? (
      <CodeEditor file={selectedFile} />
    ) : (
      <PreviewFrame webContainer={webcontainer} files={files} />
    )}
  </div>
</div>

        </div>
      </div>
    </div>
  );
}
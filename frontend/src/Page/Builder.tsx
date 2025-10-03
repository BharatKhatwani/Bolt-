import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import type { Step, FileItem } from '../types';
import axios from 'axios';
import { parseXml } from '../steps';
import { useWebContainer } from '../hook/useWebContainer';
import { Textarea } from '../components/ui/textarea.tsx';
import { Loader } from '../components/Loader';
import { Button } from '../components/ui/button.tsx';
import JSZip from 'jszip';
import { Download, Home, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

  // Mobile sidebar states
  const [showSteps, setShowSteps] = useState(false);
  const [showFiles, setShowFiles] = useState(false);

  const handleDownloadZip = async () => {
    const zip = new JSZip();

    const addFilesToZip = (items: FileItem[], folder: JSZip | null = null) => {
      items.forEach(item => {
        if (item.type === 'file') {
          const content = item.content || '';
          const zipPath = item.path?.startsWith('/') ? item.path.slice(1) : item.path || item.name;
          
          if (folder) {
            folder.file(item.name, content);
          } else {
            zip.file(zipPath, content);
          }
        } else if (item.type === 'folder' && item.children) {
          const folderPath = item.path?.startsWith('/') ? item.path.slice(1) : item.path || item.name;
          const newFolder = folder ? folder.folder(item.name) : zip.folder(folderPath);
          
          if (newFolder) {
            addFilesToZip(item.children, newFolder);
          }
        }
      });
    };

    addFilesToZip(files);

    try {
      const blob = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'project.zip';
      document.body.appendChild(link);
      link.click();
      
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
        let parsedPath = step.path?.split("/") ?? [];
        let currentFileStructure = [...originalFiles];
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
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
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
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
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
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

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
    setShowFiles(false); // Close mobile drawer after selection
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="border-b border-gray-700 px-4 md:px-6 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSteps(!showSteps)}
              className="lg:hidden text-gray-100 hover:text-blue-400 transition-colors"
              aria-label="Toggle steps menu"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-blue-400">BOLT</h1>
          </div>
          
          <div className="flex space-x-2 md:space-x-4 items-center text-gray-100 text-sm md:text-base">
            {steps.length > 0 && steps.every(step => step.status === 'completed') && (
              <button 
                onClick={handleDownloadZip}
                disabled={files.length === 0}
                className="flex items-center space-x-1 cursor-pointer hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Download project as zip"
              >
                <Download size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="hidden sm:inline">Download Zip</span>
              </button>
            )}
            <Link to="/" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
              <Home size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-4 p-2 md:p-4">
          {/* Steps Panel - Mobile Drawer / Desktop Column */}
          <div className={`
            fixed lg:relative inset-y-0 left-0 z-40 w-80 sm:w-96 lg:w-auto
            lg:col-span-1 flex flex-col bg-gray-900 lg:bg-transparent
            transform transition-transform duration-300 ease-in-out
            ${showSteps ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)] lg:h-[calc(100vh-7rem)]
            border-r border-gray-800 lg:border-0
          `}>
            <div className="flex lg:hidden justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-gray-100">Steps</h2>
              <button 
                onClick={() => setShowSteps(false)} 
                className="text-gray-400 hover:text-gray-100 transition-colors"
                aria-label="Close steps menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden mb-4 p-4 lg:p-0">
              <StepsList
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
            </div>
            
            <div className="border-t border-gray-700 pt-4 pb-2 px-4 lg:px-0">
              {(loading || !templateSet) ? (
                <div className="flex justify-center">
                  <Loader />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Textarea
                    value={userPrompt} 
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt..."
                    className="flex-1 p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
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
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 rounded-lg font-medium transition-colors duration-200 self-end sm:self-stretch"
                  >
                    Send
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Overlay for mobile steps */}
          {showSteps && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setShowSteps(false)}
              aria-label="Close steps menu overlay"
            />
          )}

          {/* File Explorer - Mobile Drawer / Desktop Column */}
          <div className={`
            fixed lg:relative inset-y-0 left-0 z-40 w-80 sm:w-96 lg:w-auto
            lg:col-span-1 bg-gray-900 lg:bg-transparent
            transform transition-transform duration-300 ease-in-out
            ${showFiles ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)] lg:h-[calc(100vh-7rem)]
            p-4 lg:p-0
            border-r border-gray-800 lg:border-0
          `}>
            <div className="flex lg:hidden justify-between items-center mb-4 pb-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-gray-100">Files</h2>
              <button 
                onClick={() => setShowFiles(false)} 
                className="text-gray-400 hover:text-gray-100 transition-colors"
                aria-label="Close files menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <FileExplorer 
              files={files} 
              onFileSelect={handleFileSelect}
            />
          </div>

          {/* Overlay for mobile files */}
          {showFiles && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setShowFiles(false)}
              aria-label="Close files menu overlay"
            />
          )}

          {/* Code/Preview Panel */}
          <div className="col-span-1 lg:col-span-2 bg-gray-900 rounded-lg shadow-lg flex flex-col h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)] lg:h-[calc(100vh-7rem)]">
            <div className="flex items-center justify-between border-b border-gray-700">
              <button 
                onClick={() => setShowFiles(!showFiles)}
                className="lg:hidden text-gray-100 hover:text-blue-400 px-3 py-3 transition-colors"
                aria-label="Toggle files menu"
              >
                <Menu size={20} />
              </button>
              <div className="flex-1">
                <TabView activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
            </div>
            
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
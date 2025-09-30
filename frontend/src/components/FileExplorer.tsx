import { useState } from 'react';
import { 
  FolderTree, 
  File, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Code, 
  Image, 
  FileJson, 
  Folder,
  FolderOpen,
  Loader2
} from 'lucide-react';
import  type { FileItem } from '../types';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  selectedFile?: FileItem | null;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
  selectedFile?: FileItem | null;
}

// Function to get appropriate icon for file types
function getFileIcon(fileName: string, isFolder: boolean, isExpanded: boolean) {
  if (isFolder) {
    return isExpanded ? (
      <FolderOpen className="w-4 h-4 text-blue-400" />
    ) : (
      <Folder className="w-4 h-4 text-blue-400" />
    );
  }

  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
      return <Code className="w-4 h-4 text-yellow-400" />;
    case 'ts':
    case 'tsx':
      return <Code className="w-4 h-4 text-blue-500" />;
    case 'html':
      return <FileText className="w-4 h-4 text-orange-500" />;
    case 'css':
      return <FileText className="w-4 h-4 text-blue-400" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-yellow-500" />;
    case 'md':
      return <FileText className="w-4 h-4 text-gray-400" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <Image className="w-4 h-4 text-green-400" />;
    default:
      return <File className="w-4 h-4 text-gray-400" />;
  }
}

function FileNode({ item, depth, onFileClick, selectedFile }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = selectedFile?.path === item.path;
  const isLoading = item.isLoading;

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div className="select-none">
      <div
        className={`
          flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200
          ${isLoading ? 'opacity-70' : 'cursor-pointer hover:bg-gray-800/80 hover:shadow-sm'}
          ${isSelected ? 'bg-blue-600/20 border-l-2 border-blue-400' : ''}
          ${item.type === 'file' && !isLoading ? 'hover:bg-gray-700/50' : ''}
        `}
        style={{ paddingLeft: `${depth * 1.2 + 0.5}rem` }}
        onClick={!isLoading ? handleClick : undefined}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
        ) : item.type === 'folder' ? (
          <span className="text-gray-400 transition-transform duration-200">
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </span>
        ) : (
          <span className="w-3.5 h-3.5" />
        )}
        
        <div className={`flex items-center gap-2 flex-1 min-w-0 ${isLoading ? 'opacity-70' : ''}`}>
          {getFileIcon(item.name, item.type === 'folder', isExpanded)}
          <span 
            className={`text-sm truncate ${isLoading ? 'text-gray-400 italic' : 'text-gray-300'}`}
          >
            {item.name}
            {isLoading && <span className="text-gray-400 text-xs ml-1">(generating...)</span>}
          </span>
        </div>
      </div>
      
      {item.type === 'folder' && isExpanded && item.children && (
        <div className="ml-1">
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect, selectedFile }: FileExplorerProps) {
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-100">
          <FolderTree className="w-5 h-5 text-blue-400" />
          File Explorer
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          {files.length} {files.length === 1 ? 'item' : 'items'}
        </p>
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-0.5">
          {files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FolderTree className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No files yet</p>
            </div>
          ) : (
            files.map((file, index) => (
              <FileNode
                key={`${file.path}-${index}`}
                item={file}
                depth={0}
                onFileClick={onFileSelect}
                selectedFile={selectedFile}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

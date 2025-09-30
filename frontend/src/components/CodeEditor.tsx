import Editor from '@monaco-editor/react';
import type { FileItem } from '../types/index';

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-gray-900">
        <div className="text-center">
          <div className="text-4xl mb-4">📁</div>
          <p className="text-lg font-medium">Select a file to view its contents</p>
          <p className="text-sm text-gray-500 mt-2">Choose a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="typescript"
        theme="vs-dark"
        value={file.content || ''}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
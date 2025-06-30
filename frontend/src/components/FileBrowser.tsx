import { useState, useEffect } from 'react'
import { FolderIcon, DocumentIcon } from '@heroicons/react/24/outline'

interface FileItem {
  name: string
  path: string
  type: 'file' | 'directory'
  size?: number
}

interface FileBrowserProps {
  onSelect: (path: string) => void
  selectedPath?: string
}

const FileBrowser = ({ onSelect, selectedPath }: FileBrowserProps) => {
  const [currentPath, setCurrentPath] = useState<string>('/')
  const [files, setFiles] = useState<FileItem[]>([])

  // Initialize file browser
  useEffect(() => {
    navigateToPath('/')
  }, [])

  // Mock file system for web version
  const mockFileSystem: Record<string, FileItem[]> = {
    '/': [
      { name: 'Users', path: '/Users', type: 'directory' },
      { name: 'Projects', path: '/Projects', type: 'directory' },
      { name: 'Desktop', path: '/Desktop', type: 'directory' }
    ],
    '/Users': [
      { name: 'john', path: '/Users/john', type: 'directory' },
      { name: 'admin', path: '/Users/admin', type: 'directory' }
    ],
    '/Users/john': [
      { name: 'Documents', path: '/Users/john/Documents', type: 'directory' },
      { name: 'Projects', path: '/Users/john/Projects', type: 'directory' },
      { name: 'Desktop', path: '/Users/john/Desktop', type: 'directory' }
    ],
    '/Users/john/Projects': [
      { name: 'my-react-app', path: '/Users/john/Projects/my-react-app', type: 'directory' },
      { name: 'node-backend', path: '/Users/john/Projects/node-backend', type: 'directory' },
      { name: 'python-ml', path: '/Users/john/Projects/python-ml', type: 'directory' }
    ],
    '/Projects': [
      { name: 'frontend-app', path: '/Projects/frontend-app', type: 'directory' },
      { name: 'api-service', path: '/Projects/api-service', type: 'directory' }
    ]
  }

  const navigateToPath = async (path: string) => {
    try {
      // Use mock file system for web
      const entries = mockFileSystem[path] || []
      setFiles(entries)
      setCurrentPath(path)
    } catch (error) {
      console.error('Error reading directory:', error)
    }
  }

  const handleFolderClick = (item: FileItem) => {
    if (item.type === 'directory') {
      navigateToPath(item.path)
    }
  }

  const handleSelectClick = (item: FileItem) => {
    if (item.type === 'directory') {
      onSelect(item.path)
    }
  }

  const goBack = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/'
    navigateToPath(parentPath)
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-600 h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-600">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-100">Select Project Folder</h3>
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
            Demo Mode
          </span>
        </div>
        
        {/* Path bar */}
        <div className="flex items-center space-x-2">
          <button
            onClick={goBack}
            disabled={currentPath === '/'}
            className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <span className="text-sm text-slate-400 font-mono">{currentPath}</span>
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {files.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors ${
                selectedPath === item.path ? 'bg-blue-500/20 border border-blue-500/50' : 'border border-transparent'
              }`}
            >
              <div 
                className="flex items-center space-x-3 flex-1"
                onClick={() => handleFolderClick(item)}
              >
                {item.type === 'directory' ? (
                  <FolderIcon className="h-5 w-5 text-blue-400" />
                ) : (
                  <DocumentIcon className="h-5 w-5 text-slate-400" />
                )}
                <span className="text-slate-200">{item.name}</span>
              </div>
              
              {item.type === 'directory' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectClick(item)
                  }}
                  className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded text-sm hover:bg-blue-500/20 transition-colors"
                >
                  Select
                </button>
              )}
            </div>
          ))}
        </div>
        
        {files.length === 0 && (
          <div className="text-center py-8">
            <FolderIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No folders found</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-600">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="text-yellow-400 mt-0.5">⚠️</div>
            <div>
              <p className="text-yellow-400 text-sm font-medium">Demo Mode Active</p>
              <p className="text-yellow-300 text-xs mt-1">
                Download our Desktop App for real file system access and project scanning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileBrowser 

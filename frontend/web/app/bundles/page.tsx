"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface UploadFile {
  id: string
  name: string
  status: 'pending' | 'uploading' | 'completed' | 'failed'
  progress: number
}

interface PastUpload {
  id: string
  name: string
  uploadDate: string
  status: 'success' | 'failure'
}

export default function BundlesPage() {
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([
    { id: '1', name: 'bundle1.json', status: 'pending', progress: 25 },
    { id: '2', name: 'bundle2.json', status: 'uploading', progress: 75 },
    { id: '3', name: 'bundle3.json', status: 'completed', progress: 100 },
  ])

  const [pastUploads] = useState<PastUpload[]>([
    { id: '1', name: 'bundle4.json', uploadDate: '2024-01-15', status: 'success' },
    { id: '2', name: 'bundle5.json', uploadDate: '2024-01-10', status: 'failure' },
    { id: '3', name: 'bundle6.json', uploadDate: '2023-12-20', status: 'success' },
    { id: '4', name: 'bundle7.json', uploadDate: '2023-12-15', status: 'success' },
    { id: '5', name: 'bundle8.json', uploadDate: '2023-12-01', status: 'failure' },
  ])

  const overallProgress = Math.round(
    selectedFiles.reduce((sum, file) => sum + file.progress, 0) / selectedFiles.length
  )

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        status: 'pending' as const,
        progress: 0
      }))
      setSelectedFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-900">AyushBridge</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
                <a href="/bundles" className="text-indigo-600 font-medium">Bundles</a>
                <a href="/mappings" className="text-gray-600 hover:text-gray-900 transition-colors">Mappings</a>
                <a href="/terminology" className="text-gray-600 hover:text-gray-900 transition-colors">Terminology</a>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FHIR Bundle Uploader</h1>
          <p className="text-lg text-gray-600">
            Upload FHIR Bundles to AyushBridge for processing and integration with NAMASTE & ICD-11 TM2.
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardContent className="p-12">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-400 transition-colors">
              <div className="mb-6">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drag and drop your FHIR Bundle files here
              </h3>
              <p className="text-gray-600 mb-6">or</p>
              <label htmlFor="file-upload">
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button variant="outline" className="cursor-pointer">
                  Browse Files
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Selected Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">
                  <div>File Name</div>
                  <div>Status</div>
                  <div>Progress</div>
                  <div>Actions</div>
                </div>

                {/* File Rows */}
                {selectedFiles.map((file) => (
                  <div key={file.id} className="grid grid-cols-4 gap-4 py-4 border-b border-gray-100 last:border-b-0">
                    <div className="text-sm text-gray-900">{file.name}</div>
                    <div>
                      <Badge 
                        variant={file.status === 'completed' ? 'default' : 'secondary'}
                        className={`
                          ${file.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                          ${file.status === 'uploading' ? 'bg-blue-100 text-blue-700' : ''}
                          ${file.status === 'pending' ? 'bg-gray-100 text-gray-700' : ''}
                        `}
                      >
                        {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{file.progress}%</span>
                    </div>
                    <div>
                      <button 
                        onClick={() => removeFile(file.id)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Progress */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Overall Upload Progress</span>
                  <span className="text-sm text-gray-600">{overallProgress}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <div className="mt-6 text-right">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Upload Bundles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Past Uploads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Past Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">
                <div>File Name</div>
                <div>Upload Date</div>
                <div>Status</div>
                <div>Details</div>
              </div>

              {/* Upload Rows */}
              {pastUploads.map((upload) => (
                <div key={upload.id} className="grid grid-cols-4 gap-4 py-4 border-b border-gray-100 last:border-b-0">
                  <div className="text-sm text-gray-900">{upload.name}</div>
                  <div className="text-sm text-gray-600">{upload.uploadDate}</div>
                  <div>
                    <Badge 
                      variant={upload.status === 'success' ? 'default' : 'secondary'}
                      className={`
                        ${upload.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                      `}
                    >
                      {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

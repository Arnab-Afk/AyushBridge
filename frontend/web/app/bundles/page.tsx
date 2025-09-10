"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"

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
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [pastUploads] = useState<PastUpload[]>([
    { id: '1', name: 'ayush_data_2024_01.xml', uploadDate: '2024-01-15', status: 'success' },
    { id: '2', name: 'patient_records_batch_1.json', uploadDate: '2024-01-14', status: 'success' },
    { id: '3', name: 'failed_upload.csv', uploadDate: '2024-01-13', status: 'failure' },
  ])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const newFiles: UploadFile[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      status: 'pending',
      progress: 0
    }))
    
    setSelectedFiles(prev => [...prev, ...newFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles: UploadFile[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      status: 'pending',
      progress: 0
    }))
    
    setSelectedFiles(prev => [...prev, ...newFiles])
  }

  const startUpload = () => {
    setSelectedFiles(prev => 
      prev.map(file => ({ ...file, status: 'uploading' as const }))
    )
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setSelectedFiles(prev => 
        prev.map(file => {
          if (file.status === 'uploading' && file.progress < 100) {
            const newProgress = Math.min(file.progress + Math.random() * 20, 100)
            return {
              ...file,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'uploading'
            }
          }
          return file
        })
      )
    }, 500)

    setTimeout(() => clearInterval(interval), 5000)
  }

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id))
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600 text-yellow-100'
      case 'uploading': return 'bg-blue-600 text-blue-100'
      case 'completed': return 'bg-green-600 text-green-100'
      case 'failed': return 'bg-red-600 text-red-100'
      case 'success': return 'bg-green-600 text-green-100'
      case 'failure': return 'bg-red-600 text-red-100'
      default: return 'bg-gray-600 text-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">FHIR Bundle Uploader</h1>
          <p className="mt-2 text-gray-600">
            Upload FHIR Bundles to AyushBridge for processing and integration with NAMASTE & ICD-11 TM2.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <p className="text-gray-600">Drag and drop files or click to browse</p>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-lg text-gray-600 mb-2">
                Drop files here or{" "}
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                  browse
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".json,.xml,.csv,.txt"
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500">
                Supports JSON, XML, CSV, and TXT files up to 50MB each
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Selected Files ({selectedFiles.length})</CardTitle>
                <p className="text-gray-600">Files ready for upload</p>
              </div>
              <Button
                onClick={startUpload}
                disabled={selectedFiles.some(f => f.status === 'uploading')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start Upload
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusBadgeColor(file.status)}>
                            {file.status}
                          </Badge>
                          {file.status === 'uploading' && (
                            <span className="text-sm text-gray-500">{Math.round(file.progress)}%</span>
                          )}
                        </div>
                      </div>
                      {file.status === 'uploading' && (
                        <div className="flex-1 max-w-xs">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      disabled={file.status === 'uploading'}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Past Uploads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <p className="text-gray-600">Your upload history</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">File Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Upload Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pastUploads.map((upload) => (
                    <tr key={upload.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{upload.name}</td>
                      <td className="py-3 px-4 text-gray-600">{upload.uploadDate}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusBadgeColor(upload.status)}>
                          {upload.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                          {upload.status === 'failure' && (
                            <Button variant="outline" size="sm">
                              Retry
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

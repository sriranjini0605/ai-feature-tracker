"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Zap, CheckCircle, Clock, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProcessingLog {
  timestamp: string
  message: string
  latency?: string
  status: "success" | "processing" | "error" | "info"
}

export default function AIImageProcessor() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [logs, setLogs] = useState<ProcessingLog[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setProcessedImage(null)
        addLog("Image uploaded successfully", "info") // Changed from "success" to "info"
      }
      reader.readAsDataURL(file)
    }
  }

  const addLog = (message: string, status: ProcessingLog["status"], latency?: string) => {
    const newLog: ProcessingLog = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      status,
      latency,
    }
    setLogs((prev) => [newLog, ...prev])
  }

  const processImage = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    addLog("Starting AI image processing...", "processing")

    // Mock API call with setTimeout to simulate latency
    setTimeout(() => {
      setProcessedImage(selectedImage) // Re-show original as "processed"
      setIsProcessing(false)
      addLog("API call successful. Image processing completed.", "success", "1.2s")
    }, 1200)
  }

  const resetDemo = () => {
    setSelectedImage(null)
    setProcessedImage(null)
    setIsProcessing(false)
    setLogs([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">AI Background Remover</h1>
          <p className="text-lg text-gray-600">Demo: Upload, Process, and Remove Background noise in Images with AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Image Upload & Processing
              </CardTitle>
              <CardDescription>Upload an image and process it with our AI-powered enhancement engine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700">Click to upload an image</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>

              {/* Image Preview and Processing */}
              {selectedImage && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original Image */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-700">Original Image</h3>
                      <div className="relative">
                        <img
                          src={selectedImage || "/placeholder.svg"}
                          alt="Original"
                          className="w-full h-64 object-cover rounded-lg border"
                        />
                      </div>
                    </div>

                    {/* Processed Image */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-700">Processed Image</h3>
                      <div className="relative">
                        {isProcessing ? (
                          <div className="w-full h-64 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <div className="text-center space-y-3">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                              <p className="text-sm text-gray-600">Processing with AI...</p>
                            </div>
                          </div>
                        ) : processedImage ? (
                          <div className="relative">
                            <img
                              src={processedImage || "/placeholder.svg"}
                              alt="Processed"
                              className="w-full h-64 object-cover rounded-lg border"
                            />
                            <Badge className="absolute top-2 right-2 bg-green-500">Enhanced</Badge>
                          </div>
                        ) : (
                          <div className="w-full h-64 bg-gray-50 rounded-lg border flex items-center justify-center">
                            <p className="text-gray-400">Processed image will appear here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button onClick={processImage} disabled={isProcessing} className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      {isProcessing ? "Processing..." : "Process with AI"}
                    </Button>
                    <Button variant="outline" onClick={resetDemo}>
                      Reset Demo
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Logs and Metrics */}
          <div className="space-y-6">
            {/* Processing Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Processing Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {logs.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No logs yet. Upload an image to get started.
                    </p>
                  ) : (
                    logs.map((log, index) => (
                      <Alert key={index} className="py-2">
                        <div className="flex items-start gap-2">
                          {log.status === "success" && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
                          {log.status === "processing" && <Clock className="h-4 w-4 text-blue-500 mt-0.5" />}
                          {log.status === "info" && <Upload className="h-4 w-4 text-gray-500 mt-0.5" />}
                          <div className="flex-1 min-w-0">
                            <AlertDescription className="text-xs">
                              <div className="font-medium">{log.message}</div>
                              <div className="text-gray-500 flex items-center gap-2 mt-1">
                                <span>{log.timestamp}</span>
                                {log.latency && (
                                  <>
                                    <Separator orientation="vertical" className="h-3" />
                                    <span>Latency: {log.latency}</span>
                                  </>
                                )}
                              </div>
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mock Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1.2s</div>
                    <div className="text-xs text-gray-600">Avg Latency</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">95.36%</div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {logs.filter((l) => l.status === "success" && l.latency).length}
                  </div>
                  <div className="text-xs text-gray-600">Images Processed</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Info */}
        <Card>
          <CardHeader>
            <CardTitle>AI Processing Features</CardTitle>
            <CardDescription>
              This demo simulates a real AI image processing pipeline with the following capabilities:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-medium mb-1">Smart Enhancement</h3>
                <p className="text-sm text-gray-600">AI-powered image quality improvement</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="font-medium mb-1">Fast Processing</h3>
                <p className="text-sm text-gray-600">Sub-second processing times</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-medium mb-1">High Reliability</h3>
                <p className="text-sm text-gray-600">99.9% uptime and success rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

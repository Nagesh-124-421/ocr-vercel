'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { Progress } from "@/components/ui/progress";


export function InputFile() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);


    setIsLoading(true);
    setUploadStatus('');
    setProgress(0);

    // Initial progress update using timer
    const timer = setTimeout(() => setProgress(66), 500);

    try {
      const response = await axios.post('https://extension-backend-484r.onrender.com/ocr-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        },
      });
      setUploadStatus(response.data.data);
    } catch (error) {
      setUploadStatus('Upload failed');
    }finally {
      setIsLoading(false);
      clearTimeout(timer);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">PDF FILE</Label>
      <Input id="picture" type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} className="mt-2 p-2 bg-blue-500 text-white rounded">Upload</button>
      {isLoading && (
        <div className="mt-2 w-full">
          <Progress value={progress} className="w-full" />
        </div>
      )}
      {/* {uploadStatus && <p>{uploadStatus}</p>} */}
      {uploadStatus && (
        <p className="mt-2 p-2 text-center text-sm sm:text-base lg:text-lg bg-gray-100 text-gray-800 rounded">
          {uploadStatus}
        </p>
      )}
    </div>
  );
}

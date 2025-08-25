'use client';

import { useState, useCallback } from 'react';
import { UploadCloud, Loader, CheckCircle, XCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUploadSuccess: (data: { url: string; publicId: string }) => void;
  folder: string;
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

export function ImageUploader({ onUploadSuccess, folder }: ImageUploaderProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const uploadFile = useCallback(async (file: File) => {
    setUploadStatus('uploading');
    setErrorMessage('');

    if (!cloudName || !apiKey) {
      setErrorMessage('Cloudinary environment variables are not configured.');
      setUploadStatus('error');
      return;
    }

    try {
      // 1. Get signature from our backend
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        timestamp,
        folder,
      };

      const signRes = await fetch('/api/upload/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params_to_sign: paramsToSign }),
      });

      if (!signRes.ok) {
        throw new Error(`Failed to get signature: ${await signRes.text()}`);
      }

      const { signature } = await signRes.json();

      // 2. Upload file directly to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('folder', folder);
      formData.append('signature', signature);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload failed: ${await uploadRes.text()}`);
      }

      const uploadData = await uploadRes.json();
      
      // 3. Handle success
      setUploadStatus('success');
      onUploadSuccess({ url: uploadData.secure_url, publicId: uploadData.public_id });

      // Reset after a few seconds
      setTimeout(() => setUploadStatus('idle'), 3000);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setErrorMessage(message);
      setUploadStatus('error');
    }
  }, [folder, onUploadSuccess]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const renderContent = () => {
    switch (uploadStatus) {
      case 'uploading':
        return (
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader className="h-8 w-8 animate-spin text-gray-500" />
            <p className="text-sm text-gray-500">Enviando...</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center gap-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <p className="text-sm text-green-500">Envio concluído!</p>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <XCircle className="h-8 w-8 text-red-500" />
            <p className="text-sm text-red-500">Erro no envio</p>
            <p className="text-xs text-red-600 px-2">{errorMessage}</p>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="flex flex-col items-center justify-center gap-2">
            <UploadCloud className="h-8 w-8 text-gray-500" />
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Clique para enviar</span> ou arraste e solte
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF até 10MB</p>
          </div>
        );
    }
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex justify-center items-center w-full h-48 rounded-lg border-2 border-dashed border-gray-300 transition-colors',
        isDragActive && 'border-blue-500 bg-blue-50',
        uploadStatus === 'error' && 'border-red-500 bg-red-50',
        uploadStatus === 'success' && 'border-green-500 bg-green-50'
      )}
    >
      <input {...getInputProps()} className="absolute w-full h-full opacity-0 cursor-pointer" />
      {renderContent()}
    </div>
  );
}

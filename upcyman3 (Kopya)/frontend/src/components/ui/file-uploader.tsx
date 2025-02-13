'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  multiple = false,
  accept,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: accept ? { 'application/octet-stream': [accept] } : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? 'Dosyaları buraya bırakın...'
          : 'Dosya yüklemek için tıklayın veya sürükleyip bırakın'}
      </p>
      {accept && (
        <p className="mt-1 text-xs text-gray-500">
          Desteklenen formatlar: {accept}
        </p>
      )}
    </div>
  );
}; 
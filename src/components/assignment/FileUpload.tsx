
import React from 'react';
import { Label } from "@/components/ui/label";
import { Upload } from 'lucide-react';

interface FileUploadProps {
  selectedFile: File | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ selectedFile, handleFileChange }) => {
  return (
    <div>
      <Label>Upload Assignment</Label>
      <div className="mt-2 flex items-center justify-center w-full">
        <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300 transition duration-300 cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-7">
            <Upload size={48} className="text-gray-500" />
            <p className="pt-1 text-sm tracking-wider text-gray-400">
              {selectedFile ? selectedFile.name : 'Select a file'}
            </p>
          </div>
          <input 
            type="file" 
            className="opacity-0" 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx,.txt"
          />
        </label>
      </div>
    </div>
  );
};

export default FileUpload;

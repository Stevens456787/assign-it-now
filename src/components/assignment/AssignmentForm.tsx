
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FileUpload from './FileUpload';

interface AssignmentFormProps {
  studentName: string;
  setStudentName: (value: string) => void;
  assignmentName: string;
  setAssignmentName: (value: string) => void;
  selectedFile: File | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  studentName,
  setStudentName,
  assignmentName,
  setAssignmentName,
  selectedFile,
  handleFileChange
}) => {
  return (
    <>
      <div>
        <Label htmlFor="studentName">Student Name</Label>
        <Input
          id="studentName"
          placeholder="Enter your full name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="mt-2"
        />
      </div>
      
      <div>
        <Label htmlFor="assignmentName">Assignment Title</Label>
        <Input
          id="assignmentName"
          placeholder="Enter assignment name"
          value={assignmentName}
          onChange={(e) => setAssignmentName(e.target.value)}
          className="mt-2"
        />
      </div>
      
      <FileUpload
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
      />
    </>
  );
};

export default AssignmentForm;

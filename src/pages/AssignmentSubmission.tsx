
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const AssignmentSubmission: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [studentName, setStudentName] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please log in to submit an assignment');
        navigate('/auth');
      } else {
        setStudentName(session.user.user_metadata?.full_name || '');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!studentName || !assignmentName || !selectedFile) {
      setSubmissionStatus('error');
      return;
    }

    try {
      // In a real app, you would upload the file to Supabase storage and store metadata in a table
      console.log('Submitting Assignment:', {
        studentName,
        assignmentName,
        file: selectedFile
      });

      setSubmissionStatus('success');
      toast.success('Assignment submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
      toast.error('Failed to submit assignment');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Assignment Submission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <Button 
              type="submit" 
              className="w-full bg-[#7E69AB] hover:bg-[#5D4E8A] text-white"
            >
              Submit Assignment
            </Button>
            
            {submissionStatus === 'success' && (
              <div className="flex items-center text-green-600 mt-4">
                <CheckCircle className="mr-2" />
                Assignment submitted successfully!
              </div>
            )}
            
            {submissionStatus === 'error' && (
              <div className="flex items-center text-red-600 mt-4">
                <AlertTriangle className="mr-2" />
                Please fill in all fields and upload a file.
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentSubmission;

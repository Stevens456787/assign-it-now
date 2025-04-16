
import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface StatusMessageProps {
  status: 'idle' | 'success' | 'error';
}

const StatusMessage: React.FC<StatusMessageProps> = ({ status }) => {
  if (status === 'idle') return null;
  
  if (status === 'success') {
    return (
      <div className="flex items-center text-green-600 mt-4">
        <CheckCircle className="mr-2" />
        Assignment submitted and payment processed!
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="flex items-center text-red-600 mt-4">
        <AlertTriangle className="mr-2" />
        Please fill in all required fields and payment information.
      </div>
    );
  }
  
  return null;
};

export default StatusMessage;

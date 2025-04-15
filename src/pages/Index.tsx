
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] flex items-center justify-center p-4">
      <div className="text-center bg-white p-10 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-6 text-[#5D4E8A]">Online Assignment Submission</h1>
        <p className="text-xl text-gray-600 mb-8">
          Easily submit your assignments with just a few clicks
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/auth">
            <Button className="bg-[#7E69AB] hover:bg-[#5D4E8A] text-white">
              Login / Sign Up
            </Button>
          </Link>
          <Link to="/assignment-submission">
            <Button variant="outline" className="border-[#7E69AB] text-[#7E69AB]">
              Submit Assignment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;

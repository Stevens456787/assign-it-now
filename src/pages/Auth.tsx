
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('user');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Test credentials - these will be used with the signup flow
  const testEmail = "test@example.com";
  const testPassword = "password123";

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/assignment-submission');
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        // Sign up flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              user_type: userType
            }
          }
        });

        if (error) throw error;
        
        toast.success('Account created successfully. Please check your email to verify.');
        // Don't navigate yet - user needs to verify email first
        console.log("Signup successful", data);
      } else {
        // Sign in flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        
        toast.success('Logged in successfully');
        navigate('/assignment-submission');
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestAccount = () => {
    // First create a test account if needed, then sign in with it
    const createAndSignIn = async () => {
      setLoading(true);
      try {
        // Check if user exists
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });
        
        if (signInError) {
          // User doesn't exist, create the account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
              data: {
                full_name: "Test User",
                user_type: "admin"
              }
            }
          });
          
          if (signUpError) throw signUpError;
          
          // Sign in with the newly created account
          const { error: newSignInError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword
          });
          
          if (newSignInError) throw newSignInError;
          
          toast.success('Test account created and logged in successfully');
        } else {
          toast.success('Logged in with test account');
        }
        
        navigate('/assignment-submission');
      } catch (error: any) {
        console.error("Test account error:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    createAndSignIn();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            {isSignUp ? 'Create Account' : 'Login'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            
            {isSignUp && (
              <div>
                <Label htmlFor="userType">Account Type</Label>
                <RadioGroup 
                  id="userType" 
                  value={userType} 
                  onValueChange={setUserType}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user">User</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-[#7E69AB] hover:bg-[#5D4E8A] text-white"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
            </Button>
            
            {!isSignUp && (
              <Button
                type="button"
                variant="outline"
                onClick={handleTestAccount}
                className="w-full mt-2"
                disabled={loading}
              >
                Use Test Account
              </Button>
            )}
            
            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#5D4E8A] hover:underline"
                disabled={loading}
              >
                {isSignUp 
                  ? 'Already have an account? Login' 
                  : 'Need an account? Sign Up'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;

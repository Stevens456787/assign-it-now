
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAssignmentSubmission = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [studentName, setStudentName] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'bank_transfer'>('credit_card');
  const [amount, setAmount] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Payment credentials states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');

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

  // Helper function to generate a transaction ID for demo purposes
  const generateTransactionId = (method: string) => {
    const prefix = method === 'credit_card' ? 'CC' : 
                  method === 'paypal' ? 'PP' : 'BT';
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!studentName || !assignmentName || !selectedFile || !paymentMethod) {
      setSubmissionStatus('error');
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate payment details based on selected method
    if (paymentMethod === 'credit_card' && (!cardNumber || !cardExpiry || !cardCvc)) {
      setSubmissionStatus('error');
      toast.error('Please fill in all credit card details');
      return;
    } else if (paymentMethod === 'paypal' && !paypalEmail) {
      setSubmissionStatus('error');
      toast.error('Please enter your PayPal email');
      return;
    } else if (paymentMethod === 'bank_transfer' && (!bankName || !accountNumber || !routingNumber)) {
      setSubmissionStatus('error');
      toast.error('Please fill in all bank transfer details');
      return;
    }

    try {
      setLoading(true);
      
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to submit an assignment');
        navigate('/auth');
        return;
      }
      
      // First, save assignment details
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('assignments')
        .insert({
          user_id: session.user.id,
          title: assignmentName,
          status: 'submitted'
        })
        .select('id')
        .single();
      
      if (assignmentError) {
        console.error('Assignment submission error:', assignmentError);
        throw new Error('Failed to submit assignment');
      }
      
      // Then, record the payment with payment method details
      const paymentDetails = {
        user_id: session.user.id,
        assignment_id: assignmentData.id,
        amount,
        payment_method: paymentMethod,
        status: 'pending',
        // Store a masked version of sensitive payment data for demo purposes
        // In a real application, you would use a proper payment processor
        transaction_id: generateTransactionId(paymentMethod)
      };
      
      const { error: paymentError } = await supabase
        .from('payments')
        .insert(paymentDetails);
      
      if (paymentError) {
        console.error('Payment recording error:', paymentError);
        throw new Error('Failed to process payment');
      }
      
      setSubmissionStatus('success');
      toast.success('Assignment submitted and payment processed successfully!');
      
      // Log the payment method and masked credentials for demo purposes
      console.log('Payment processed with:', {
        method: paymentMethod,
        amount,
        assignmentId: assignmentData.id
      });
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
      toast.error(error instanceof Error ? error.message : 'Failed to submit assignment');
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedFile,
    studentName,
    setStudentName,
    assignmentName,
    setAssignmentName,
    submissionStatus,
    paymentMethod,
    setPaymentMethod,
    amount,
    setAmount,
    loading,
    // Payment credentials
    cardNumber,
    setCardNumber,
    cardExpiry,
    setCardExpiry,
    cardCvc,
    setCardCvc,
    paypalEmail,
    setPaypalEmail,
    bankName,
    setBankName,
    accountNumber,
    setAccountNumber,
    routingNumber,
    setRoutingNumber,
    // Functions
    handleFileChange,
    handleSubmit
  };
};

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentModal({ event, isOpen, onClose, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = async () => {
    if (!event) return;
    setProcessing(true);
    
    // Simulate payment gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);

    setLoading(true);
    try {
      const mockUtr = 'MOCK-UTR-' + Math.floor(Math.random() * 10000000000);
      await onSubmit({ 
          utrNumber: mockUtr, 
          paymentScreenshot: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80' // Mock receipt image
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Content */}
      <div className="glass-modal relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl ">
        <header className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-white">Secure <span className="gradient-text">Checkout</span></h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Mock Gateway Environment</p>
            </div>
            <button onClick={onClose} disabled={processing || loading} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50">
                <X size={18} />
            </button>
        </header>

        <div className="p-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 mb-4 shadow-inner">
                    <ShieldCheck size={32} />
                </div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Amount</h3>
                <p className="text-4xl font-extrabold text-white mb-2">{event?.fee > 0 ? `₹${event.fee}` : 'Free'}</p>
                <p className="text-sm text-slate-500">Registration for {event?.title}</p>
            </div>

            {processing ? (
                <div className="flex flex-col items-center justify-center py-6 bg-white/5 rounded-2xl border border-white/5">
                   <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full mb-4" />
                   <p className="text-indigo-400 font-bold text-sm">Processing Payment securely...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <button 
                        onClick={handleSimulatePayment} 
                        disabled={loading}
                        className="w-full bg-[#528FF0] hover:bg-[#3d70c4] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#528FF0]/30 transition-all active:scale-95 disabled:opacity-50"
                    >
                       {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full " /> : (
                           <>
                               <ShieldCheck size={20} />
                               {event?.fee > 0 ? 'Pay Now with Mock Razorpay' : 'Confirm Free Registration'}
                           </>
                       )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium">
                        <CheckCircle size={12} className="text-emerald-500" />
                        256-bit SSL Encrypted Transaction
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Upload, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentModal({ event, isOpen, onClose, onSubmit }) {
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!utr || !screenshot) {
      toast.error('Please provide both UTR number and payment screenshot');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ utrNumber: utr, paymentScreenshot: screenshot });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Content */}
      <div className="glass-modal relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <header className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-white">Event <span className="gradient-text">Payment</span></h2>
                <p className="text-xs text-slate-400">Scan code and submit transaction details</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                <X size={18} />
            </button>
        </header>

        <div className="p-8 space-y-8 overflow-y-auto max-h-[80vh]">
            {/* QR Code */}
            <div className="flex justify-center mb-8">
              <div className="w-48 h-48 bg-white p-3 rounded-3xl shadow-2xl shadow-indigo-500/20">
                <img 
                  src={event?.paymentScanner || 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'} 
                  alt="Payment QR" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="text-center -mt-4 mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scan to Pay via UPI</p>
                <p className="text-[10px] text-slate-500 italic mt-1 font-medium">Please enter UTR and upload screenshot below after paying</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                        UTR / Transaction ID <Info size={12} className="text-slate-600" />
                    </label>
                    <input 
                        required
                        type="text" 
                        placeholder="Enter 12-digit UTR number"
                        className="input-field" 
                        value={utr}
                        onChange={e => setUtr(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                        Payment Screenshot URL <Info size={12} className="text-slate-600" />
                    </label>
                    <div className="relative group">
                        <input 
                            required
                            type="text" 
                            placeholder="Paste image URL of your screenshot"
                            className="input-field pr-12" 
                            value={screenshot}
                            onChange={e => setScreenshot(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                             <Upload size={18} />
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Please upload to a service like Imgur or paste a cloud link.</p>
                </div>

                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <CheckCircle size={16} />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                        Your registration will be processed and verified within 24 hours. You can check your status in 'My Events'.
                    </p>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-sm shadow-indigo-600/20"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Confirm Payment & Register'}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}

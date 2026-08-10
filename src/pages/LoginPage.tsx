import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { UserPlus, Shield, X, Plus, AlertCircle, ChevronRight } from 'lucide-react';

interface ContactInput {
  name: string;
  phone: string;
  relationship: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const { signUp, loginAsGuardian } = useStore();
  
  const [activeTab, setActiveTab] = useState<'signup' | 'guardian'>('signup');
  
  // Sign up state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Contacts state
  const [contacts, setContacts] = useState<ContactInput[]>([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('Mother');
  
  const [signupError, setSignupError] = useState('');
  
  // Guardian state
  const [guardianCode, setGuardianCode] = useState('');
  const [guardianError, setGuardianError] = useState('');

  const handleAddContact = () => {
    if (contacts.length >= 5) {
      setSignupError('Maximum 5 contacts allowed');
      return;
    }
    if (!newContactName || !newContactPhone) {
      setSignupError('Please provide both name and phone for the contact');
      return;
    }
    
    setContacts([...contacts, { name: newContactName, phone: newContactPhone, relationship: newContactRel }]);
    setNewContactName('');
    setNewContactPhone('');
    setSignupError('');
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setSignupError('Please fill in all user details');
      return;
    }
    if (contacts.length === 0) {
      setSignupError('Please add at least 1 trusted contact');
      return;
    }
    
    signUp({
      name: fullName,
      email,
      phone,
      trustedContacts: contacts as any
    });
    
    navigate('/user');
  };

  const handleGuardianLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardianCode) {
      setGuardianError('Please enter a code');
      return;
    }
    
    const success = loginAsGuardian(guardianCode);
    if (success) {
      navigate('/guardian');
    } else {
      setGuardianError('Invalid or deactivated guardian code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nooraya-ivory p-4 md:p-8 font-body text-nooraya-charcoal">
      <div className="w-full max-w-xl flex flex-col items-center">
        
        <img 
          src="/nooraya-primary-lockup-exact.png" 
          alt="Nooraya Logo" 
          className="w-56 mb-8 drop-shadow-md" 
        />
        
        <div className="w-full relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-nooraya-antique-gold to-nooraya-champagne-gold rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/50">
            
            {/* Tabs */}
            <div className="flex border-b border-nooraya-soft-grey/20">
              <button 
                type="button"
                onClick={() => { setActiveTab('signup'); setSignupError(''); }}
                className={cn(
                  "flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-300",
                  activeTab === 'signup' 
                    ? "text-nooraya-antique-gold bg-white/50 border-b-2 border-nooraya-champagne-gold" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                )}
              >
                <UserPlus size={18} />
                Sign Up
              </button>
              <button 
                type="button"
                onClick={() => { setActiveTab('guardian'); setGuardianError(''); }}
                className={cn(
                  "flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-300",
                  activeTab === 'guardian' 
                    ? "text-nooraya-antique-gold bg-white/50 border-b-2 border-nooraya-champagne-gold" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                )}
              >
                <Shield size={18} />
                Guardian Login
              </button>
            </div>

            <div className="p-6 md:p-8">
              {activeTab === 'signup' ? (
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-display text-nooraya-charcoal">Create Account</h2>
                    <p className="text-gray-500 text-sm mt-1">Set up your premium safety network</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-nooraya-champagne-gold focus:ring-0 outline-none transition-colors bg-white/50"
                      />
                    </div>
                    <div>
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-nooraya-champagne-gold focus:ring-0 outline-none transition-colors bg-white/50"
                      />
                    </div>
                    <div>
                      <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-nooraya-champagne-gold focus:ring-0 outline-none transition-colors bg-white/50"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                      <Shield className="text-nooraya-champagne-gold" size={20} />
                      Trusted Contacts
                    </h3>
                    
                    <div className="space-y-3 mb-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          placeholder="Contact Name" 
                          value={newContactName}
                          onChange={(e) => setNewContactName(e.target.value)}
                          className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-nooraya-champagne-gold outline-none"
                        />
                        <input 
                          type="tel" 
                          placeholder="Phone" 
                          value={newContactPhone}
                          onChange={(e) => setNewContactPhone(e.target.value)}
                          className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-nooraya-champagne-gold outline-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <select 
                          value={newContactRel}
                          onChange={(e) => setNewContactRel(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-nooraya-champagne-gold outline-none bg-white"
                        >
                          <option>Mother</option>
                          <option>Father</option>
                          <option>Guardian</option>
                          <option>Sibling</option>
                          <option>Friend</option>
                          <option>Partner</option>
                          <option>Other</option>
                        </select>
                        <button 
                          type="button"
                          onClick={handleAddContact}
                          className="px-4 py-2 bg-nooraya-charcoal text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-1"
                        >
                          <Plus size={16} /> Add
                        </button>
                      </div>
                    </div>

                    {contacts.length > 0 && (
                      <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2">
                        {contacts.map((contact, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <div>
                              <p className="font-medium text-sm">{contact.name}</p>
                              <p className="text-xs text-gray-500">{contact.relationship} • {contact.phone}</p>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeContact(i)}
                              className="p-1 text-gray-400 hover:text-nooraya-emergency-red transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {signupError && (
                    <div className="flex items-center gap-2 text-nooraya-emergency-red text-sm bg-red-50 p-3 rounded-lg">
                      <AlertCircle size={16} />
                      <p>{signupError}</p>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-nooraya-antique-gold to-nooraya-champagne-gold text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Create Nooraya Account
                    <ChevronRight size={20} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleGuardianLogin} className="space-y-6 py-4">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-nooraya-antique-gold to-nooraya-champagne-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-white">
                      <Shield size={32} />
                    </div>
                    <h2 className="text-2xl font-display text-nooraya-charcoal">Guardian Access</h2>
                    <p className="text-gray-500 text-sm mt-2 px-4">Enter your unique code to monitor the safety of your loved ones</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Enter your NRY-XXXXXX code" 
                        value={guardianCode}
                        onChange={(e) => setGuardianCode(e.target.value.toUpperCase())}
                        className="w-full px-4 py-4 text-center tracking-widest text-lg font-medium rounded-xl border-2 border-gray-200 focus:border-nooraya-champagne-gold focus:ring-0 outline-none transition-colors bg-white/80"
                      />
                    </div>
                  </div>

                  {guardianError && (
                    <div className="flex items-center justify-center gap-2 text-nooraya-emergency-red text-sm bg-red-50 p-3 rounded-lg">
                      <AlertCircle size={16} />
                      <p>{guardianError}</p>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-4 bg-nooraya-charcoal text-white rounded-xl font-medium shadow-lg hover:bg-gray-800 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                  >
                    Access Guardian Portal
                    <ChevronRight size={20} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-sm text-gray-400 font-display">
          Elevating personal safety through design.
        </p>
      </div>
    </div>
  );
};

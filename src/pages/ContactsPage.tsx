import { useState } from 'react';
import { Copy, Edit2, Check, X, UserPlus, RefreshCw, Crown, Info } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export function ContactsPage() {
  const { userProfile, addContact, removeContact, updateContactPhone, reactivateContact } = useStore();
  const contacts = userProfile?.trustedContacts || [];
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPhone, setEditPhone] = useState('');
  
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelationship, setNewRelationship] = useState('Friend');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('Guardian Code copied to clipboard');
  };

  const startEditing = (id: string, currentPhone: string) => {
    setEditingId(id);
    setEditPhone(currentPhone);
  };

  const saveEditing = (id: string) => {
    updateContactPhone(id, editPhone);
    setEditingId(null);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (contacts.length >= 5) return;
    if (!newName || !newPhone) return;
    
    addContact({ name: newName, phone: newPhone, relationship: newRelationship });
    setNewName('');
    setNewPhone('');
    setNewRelationship('Friend');
    showToast('Contact added successfully');
  };

  return (
    <div className="min-h-screen bg-nooraya-warm-white pb-20 pt-6 px-4 font-body">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-nooraya-charcoal text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-display text-nooraya-charcoal">Trusted Contacts</h1>
        <div className="bg-nooraya-champagne-gold/20 text-nooraya-antique-gold px-3 py-1 rounded-full text-sm font-medium">
          {contacts.length}/5
        </div>
      </header>

      <div className="space-y-4 mb-8">
        {contacts.map((contact, index) => (
          <div 
            key={contact.id} 
            className={cn(
              "bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-nooraya-soft-grey/20 relative overflow-hidden transition-all",
              !contact.active && "opacity-60 grayscale"
            )}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-medium text-lg text-nooraya-charcoal">{contact.name}</h3>
                {index === 0 && contact.active && (
                  <Crown className="w-4 h-4 text-nooraya-antique-gold" />
                )}
              </div>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                contact.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              )}>
                {contact.active ? 'Active' : 'Deactivated'}
              </span>
            </div>
            
            <div className="text-sm text-nooraya-charcoal/70 mb-4 space-y-1">
              <p className="flex items-center gap-2">
                <span className="w-16">Rel:</span> {contact.relationship}
              </p>
              
              {editingId === contact.id ? (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="flex-1 bg-nooraya-warm-white border border-nooraya-soft-grey rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-nooraya-champagne-gold"
                  />
                  <button onClick={() => saveEditing(contact.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="flex items-center gap-2">
                  <span className="w-16">Phone:</span> {contact.phone}
                </p>
              )}
              
              <div className="flex items-center gap-2 mt-2">
                <span className="w-16">Code:</span> 
                <span className="font-mono text-xs bg-nooraya-ivory px-2 py-1 rounded border border-nooraya-champagne-gold/30">
                  {contact.guardianCode.substring(0, 6)}****
                </span>
                <button 
                  onClick={() => handleCopyCode(contact.guardianCode)}
                  className="p-1 text-nooraya-antique-gold hover:bg-nooraya-champagne-gold/10 rounded transition-colors"
                  title="Copy full code"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-nooraya-soft-grey/20">
              {contact.active ? (
                <>
                  <button 
                    onClick={() => startEditing(contact.id, contact.phone)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-nooraya-charcoal hover:bg-nooraya-soft-grey/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Phone
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Are you sure you want to deactivate this contact?')) {
                        removeContact(contact.id);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-nooraya-emergency-red hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => reactivateContact(contact.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reactivate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-nooraya-soft-grey/20 mb-6 flex items-start gap-3">
        <div className="bg-nooraya-champagne-gold/20 p-2 rounded-full shrink-0">
          <Info className="w-5 h-5 text-nooraya-antique-gold" />
        </div>
        <p className="text-sm text-nooraya-charcoal/80">
          Share the Guardian Code with your contact so they can access the Guardian Portal and monitor your safety status.
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-nooraya-soft-grey/20">
        <h2 className="font-display text-lg text-nooraya-charcoal mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-nooraya-antique-gold" />
          Add New Contact
        </h2>
        
        {contacts.length >= 5 ? (
          <div className="text-center py-4 text-nooraya-charcoal/60 text-sm">
            You have reached the maximum limit of 5 trusted contacts.
          </div>
        ) : (
          <form onSubmit={handleAddContact} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-nooraya-warm-white border border-nooraya-soft-grey/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-nooraya-antique-gold"
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full bg-nooraya-warm-white border border-nooraya-soft-grey/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-nooraya-antique-gold"
              />
            </div>
            <div>
              <select
                value={newRelationship}
                onChange={(e) => setNewRelationship(e.target.value)}
                className="w-full bg-nooraya-warm-white border border-nooraya-soft-grey/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-nooraya-antique-gold appearance-none"
              >
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Partner">Partner</option>
                <option value="Colleague">Colleague</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-nooraya-charcoal text-white rounded-xl py-2.5 text-sm font-medium hover:bg-nooraya-charcoal/90 transition-colors shadow-md mt-2"
            >
              Add Contact
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

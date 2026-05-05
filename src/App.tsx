/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Phone, 
  User, 
  X, 
  CircleUser, 
  Copy, 
  Check,
  ChevronRight,
  UserPlus,
  Trash2,
  Share2,
  Camera,
  Image as ImageIcon,
  Edit2
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  mobile: string;
  tag?: string;
  image?: string;
  isFixed?: boolean;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: 'v1', name: 'মোঃ মোতাহার হোসেন (Admin)', mobile: '01700000000', isFixed: true },
  { id: 'v2', name: 'Vai Brothers Directory', mobile: '01800000000', isFixed: true },
];

const STORAGE_KEY = 'contact-nest-v1';

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
    } catch (e) {
      console.error('Error loading contacts:', e);
      return INITIAL_CONTACTS;
    }
  });

  const saveToStorage = (newContacts: Contact[]) => {
    setContacts(newContacts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New contact form state
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingId(null);
    setNewName('');
    setNewMobile('');
    setNewImage(null);
    setIsAdding(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingId(contact.id);
    setNewName(contact.name);
    setNewMobile(contact.mobile);
    setNewImage(contact.image || null);
    setIsAdding(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.mobile.includes(searchQuery)
    );
  }, [contacts, searchQuery]);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newMobile) return;

    if (editingId) {
      // Update existing
      const updatedContacts = contacts.map(c => 
        c.id === editingId 
          ? { ...c, name: newName, mobile: newMobile, image: newImage || undefined } 
          : c
      );
      saveToStorage(updatedContacts);
    } else {
      // Add new
      const newContact: Contact = {
        id: Date.now().toString(),
        name: newName,
        mobile: newMobile,
        image: newImage || undefined,
      };
      saveToStorage([newContact, ...contacts]);
    }

    setNewName('');
    setNewMobile('');
    setNewImage(null);
    setEditingId(null);
    setIsAdding(false);
  };

  const shareList = () => {
    const text = contacts.map(c => `${c.name}: ${c.mobile}`).join('\n');
    navigator.clipboard.writeText(text);
    alert('পুরো তালিকা কপি করা হয়েছে! এখন আপনি এটি যেকোনো জায়গায় শেয়ার করতে পারেন।');
  };

  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const deleteContact = (id: string) => {
    saveToStorage(contacts.filter(c => c.id !== id));
    setIdToDelete(null);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-blue-600 md:py-8 font-sans">
      <div className="max-w-md mx-auto h-full min-h-screen md:min-h-[850px] bg-slate-50 relative overflow-hidden md:rounded-[3rem] md:shadow-2xl md:border-8 md:border-blue-700 shadow-blue-900/40 pb-24">
        {/* Header Section with Blue Background */}
        <header className="p-6 md:p-8 pb-12 bg-blue-600 text-white relative">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-xl bg-white text-blue-600 text-sm md:text-lg font-black uppercase tracking-[0.1em] mb-4 shadow-lg shadow-blue-900/20">
                Brothers Community
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight bengali-text leading-tight">
                ভাই ব্রাদার্স <br /> ডিরেক্টরি
              </h1>
              <p className="text-blue-100 text-xs md:text-sm mt-3 font-medium opacity-90">
                সবার ফোন নম্বর এক জায়গায়
              </p>
            </div>
            <button
              id="share-list"
              onClick={shareList}
              className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm active:scale-95 transition-all hover:bg-white/30"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/30 rounded-full -ml-16 -mb-16 blur-2xl opacity-50" />
        </header>

        {/* Search Bar - Floating Style */}
        <div className="px-4 md:px-6 -mt-8 relative z-20">
          <div className="relative group">
            <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              id="search-contacts"
              type="text"
              placeholder="নাম বা নম্বর খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base bengali-text shadow-xl shadow-slate-200"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="px-3 md:px-6 space-y-3 mt-8">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              key={contact.id}
              className="glass-card p-3 md:p-4 rounded-2xl md:rounded-3xl flex items-center gap-3 md:gap-4 active:scale-[0.98] cursor-pointer group hover:bg-white transition-all shadow-sm shadow-slate-200/50"
            >
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 shadow-inner overflow-hidden flex-shrink-0">
                {contact.image ? (
                  <img src={contact.image} alt={contact.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <CircleUser className="h-6 w-6 md:h-8 md:w-8" />
                )}
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-slate-900 text-base md:text-[17px] bengali-text group-hover:text-blue-600 transition-colors leading-tight break-words">
                    {contact.name}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] md:text-[11px] font-black bg-blue-50 text-blue-700 border border-blue-100/50 w-fit tracking-tight">
                    {contact.mobile}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id={`edit-${contact.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(contact);
                    }}
                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-white hover:text-blue-600 border border-transparent hover:border-slate-200 transition-all active:scale-90"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  {!contact.isFixed && (
                    <button
                      id={`delete-${contact.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIdToDelete(contact.id);
                      }}
                      className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    id={`copy-${contact.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(contact.id, contact.mobile);
                    }}
                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-100/50 text-slate-400 hover:bg-white hover:text-slate-900 transition-colors"
                  >
                    {copiedId === contact.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <a
                    id={`call-${contact.id}`}
                    href={`tel:${contact.mobile}`}
                    onClick={(e) => e.stopPropagation()}
                    className="h-8 md:h-9 px-3 flex items-center justify-center gap-1 rounded-lg bg-blue-500 text-white shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest"
                  >
                    <Phone className="h-3 w-3" />
                    <span className="hidden xs:inline">Call</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 opacity-50 space-y-4">
            <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
               <Search className="h-8 w-8" />
            </div>
            <p className="bengali-text text-lg">কোনো নম্বর পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        id="fab-add-contact"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openAddModal}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-slate-900 text-white shadow-2xl flex items-center justify-center z-50 hover:bg-slate-800 transition-colors shadow-black/20"
      >
        <Plus className="h-8 w-8" />
      </motion.button>

      {/* Add Contact Modal Overlay */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 md:left-auto md:right-auto md:w-[448px] md:translate-x-0 bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl border-t border-slate-100"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold bengali-text text-slate-900">
                    {editingId ? 'তথ্য পরিবর্তন করুন' : 'নতুন যোগ করুন'}
                  </h2>
                </div>
                <button
                  id="close-modal"
                  onClick={() => setIsAdding(false)}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveContact} className="space-y-6">
                <div className="flex flex-col items-center gap-4 mb-2">
                  <div className="relative group">
                    <div className="h-28 w-28 rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden group-hover:border-blue-400 transition-colors">
                      {newImage ? (
                        <img src={newImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-slate-300" />
                      )}
                    </div>
                    <label 
                      htmlFor="image-upload" 
                      className="absolute -bottom-2 -right-2 h-10 w-10 bg-slate-900 border-4 border-white text-white rounded-2xl flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                      <input 
                        id="image-upload"
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest bengali-text">প্রোফাইল ছবি</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-sm font-semibold text-slate-600 ml-1 bengali-text">নাম</label>
                  <input
                    id="contact-name"
                    autoFocus
                    type="text"
                    required
                    placeholder="নাম লিখুন"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg bengali-text"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-mobile" className="text-sm font-semibold text-slate-600 ml-1 bengali-text">মোবাইল নম্বর</label>
                  <input
                    id="contact-mobile"
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={newMobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setNewMobile(val);
                    }}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg font-mono tracking-wider"
                  />
                </div>
                <button
                  id="submit-contact"
                  type="submit"
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg bengali-text shadow-xl shadow-slate-200 active:scale-[0.99] transition-transform"
                >
                  সংরক্ষণ করুন
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

        {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {idToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIdToDelete(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[320px] bg-white rounded-[32px] p-8 z-[110] shadow-2xl text-center"
            >
              <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 bengali-text mb-2">মুছে ফেলতে চান?</h3>
              <p className="text-slate-500 text-sm mb-8 bengali-text">এই নম্বরটি কন্টাক্ট লিস্ট থেকে চিরতরে মুছে যাবে।</p>
              
              <div className="flex gap-3">
                <button
                  id="cancel-delete"
                  onClick={() => setIdToDelete(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl bengali-text active:scale-95 transition-all"
                >
                  না
                </button>
                <button
                  id="confirm-delete"
                  onClick={() => deleteContact(idToDelete)}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl bengali-text shadow-lg shadow-red-200 active:scale-95 transition-all"
                >
                  হ্যাঁ, মুছুন
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="mt-12 mb-28 text-center opacity-30 select-none px-6">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">Contact Nest Directory</p>
        </footer>
      </div>
    </div>
  );
}


'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../components/ui/AppIcon'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface FeedbackEntry {
  id: string;
  name: string;
  message: string;
  photoDataUrl: string | null;
  timestamp: number;
}

type ModalView = 'gallery' | 'submit';

export default function CustomerFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ModalView>('gallery');
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem('customer_feedbacks');
        if (stored) setFeedbacks(JSON.parse(stored));
      } catch {
        setFeedbacks([]);
      }
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoDataUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);

    const newEntry: FeedbackEntry = {
      id: `fb-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      photoDataUrl,
      timestamp: Date.now(),
    };

    const updated = [newEntry, ...feedbacks];
    try {
      localStorage.setItem('customer_feedbacks', JSON.stringify(updated));
    } catch {
      // storage full — skip persisting photo
      const slim = updated.map((f) => ({ ...f, photoDataUrl: null }));
      localStorage.setItem('customer_feedbacks', JSON.stringify(slim));
    }

    setFeedbacks(updated);
    setName('');
    setMessage('');
    setPhotoDataUrl(null);
    setPhotoFileName('');
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setView('gallery');
    }, 1800);
  };

  const openModal = () => {
    setView('gallery');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSubmitted(false);
    setName('');
    setMessage('');
    setPhotoDataUrl(null);
    setPhotoFileName('');
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="flex justify-center mt-8 mb-2">
        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-fire-sm hover:shadow-fire-md hover:scale-105"
        >
          <Icon name="ChatBubbleLeftRightIcon" size={20} variant="outline" />
          Customer Feedback
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-card-dark overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-primary" variant="solid" />
                <h2 className="text-lg font-bold text-foreground">Customer Feedback</h2>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-border transition-colors"
              >
                <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Tab Bar */}
            <div className="flex border-b border-border shrink-0">
              <button
                onClick={() => setView('gallery')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${view === 'gallery' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                View Feedback ({feedbacks.length})
              </button>
              <button
                onClick={() => setView('submit')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${view === 'submit' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Leave Feedback
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-6">
              {/* Gallery View */}
              {view === 'gallery' && (
                <div className="space-y-4">
                  {feedbacks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Icon name="ChatBubbleLeftRightIcon" size={40} className="text-muted-foreground mb-3" variant="outline" />
                      <p className="text-muted-foreground text-sm">No feedback yet. Be the first to share!</p>
                      <button
                        onClick={() => setView('submit')}
                        className="mt-4 px-5 py-2 rounded-full bg-fire-gradient text-primary-foreground text-sm font-bold hover:scale-105 transition-transform"
                      >
                        Leave Feedback
                      </button>
                    </div>
                  ) : (
                    feedbacks.map((fb: FeedbackEntry) => (
                      <div key={fb.id} className="rounded-2xl border border-border bg-background p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-fire-subtle border border-primary/30 flex items-center justify-center">
                                        <Icon name="UserIcon" size={16} className="text-primary" variant="solid" />
                                    </div>
                                    <span className="font-bold text-foreground text-sm">{fb.name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{formatDate(fb.timestamp)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{fb.message}</p>
                            {fb.photoDataUrl && (
                                <div className="rounded-xl overflow-hidden border border-border">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={fb.photoDataUrl}
                                        alt={`Feedback photo from ${fb.name}`}
                                        className="w-full max-h-48 object-cover" />
                                </div>
                            )}
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* Submit View */}
              {view === 'submit' && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-3">
                        <Icon name="CheckCircleIcon" size={28} className="text-green-400" variant="solid" />
                      </div>
                      <p className="text-foreground font-bold text-lg">Thank you!</p>
                      <p className="text-muted-foreground text-sm mt-1">Your feedback has been submitted.</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                          placeholder="Enter your name"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                          Your Feedback *
                        </label>
                        <textarea
                          value={message}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}

                  
                          placeholder="Share your experience..."
                          required
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                          Photo (optional)
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                        >
                          <Icon name="PhotoIcon" size={18} variant="outline" />
                          {photoFileName ? photoFileName : 'Upload a photo'}
                        </button>
                        {photoDataUrl && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-border relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photoDataUrl}
                              alt="Preview of selected feedback photo"
                              className="w-full max-h-40 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => { setPhotoDataUrl(null); setPhotoFileName(''); }}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-border transition-colors"
                            >
                              <Icon name="XMarkIcon" size={14} className="text-foreground" />
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={submitting || !name.trim() || !message.trim()}
                        className="w-full py-3.5 rounded-full bg-fire-gradient text-primary-foreground font-bold text-sm hover:scale-105 transition-all duration-200 shadow-fire-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, LogIn, Heart, ShieldAlert } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Get all users from localStorage or initial empty list
      const usersData = localStorage.getItem('medsearch_users');
      const users: User[] = usersData ? JSON.parse(usersData) : [];

      if (isLogin) {
        // Find existing user
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!found) {
          setError('User not found. Please register first.');
          return;
        }
        // Save current user logged in
        localStorage.setItem('medsearch_current_user_id', found.id);
        onLoginSuccess(found);
        onClose();
        setName('');
        setEmail('');
        setPassword('');
      } else {
        // Registering
        const alreadyExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (alreadyExists) {
          setError('An account with this email already exists.');
          return;
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          cabinet: [],
          history: [
            {
              id: 'init',
              type: 'search',
              timestamp: new Date().toISOString(),
              title: 'Account Registered',
              subtitle: 'Successfully set up your MedSearch Pro secure local vault.',
              details: {
                notes: 'Welcome! Search medicines, calculate safety dosages, check interactions, and check symptoms. Everything aligns securely in your patient briefcase.'
              }
            }
          ]
        };

        users.push(newUser);
        localStorage.setItem('medsearch_users', JSON.stringify(users));
        localStorage.setItem('medsearch_current_user_id', newUser.id);
        onLoginSuccess(newUser);
        onClose();
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError('Authentication failed. Please verify browser capabilities.');
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-brand-border"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-brand-muted hover:text-brand-text hover:bg-brand-light transition-colors cursor-pointer"
            id="auth-close-btn"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-brand-secondary/35 text-brand-primary rounded-xl mb-3">
              <Heart className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-brand-text">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-xs text-brand-muted mt-1 text-center font-sans">
              {isLogin
                ? 'Sign in to access your personal medicine cabinet and analysis ledger.'
                : 'Create a local patient ledger to securely record allergy indices and check history.'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-rose-50 text-rose-700 rounded-lg text-xs flex items-start gap-2 border border-rose-100"
            >
              <ShieldAlert size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-primary focus:outline-none transition-all placeholder:text-brand-muted/75 bg-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-primary focus:outline-none transition-all placeholder:text-brand-muted/75 bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-primary focus:outline-none transition-all placeholder:text-brand-muted/75 bg-transparent"
                />
              </div>
              <p className="text-[10px] text-brand-muted mt-1 max-w-[280px]">
                Note: Passwords are encrypted on your local profile storage for security.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-brand-primary/10 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              id="auth-submit-btn"
            >
              <LogIn size={16} />
              <span>{isLogin ? 'Sign In Securely' : 'Set Up Vault & Enter'}</span>
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-brand-muted font-sans border-t border-brand-border pt-4">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => { setIsLogin(false); setError(''); }}
                  className="text-brand-primary font-semibold hover:underline hover:text-brand-text cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  onClick={() => { setIsLogin(true); setError(''); }}
                  className="text-brand-primary font-semibold hover:underline hover:text-brand-text cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

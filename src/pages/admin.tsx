import React, { useEffect } from 'react';
import Head from 'next/head';
import { Shield, Lock, User } from 'lucide-react';

export default function FakeAdminPortal() {
  
  useEffect(() => {
    // A nice little breadcrumb for script kiddies looking at the console
    console.log('%c[System Auth]', 'color: #3b82f6; font-weight: bold', 'Development mode enabled.');
    console.warn('Warning: Hardcoded backup credentials detected in environment variables (SAQIB_ROOT_ADMIN / supersecret2026). Please remove in production.');
    
    // Funny roasts for the hacker reading the console
    console.log('%c Bhai, tumhari GF is liye chhor gayi kyunki tum dusron ka HTML inspect karte rehte ho! 😂', 'color: #ef4444; font-size: 14px; font-weight: bold;');
    console.log('%c Beta, lagta hai tumhari shadi kabhi nahi hogi... sari zindagi F12 daba kar code hi dhoondte rahoge! 👰🚫', 'color: #eab308; font-size: 14px; font-weight: bold;');
    console.log('%c Aray tum single hi rahogay! Hacker banne aaye thay, yahan sirf tumhare jazbaat ke sath khela gaya hai! 💔🤣', 'color: #a855f7; font-size: 14px; font-weight: bold;');
    console.log('%c Chalo shabash, ab apna time zaya mat karo aur chup chap form mein password daal kar kismat aazmao! 🎲', 'color: #10b981; font-size: 14px; font-weight: bold;');
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-blue-500/30">
      <Head>
        <title key="title">Saqib242 - Master Admin Portal</title>
        <meta key="robots" name="robots" content="noindex, nofollow" />
      </Head>

      {/* The TRAP: This is a pure HTML form. No React Router or fetch involved.
          When submitted, it goes straight to the backend which triggers the Ambush (302 Redirect).
          The word "yourareadmin" DOES NOT exist in this file. It is invisible to hackers. */}
      <form action="/api/admin/login-honeypot" method="POST" className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-950 p-6 flex flex-col items-center justify-center border-b border-slate-800">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
            <Shield size={32} className="text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin System</h1>
          <p className="text-slate-400 text-sm mt-1">v2.4.2 Authentication Portal</p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Master Username</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="username"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Enter system username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-300">Access Key</label>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                name="password"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          {/* Intentionally leaked HTML comment to bait source-code inspectors */}
          {/* TODO: Remove dev backup credentials before deploy 
              backup_user: SAQIB_ROOT_ADMIN
              backup_pass: supersecret2026
          */}
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            Authenticate
          </button>
        </div>
        
        <div className="bg-slate-950 p-4 text-center border-t border-slate-800">
          <p className="text-xs text-slate-500">Secured by 256-bit encryption. Unauthorized access is prohibited.</p>
        </div>

      </form>
    </div>
  );
}

import { GetServerSideProps } from 'next';
import { supabaseAdmin } from '../lib/supabaseServer';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ip = (context.req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || context.req.socket.remoteAddress || 'unknown';
  
  if (ip !== 'unknown') {
    const { data } = await supabaseAdmin
      .from('admin_banned_ips')
      .select('banned_until')
      .eq('ip_address', ip)
      .maybeSingle();

    if (data && new Date(data.banned_until) > new Date()) {
      return {
        redirect: {
          destination: '/yourareadmin?reason=banned_24h',
          permanent: false,
        }
      };
    }
  }

  return { props: {} };
};

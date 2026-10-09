import React from 'react';
import { Link } from 'react-router-dom';
import { SynapseMark } from '../lib/brand';
import { isSupabaseConfigured } from '../lib/supabase';
import { AlertTriangle, Database } from 'lucide-react';

interface ChromeProps {
  children: React.ReactNode;
  showNav?: boolean;
  username?: string | null;
  onLogout?: () => void;
}

export const Chrome: React.FC<ChromeProps> = ({
  children,
  showNav = true,
  username,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-[#061424] text-[#e9f2f9] flex flex-col relative overflow-x-hidden selection:bg-[#00d6c8] selection:text-[#061424]">
      {/* Background grids */}
      <div className="fixed inset-0 dot-grid pointer-events-none opacity-40" />
      <div className="fixed inset-0 iso-grid pointer-events-none opacity-20" />
      <div className="noise-layer" />

      {/* Supabase status warning if unconfigured */}
      {!isSupabaseConfigured && (
        <div className="bg-[#ff6a00]/15 border-b border-[#ff6a00]/40 px-4 py-2 text-xs font-['Manrope',sans-serif] text-[#ffd9bf] flex items-center justify-between z-50">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertTriangle size={15} className="text-[#ff6a00] shrink-0" />
            <span>
              <strong>Supabase Setup Pending:</strong> Running in local offline mode. Add your Supabase URL & Anon Key to{' '}
              <code className="text-[#00d6c8] bg-[#061424] px-1 py-0.5 rounded font-mono">.env</code> and run{' '}
              <code className="text-[#00d6c8] bg-[#061424] px-1 py-0.5 rounded font-mono">supabase/schema.sql</code> in your dashboard.
            </span>
          </div>
        </div>
      )}

      {/* Top HUD Header */}
      {showNav && (
        <header className="relative z-40 border-b border-[#173654]/70 bg-[#091c31]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <SynapseMark size={28} className="transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-['Michroma',sans-serif] text-sm sm:text-base tracking-widest text-[#e9f2f9] group-hover:text-[#00d6c8] transition-colors">
                SYNAPSE<span className="text-[#00d6c8]">.BIO</span>
              </span>
              <span className="text-[10px] font-['Oswald',sans-serif] tracking-widest text-[#9fb4c7] uppercase">
                LINK NETWORK // V1.0
              </span>
            </div>
          </Link>

          {/* Right telemetry */}
          <div className="flex items-center gap-4 text-xs font-['Oswald',sans-serif]">
            <div className="hidden md:flex items-center gap-2 text-[#9fb4c7]">
              <span className="w-2 h-2 rounded-full bg-[#00d6c8] animate-pulse" />
              <span className="tracking-wider">NODE ONLINE // LIVE</span>
            </div>

            {username ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="px-3 py-1 bg-[#173654]/60 border border-[#173654] hover:border-[#00d6c8] text-[#e9f2f9] rounded-sm uppercase tracking-wider text-xs transition-colors"
                >
                  @{username}
                </Link>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="text-[#ff4d4d] hover:text-white text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-[#9fb4c7] hover:text-[#00d6c8] uppercase tracking-wider transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1 bg-[#00d6c8] text-[#061424] font-bold rounded-sm uppercase tracking-wider hover:bg-[#1ef9eb] transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative z-30 flex flex-col">{children}</main>

      {/* Subtle bottom footer */}
      <footer className="relative z-30 border-t border-[#173654]/50 bg-[#061424]/90 px-4 py-3 text-center text-xs font-['Manrope',sans-serif] text-[#9fb4c7]/60 flex items-center justify-between max-w-7xl mx-auto w-full">
        <span>© 2026 SYNAPSE NETWORK. All nodes operational.</span>
        <span className="font-['Oswald',sans-serif] tracking-wider uppercase text-[#00d6c8]/80 text-[11px]">
          [SECURE PROTOCOL]
        </span>
      </footer>
    </div>
  );
};

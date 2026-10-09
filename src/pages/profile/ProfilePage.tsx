import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProfileByUsername, getLinksByUserId } from '../../lib/store';
import { Profile, ProfileLink } from '../../types';
import { SynapseMark } from '../../lib/brand';
import { PlatformIcon } from '../../components/PlatformIcon';
import {
  Menu,
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!username) return;
      setLoading(true);
      try {
        const p = await getProfileByUsername(username);
        if (p) {
          setProfile(p);
          const l = await getLinksByUserId(p.user_id);
          setLinks(l);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [username]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.name || username} on synapse.bio`,
          text: `Check out ${profile?.name || username}'s links on synapse.bio!`,
          url: window.location.href,
        });
      } catch (e) {
        // Fallback to copy
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#061424] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <SynapseMark size={48} className="animate-pulse" />
          <span className="font-['Michroma',sans-serif] text-xs text-[#00d6c8] tracking-widest uppercase">
            SYNCING NODE TELEMETRY...
          </span>
        </div>
      </div>
    );
  }

  // Not found state
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#061424] text-[#e9f2f9] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="fixed inset-0 dot-grid pointer-events-none opacity-30" />
        <div className="fixed inset-0 iso-grid pointer-events-none opacity-20" />

        <div className="w-full max-w-md bg-[#091c31]/90 border border-[#173654] p-8 text-center rounded-sm relative z-10 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          <SynapseMark size={52} className="mx-auto mb-4 opacity-50" />
          <h1 className="font-['Michroma',sans-serif] text-xl text-[#ff4d4d] mb-2 tracking-wider">
            NODE UNREGISTERED
          </h1>
          <p className="text-xs font-['Manrope',sans-serif] text-[#9fb4c7] mb-6">
            The handle <code className="text-[#00d6c8]">@{username}</code> has not been activated in the synapse.bio network yet.
          </p>

          <Link
            to="/signup"
            className="w-full py-3 px-5 bg-[#00d6c8] text-[#061424] font-['Oswald',sans-serif] uppercase tracking-wider text-sm font-bold rounded-sm inline-flex items-center justify-center gap-2 hover:bg-[#1ef9eb] transition-all shadow-[0_0_20px_rgba(0,214,200,0.3)]"
          >
            <span>Claim @{username} Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#061424] text-[#e9f2f9] flex flex-col items-center justify-between p-4 sm:p-6 relative selection:bg-[#00d6c8] selection:text-[#061424]">
      {/* Background aesthetics */}
      <div className="fixed inset-0 dot-grid pointer-events-none opacity-35" />
      <div className="fixed inset-0 iso-grid pointer-events-none opacity-20" />
      <div className="noise-layer" />

      {/* Top Bar with Synapse Logo & Hamburger (≡) */}
      <header className="w-full max-w-md flex items-center justify-between py-2 px-1 relative z-30">
        <Link to="/" className="flex items-center gap-2 group">
          <SynapseMark size={24} className="group-hover:scale-105 transition-transform" />
          <span className="font-['Michroma',sans-serif] text-xs tracking-wider text-[#e9f2f9] group-hover:text-[#00d6c8] transition-colors">
            SYNAPSE<span className="text-[#00d6c8]">.BIO</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="p-2 border border-[#173654] bg-[#091c31]/80 hover:border-[#00d6c8] text-[#00d6c8] rounded-sm transition-colors cursor-pointer"
          aria-label="Open Navigation Drawer"
        >
          {drawerOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Sliding Slide-Out Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-[#091c31] border-l border-[#173654] h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-[#173654]/60 pb-4 mb-6">
                <span className="font-['Michroma',sans-serif] text-xs text-[#00d6c8] tracking-widest uppercase">
                  NODE ACTIONS
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-[#9fb4c7] hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleShare}
                  className="w-full p-3 bg-[#061424] border border-[#173654] hover:border-[#00d6c8] rounded-sm flex items-center gap-3 text-xs font-['Oswald',sans-serif] uppercase tracking-wider text-[#e9f2f9] transition-colors text-left"
                >
                  <Share2 size={16} className="text-[#00d6c8]" />
                  <span>Share Profile</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="w-full p-3 bg-[#061424] border border-[#173654] hover:border-[#00d6c8] rounded-sm flex items-center gap-3 text-xs font-['Oswald',sans-serif] uppercase tracking-wider text-[#e9f2f9] transition-colors text-left"
                >
                  {copied ? (
                    <Check size={16} className="text-[#00d6c8]" />
                  ) : (
                    <Copy size={16} className="text-[#00d6c8]" />
                  )}
                  <span>{copied ? 'Link Copied!' : 'Copy Public URL'}</span>
                </button>

                <Link
                  to="/signup"
                  className="w-full p-3 bg-[#00d6c8]/10 border border-[#00d6c8]/40 hover:bg-[#00d6c8]/20 rounded-sm flex items-center gap-3 text-xs font-['Oswald',sans-serif] uppercase tracking-wider text-[#00d6c8] transition-colors mt-2"
                >
                  <ShieldCheck size={16} />
                  <span>Claim Your Own Node</span>
                </Link>
              </div>
            </div>

            <div className="border-t border-[#173654]/50 pt-4 text-[10px] text-[#9fb4c7]/60 font-mono text-center">
              SYNAPSE NETWORK // PROTOCOL V1
            </div>
          </div>
        </div>
      )}

      {/* Main Profile Card Container */}
      <main className="w-full max-w-md my-auto py-6 relative z-20 flex flex-col items-center text-center">
        {/* Glow halo */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00d6c8]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Profile Card */}
        <div className="w-full bg-[#091c31]/85 border border-[#173654] backdrop-blur-md p-6 sm:p-8 rounded-sm shadow-[0_15px_45px_rgba(0,0,0,0.6)] relative">
          {/* Cyber Corner Marks */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#00d6c8]" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#00d6c8]" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#00d6c8]" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#00d6c8]" />

          {/* Avatar Ring */}
          <div className="w-24 h-24 rounded-full border-2 border-[#00d6c8] p-1 bg-[#061424] shadow-[0_0_25px_rgba(0,214,200,0.35)] mx-auto mb-4 overflow-hidden relative group">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#061424]">
                <SynapseMark size={36} />
              </div>
            )}
          </div>

          {/* Display Name */}
          <h1 className="font-['Michroma',sans-serif] text-lg sm:text-xl text-[#e9f2f9] tracking-wider font-bold">
            {profile.name}
          </h1>

          {/* Handle Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00d6c8]/10 border border-[#00d6c8]/30 rounded-full text-xs font-mono text-[#00d6c8] font-bold mt-2">
            <span>@{profile.username}</span>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-xs sm:text-sm font-['Manrope',sans-serif] text-[#9fb4c7] mt-3.5 leading-relaxed max-w-sm mx-auto">
              {profile.bio}
            </p>
          )}

          {/* Links List */}
          <div className="w-full flex flex-col gap-3 mt-6">
            {links.map((link) => {
              // Format URL to ensure protocol
              const formattedUrl = link.url.startsWith('http://') || link.url.startsWith('https://')
                ? link.url
                : `https://${link.url}`;

              return (
                <a
                  key={link.id}
                  href={formattedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3.5 bg-[#061424]/90 border border-[#173654] hover:border-[#00d6c8] hover:bg-[#00d6c8]/10 hover:shadow-[0_0_20px_rgba(0,214,200,0.2)] rounded-sm flex items-center justify-between transition-all duration-200 group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-sm bg-[#091c31] border border-[#173654] group-hover:border-[#00d6c8] flex items-center justify-center text-[#00d6c8] transition-colors shrink-0">
                      <PlatformIcon platform={link.platform} size={16} />
                    </div>
                    <span className="font-['Oswald',sans-serif] uppercase tracking-wider text-sm text-[#e9f2f9] group-hover:text-[#00d6c8] transition-colors truncate">
                      {link.label || 'Link'}
                    </span>
                  </div>

                  <ExternalLink
                    size={15}
                    className="text-[#9fb4c7]/50 group-hover:text-[#00d6c8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2"
                  />
                </a>
              );
            })}

            {links.length === 0 && (
              <div className="p-6 border border-dashed border-[#173654] rounded text-xs text-[#9fb4c7]/60">
                This operative has not connected any links yet.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom SYNAPSE Watermark / CTA */}
      <footer className="w-full max-w-md py-4 text-center relative z-20 flex flex-col items-center gap-2">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#091c31]/80 border border-[#173654] hover:border-[#00d6c8] rounded-full text-[11px] font-['Oswald',sans-serif] uppercase tracking-wider text-[#9fb4c7] hover:text-[#00d6c8] transition-colors"
        >
          <SynapseMark size={14} />
          <span>Powered by SYNAPSE.BIO // Create your own</span>
        </Link>
      </footer>
    </div>
  );
};

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SynapseMark } from '../../lib/brand';
import { PlatformIcon } from '../../components/PlatformIcon';
import { ExternalLink, CheckCircle2, Sparkles, Smartphone } from 'lucide-react';
import { OnboardingState } from '../../types';

interface Step6PreviewProps {
  username: string;
  state: OnboardingState;
}

export const Step6Preview: React.FC<Step6PreviewProps> = ({ username, state }) => {
  useEffect(() => {
    // Fire celebratory confetti on reaching preview
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00d6c8', '#ff6a00', '#dd0000', '#ffffff'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00d6c8]/10 border border-[#00d6c8]/30 rounded-full text-xs text-[#00d6c8] font-mono mb-2">
          <Sparkles size={13} />
          <span>INITIALIZATION COMPLETE // NODE COMPILED</span>
        </div>
        <h2 className="font-['Michroma',sans-serif] text-lg sm:text-2xl text-[#e9f2f9]">
          PREVIEW YOUR SYNAPSE PROFILE
        </h2>
        <p className="text-xs sm:text-sm font-['Manrope',sans-serif] text-[#9fb4c7] mt-1">
          Here is how your link-in-bio card will appear to any operative worldwide.
        </p>
      </div>

      {/* Mobile Mockup Device Frame */}
      <div className="w-full max-w-xs bg-[#030b14] border-2 border-[#173654] rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Top speaker notch */}
        <div className="w-24 h-3 bg-[#061424] rounded-full mx-auto mb-4 border border-[#173654]/40" />

        {/* Ambient subtle card glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#00d6c8]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Profile Card Interior */}
        <div className="flex flex-col items-center text-center relative z-10">
          {/* Avatar Ring */}
          <div className="w-20 h-20 rounded-full border-2 border-[#00d6c8] p-0.5 bg-[#091c31] shadow-[0_0_20px_rgba(0,214,200,0.4)] mb-3 overflow-hidden">
            {state.avatarPreview ? (
              <img
                src={state.avatarPreview}
                alt={state.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#061424]">
                <SynapseMark size={28} />
              </div>
            )}
          </div>

          {/* Name & Handle */}
          <h3 className="font-['Michroma',sans-serif] text-sm text-[#e9f2f9] tracking-wider">
            {state.name || 'Operative'}
          </h3>
          <span className="text-[11px] font-mono text-[#00d6c8] mt-0.5 font-bold">
            @{username || 'handle'}
          </span>

          {/* Bio */}
          {state.bio && (
            <p className="text-xs font-['Manrope',sans-serif] text-[#9fb4c7] mt-2 line-clamp-2 px-2">
              {state.bio}
            </p>
          )}

          {/* Links list */}
          <div className="w-full flex flex-col gap-2 mt-5">
            {state.links.map((link) => (
              <div
                key={link.id}
                className="w-full p-2.5 bg-[#091c31]/90 border border-[#173654] hover:border-[#00d6c8] rounded-sm flex items-center justify-between transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#00d6c8]/10 text-[#00d6c8] flex items-center justify-center">
                    <PlatformIcon platform={link.platform} size={13} />
                  </div>
                  <span className="text-xs font-['Oswald',sans-serif] uppercase tracking-wider text-[#e9f2f9]">
                    {link.label || 'Link'}
                  </span>
                </div>
                <ExternalLink size={12} className="text-[#9fb4c7]/60" />
              </div>
            ))}

            {state.links.length === 0 && (
              <div className="p-3 border border-dashed border-[#173654] rounded text-center text-[10px] text-[#9fb4c7]">
                No links added
              </div>
            )}
          </div>

          {/* Synapse Watermark Footer */}
          <div className="mt-6 pt-3 border-t border-[#173654]/40 flex items-center gap-1.5 opacity-60">
            <SynapseMark size={14} />
            <span className="text-[9px] font-['Michroma',sans-serif] tracking-wider text-[#9fb4c7]">
              SYNAPSE.BIO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

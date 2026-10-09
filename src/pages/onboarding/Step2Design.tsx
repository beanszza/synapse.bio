import React from 'react';
import { SynapseMark } from '../../lib/brand';
import { Check, Sparkles } from 'lucide-react';

interface Step2DesignProps {
  selectedTheme: string;
  onSelect: (theme: string) => void;
}

export const Step2Design: React.FC<Step2DesignProps> = ({
  selectedTheme,
  onSelect,
}) => {
  const isSelected = selectedTheme === 'synapse-dark';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-['Michroma',sans-serif] text-lg sm:text-xl text-[#e9f2f9]">
          SELECT SYSTEM DESIGN
        </h2>
        <p className="text-xs sm:text-sm font-['Manrope',sans-serif] text-[#9fb4c7] mt-1">
          Lock in your node appearance. Synapse Dark is the standardized protocol for operatives.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* SYNAPSE DARK Card */}
        <button
          type="button"
          onClick={() => onSelect('synapse-dark')}
          className={`w-full p-5 sm:p-6 rounded-sm border transition-all duration-300 text-left cursor-pointer relative overflow-hidden group ${
            isSelected
              ? 'border-[#00d6c8] bg-[#091c31] shadow-[0_0_25px_rgba(0,214,200,0.25)] ring-1 ring-[#00d6c8]'
              : 'border-[#173654] bg-[#061424] hover:border-[#9fb4c7]'
          }`}
        >
          {/* Cyber ambient glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d6c8]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#ff6a00]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-4">
              <SynapseMark size={44} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-['Michroma',sans-serif] text-base text-[#e9f2f9] tracking-wider">
                    SYNAPSE DARK
                  </h3>
                  <span className="px-2 py-0.5 text-[9px] font-mono bg-[#00d6c8]/20 text-[#00d6c8] border border-[#00d6c8]/40 rounded uppercase">
                    OFFICIAL SPEC
                  </span>
                </div>
                <p className="text-xs font-['Manrope',sans-serif] text-[#9fb4c7] mt-1">
                  Abyss blue `#061424` foundation with neon teal `#00d6c8`, ember `#ff6a00`, and isometric HUD geometry.
                </p>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                isSelected
                  ? 'border-[#00d6c8] bg-[#00d6c8] text-[#061424]'
                  : 'border-[#173654] bg-transparent text-transparent'
              }`}
            >
              <Check size={14} strokeWidth={3} />
            </div>
          </div>

          {/* Mini Mockup Visual */}
          <div className="mt-5 p-4 bg-[#061424] border border-[#173654] rounded flex flex-col items-center gap-2 max-w-xs mx-auto">
            <div className="w-10 h-10 rounded-full border border-[#00d6c8] bg-[#091c31] flex items-center justify-center shadow-[0_0_10px_rgba(0,214,200,0.3)]">
              <SynapseMark size={20} />
            </div>
            <div className="h-2 w-20 bg-[#e9f2f9]/70 rounded-full" />
            <div className="h-1.5 w-32 bg-[#9fb4c7]/40 rounded-full" />
            <div className="w-full flex flex-col gap-1.5 mt-2">
              <div className="h-6 w-full bg-[#173654]/50 border border-[#00d6c8]/40 rounded flex items-center justify-center text-[10px] text-[#00d6c8] font-mono">
                [LINK_NODE_01]
              </div>
              <div className="h-6 w-full bg-[#173654]/50 border border-[#173654] rounded flex items-center justify-center text-[10px] text-[#9fb4c7] font-mono">
                [LINK_NODE_02]
              </div>
            </div>
          </div>
        </button>

        {!isSelected && (
          <p className="text-xs text-[#ff6a00] font-['Manrope',sans-serif] text-center">
            * Click the SYNAPSE DARK card to activate the layout and proceed.
          </p>
        )}
      </div>
    </div>
  );
};

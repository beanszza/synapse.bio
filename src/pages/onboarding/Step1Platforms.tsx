import React from 'react';
import { SocialPlatformId } from '../../types';
import { PLATFORMS } from '../../lib/platforms';
import { PlatformIcon } from '../../components/PlatformIcon';
import { Check } from 'lucide-react';

interface Step1PlatformsProps {
  selectedPlatforms: SocialPlatformId[];
  onChange: (platforms: SocialPlatformId[]) => void;
}

export const Step1Platforms: React.FC<Step1PlatformsProps> = ({
  selectedPlatforms,
  onChange,
}) => {
  const togglePlatform = (id: SocialPlatformId) => {
    if (selectedPlatforms.includes(id)) {
      onChange(selectedPlatforms.filter((p) => p !== id));
    } else {
      onChange([...selectedPlatforms, id]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-['Michroma',sans-serif] text-lg sm:text-xl text-[#e9f2f9]">
          SELECT YOUR PLATFORMS
        </h2>
        <p className="text-xs sm:text-sm font-['Manrope',sans-serif] text-[#9fb4c7] mt-1">
          Choose where you operate across cyberspace. You can add more links later. Select at least 1.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);

          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => togglePlatform(platform.id)}
              className={`p-3.5 rounded-sm border flex items-center justify-between transition-all duration-200 cursor-pointer text-left group ${
                isSelected
                  ? 'border-[#00d6c8] bg-[#00d6c8]/10 shadow-[0_0_15px_rgba(0,214,200,0.2)]'
                  : 'border-[#173654] bg-[#061424]/80 hover:border-[#9fb4c7]/50 hover:bg-[#091c31]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-sm flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#00d6c8] text-[#061424]' : 'bg-[#173654]/40 text-[#9fb4c7]'
                  }`}
                >
                  <PlatformIcon platform={platform.id} size={18} />
                </div>
                <span
                  className={`text-xs sm:text-sm font-['Oswald',sans-serif] uppercase tracking-wider ${
                    isSelected ? 'text-[#e9f2f9] font-bold' : 'text-[#9fb4c7]'
                  }`}
                >
                  {platform.name}
                </span>
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'border-[#00d6c8] bg-[#00d6c8] text-[#061424]'
                    : 'border-[#173654] bg-transparent text-transparent'
                }`}
              >
                <Check size={12} strokeWidth={3} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-3 bg-[#061424] border border-[#173654] rounded-sm flex items-center justify-between text-xs font-mono">
        <span className="text-[#9fb4c7]">SELECTED NODES:</span>
        <span className="text-[#00d6c8] font-bold">
          {selectedPlatforms.length} PLATFORM{selectedPlatforms.length === 1 ? '' : 'S'}
        </span>
      </div>
    </div>
  );
};

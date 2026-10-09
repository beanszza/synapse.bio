import React from 'react';
import { Input } from '../../components/ui/Input';

interface Step4DetailsProps {
  name: string;
  bio: string;
  onChangeName: (val: string) => void;
  onChangeBio: (val: string) => void;
}

export const Step4Details: React.FC<Step4DetailsProps> = ({
  name,
  bio,
  onChangeName,
  onChangeBio,
}) => {
  const maxBio = 120;
  const remaining = maxBio - bio.length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-['Michroma',sans-serif] text-lg sm:text-xl text-[#e9f2f9]">
          SET OPERATIVE DETAILS
        </h2>
        <p className="text-xs sm:text-sm font-['Manrope',sans-serif] text-[#9fb4c7] mt-1">
          Tell visitors who is behind this link node.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Input
          label="Display Name / Alias"
          placeholder="e.g. Vince Rodriguez"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          hint="This will be the headline on your public profile card."
          required
          autoFocus
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-['Oswald',sans-serif] uppercase tracking-wider text-[#9fb4c7]">
            <span>Bio / Brief Mission Statement</span>
            <span
              className={`font-mono text-[11px] ${
                remaining < 0 ? 'text-[#ff4d4d]' : remaining < 20 ? 'text-[#ff6a00]' : 'text-[#00d6c8]'
              }`}
            >
              {bio.length} / {maxBio} CHARS
            </span>
          </div>

          <textarea
            rows={3}
            maxLength={140}
            placeholder="e.g. Lead Developer at SYNAPSE. Building interactive cyber worlds and open protocol systems."
            value={bio}
            onChange={(e) => onChangeBio(e.target.value)}
            className="w-full bg-[#061424]/90 border border-[#173654] text-[#e9f2f9] font-['Manrope',sans-serif] text-sm p-3.5 rounded-sm transition-all duration-200 placeholder:text-[#9fb4c7]/40 focus:outline-none focus:border-[#00d6c8] focus:shadow-[0_0_12px_rgba(0,214,200,0.2)] resize-none"
          />
          <p className="text-xs text-[#9fb4c7]/70 font-['Manrope',sans-serif]">
            Optional. Keep it punchy and memorable.
          </p>
        </div>
      </div>
    </div>
  );
};

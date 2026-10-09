import React, { useRef } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Step3PhotoProps {
  avatarFile: File | null;
  avatarPreview: string | null;
  onChange: (file: File | null, preview: string | null) => void;
}

export const Step3Photo: React.FC<Step3PhotoProps> = ({
  avatarFile,
  avatarPreview,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = async (avatarIndex: number) => {
    // Generate an SVG avatar data URL preset
    const colors = ['#00d6c8', '#ff6a00', '#dd0000', '#5865F2'];
    const color = colors[avatarIndex % colors.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#091c31"/><circle cx="100" cy="100" r="70" fill="none" stroke="${color}" stroke-width="6"/><circle cx="100" cy="80" r="30" fill="${color}" fill-opacity="0.8"/><path d="M50 160 C50 125, 150 125, 150 160" fill="${color}" fill-opacity="0.6"/></svg>`;
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    // Convert dataUrl to a File object
    const blob = await (await fetch(dataUrl)).blob();
    const mockFile = new File([blob], `avatar-preset-${avatarIndex + 1}.png`, { type: 'image/png' });
    onChange(mockFile, dataUrl);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-['Michroma',sans-serif] text-lg sm:text-xl text-[#e9f2f9]">
          UPLOAD OPERATIVE AVATAR
        </h2>
        <p className="text-xs sm:text-sm font-['Manrope',sans-serif] text-[#9fb4c7] mt-1">
          A visual identifier is required for your SYNAPSE identity card.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 py-4">
        {/* Avatar Display Ring */}
        <div className="relative group">
          <div className="w-36 h-36 rounded-full border-2 border-[#00d6c8] p-1 bg-[#091c31] shadow-[0_0_25px_rgba(0,214,200,0.3)] relative overflow-hidden flex items-center justify-center">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#9fb4c7]/50 gap-2">
                <Camera size={36} />
                <span className="text-[10px] font-['Oswald',sans-serif] uppercase tracking-wider">
                  NO AVATAR
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 p-2 bg-[#00d6c8] text-[#061424] rounded-full shadow-lg hover:bg-[#1ef9eb] transition-all cursor-pointer"
            title="Upload photo"
          >
            <Upload size={16} />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Buttons / Presets */}
        <div className="flex flex-col items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload size={14} />}
          >
            Choose Image From Device
          </Button>

          <span className="text-xs text-[#9fb4c7]/60 font-['Oswald',sans-serif] uppercase tracking-wider">
            — OR CHOOSE AN OPERATIVE BADGE —
          </span>

          <div className="flex items-center gap-3">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(idx)}
                className="w-10 h-10 rounded-full border border-[#173654] hover:border-[#00d6c8] bg-[#091c31] flex items-center justify-center text-xs text-[#00d6c8] font-mono hover:scale-105 transition-all cursor-pointer"
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {avatarPreview ? (
          <div className="flex items-center gap-2 text-xs text-[#00d6c8] font-['Oswald',sans-serif] tracking-wider uppercase">
            <CheckCircle size={15} />
            <span>IDENTIFIER ACCEPTED // READY</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#ff6a00] font-['Manrope',sans-serif]">
            <AlertCircle size={15} />
            <span>Profile picture is required to continue.</span>
          </div>
        )}
      </div>
    </div>
  );
};

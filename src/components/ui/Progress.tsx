import React from 'react';
import { Check } from 'lucide-react';

interface ProgressProps {
  currentStep: number;
  totalSteps?: number;
  stepLabels?: string[];
}

export const Progress: React.FC<ProgressProps> = ({
  currentStep,
  totalSteps = 6,
  stepLabels = ['Platforms', 'Design', 'Photo', 'Details', 'Links', 'Launch'],
}) => {
  const percent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div className="w-full flex flex-col gap-3 py-2">
      {/* Top telemetry row */}
      <div className="flex items-center justify-between text-xs font-['Oswald',sans-serif] uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="text-[#00d6c8] font-bold">NODE INIT // PHASE 0{currentStep}</span>
          <span className="text-[#9fb4c7]/50">OF 0{totalSteps}</span>
        </div>
        <span className="text-[#00d6c8] font-mono">{percent}% SYNCED</span>
      </div>

      {/* Progress track */}
      <div className="h-1.5 w-full bg-[#091c31] border border-[#173654] rounded-full overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-[#00d6c8] via-[#00a896] to-[#ff6a00] transition-all duration-300 ease-out shadow-[0_0_8px_rgba(0,214,200,0.5)]"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Step nodes */}
      <div className="grid grid-cols-6 gap-1 pt-1">
        {stepLabels.map((label, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={label}
              className={`flex flex-col items-center text-center transition-colors ${
                isCurrent
                  ? 'text-[#00d6c8]'
                  : isDone
                  ? 'text-[#9fb4c7]'
                  : 'text-[#9fb4c7]/30'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold mb-1 border transition-all ${
                  isCurrent
                    ? 'border-[#00d6c8] bg-[#00d6c8]/20 text-[#00d6c8] shadow-[0_0_10px_rgba(0,214,200,0.4)]'
                    : isDone
                    ? 'border-[#00d6c8]/60 bg-[#00d6c8]/10 text-[#00d6c8]'
                    : 'border-[#173654] bg-[#061424] text-[#9fb4c7]/40'
                }`}
              >
                {isDone ? <Check size={12} strokeWidth={3} /> : stepNum}
              </div>
              <span className="text-[10px] hidden sm:block font-['Oswald',sans-serif] uppercase tracking-wider truncate max-w-full">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

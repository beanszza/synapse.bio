import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chrome } from '../../components/Chrome';
import { Progress } from '../../components/ui/Progress';
import { Button } from '../../components/ui/Button';
import { getCurrentUser } from '../../lib/auth';
import { saveProfile, saveLinks, uploadAvatar } from '../../lib/store';
import { OnboardingState, SocialPlatformId } from '../../types';
import { PLATFORMS } from '../../lib/platforms';

import { Step1Platforms } from './Step1Platforms';
import { Step2Design } from './Step2Design';
import { Step3Photo } from './Step3Photo';
import { Step4Details } from './Step4Details';
import { Step5Links } from './Step5Links';
import { Step6Preview } from './Step6Preview';

import { ArrowLeft, ArrowRight, Rocket, AlertCircle } from 'lucide-react';

export const OnboardingLayout: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [state, setState] = useState<OnboardingState>({
    platforms: ['instagram', 'twitter', 'github'],
    theme: 'synapse-dark',
    avatarFile: null,
    avatarPreview: null,
    name: '',
    bio: '',
    links: [],
  });

  // Load active session
  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      const savedUsername = sessionStorage.getItem('synapse_onboarding_username');

      if (user) {
        setUserId(user.id);
        setUsername(user.username || savedUsername || 'user');
        if (!state.name) {
          setState((prev) => ({ ...prev, name: user.username || 'Operative' }));
        }
      } else if (savedUsername) {
        setUsername(savedUsername);
        setUserId('mock-' + savedUsername);
        if (!state.name) {
          setState((prev) => ({ ...prev, name: savedUsername }));
        }
      } else {
        navigate('/login');
      }
    }
    checkAuth();
  }, [navigate]);

  // Sync links when platforms change
  const handlePlatformsChange = (newPlatforms: SocialPlatformId[]) => {
    setState((prev) => {
      // Keep existing matching links, add new platforms
      const existingMap = new Map(prev.links.map((l) => [l.platform, l]));
      const newLinks = newPlatforms.map((p) => {
        if (existingMap.has(p)) {
          return existingMap.get(p)!;
        }
        const cfg = PLATFORMS.find((plat) => plat.id === p);
        return {
          id: p + '-' + Date.now(),
          platform: p,
          label: cfg?.name || p,
          url: cfg?.urlPrefix || 'https://',
        };
      });

      // Preserve any custom links
      const customLinks = prev.links.filter((l) => l.platform === 'custom');

      return {
        ...prev,
        platforms: newPlatforms,
        links: [...newLinks, ...customLinks],
      };
    });
  };

  // Step validation
  const validateCurrentStep = (): boolean => {
    setValidationError(null);

    if (currentStep === 1) {
      if (state.platforms.length === 0) {
        setValidationError('Please select at least 1 platform to continue.');
        return false;
      }
    }

    if (currentStep === 2) {
      if (state.theme !== 'synapse-dark') {
        setValidationError('Please select the SYNAPSE DARK theme to continue.');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!state.avatarPreview) {
        setValidationError('Profile picture is required. Upload a photo or select an operative badge.');
        return false;
      }
    }

    if (currentStep === 4) {
      if (!state.name.trim()) {
        setValidationError('Display Name is required.');
        return false;
      }
    }

    if (currentStep === 5) {
      const validLinks = state.links.filter((l) => l.url.trim().length > 3);
      if (validLinks.length === 0) {
        setValidationError('Please provide at least 1 valid link URL.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setValidationError(null);

    try {
      let finalAvatarUrl = state.avatarPreview || '';

      // Upload image file if File object is present
      if (state.avatarFile && userId) {
        try {
          finalAvatarUrl = await uploadAvatar(userId, state.avatarFile);
        } catch (uploadErr) {
          console.warn('Avatar upload fallback to preview:', uploadErr);
        }
      }

      // Save profile
      await saveProfile({
        username,
        user_id: userId,
        name: state.name,
        bio: state.bio,
        avatar_url: finalAvatarUrl,
        platforms: state.platforms,
        theme: state.theme,
      });

      // Save links
      const cleanLinks = state.links.map((l, index) => ({
        label: l.label,
        url: l.url,
        platform: l.platform,
        sort_order: index,
      }));
      await saveLinks(userId, cleanLinks);

      // Forward to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setValidationError(err?.message || 'Failed to finalize profile setup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Chrome username={username}>
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col justify-between">
        {/* Progress indicator */}
        <div className="mb-6">
          <Progress currentStep={currentStep} totalSteps={6} />
        </div>

        {/* Validation error message */}
        {validationError && (
          <div className="mb-6 p-3 bg-[#dd0000]/15 border border-[#dd0000]/60 rounded-sm text-xs text-[#ff4d4d] flex items-center gap-2 font-['Manrope',sans-serif]">
            <AlertCircle size={15} className="shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Step container card */}
        <div className="bg-[#091c31]/90 border border-[#173654] p-6 sm:p-8 rounded-sm shadow-[0_10px_35px_rgba(0,0,0,0.5)] relative">
          {/* Cyber corner brackets */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#00d6c8]" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#00d6c8]" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#00d6c8]" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#00d6c8]" />

          {currentStep === 1 && (
            <Step1Platforms
              selectedPlatforms={state.platforms}
              onChange={handlePlatformsChange}
            />
          )}

          {currentStep === 2 && (
            <Step2Design
              selectedTheme={state.theme}
              onSelect={(t) => setState((prev) => ({ ...prev, theme: t }))}
            />
          )}

          {currentStep === 3 && (
            <Step3Photo
              avatarFile={state.avatarFile}
              avatarPreview={state.avatarPreview}
              onChange={(file, preview) =>
                setState((prev) => ({ ...prev, avatarFile: file, avatarPreview: preview }))
              }
            />
          )}

          {currentStep === 4 && (
            <Step4Details
              name={state.name}
              bio={state.bio}
              onChangeName={(n) => setState((prev) => ({ ...prev, name: n }))}
              onChangeBio={(b) => setState((prev) => ({ ...prev, bio: b }))}
            />
          )}

          {currentStep === 5 && (
            <Step5Links
              links={state.links}
              onChangeLinks={(l) => setState((prev) => ({ ...prev, links: l }))}
            />
          )}

          {currentStep === 6 && <Step6Preview username={username} state={state} />}
        </div>

        {/* Navigation bottom bar */}
        <div className="mt-8 flex items-center justify-between border-t border-[#173654]/60 pt-4">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={handleBack}
              leftIcon={<ArrowLeft size={16} />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 6 ? (
            <Button
              type="button"
              variant="teal"
              size="md"
              onClick={handleNext}
              rightIcon={<ArrowRight size={16} />}
            >
              Continue to Step 0{currentStep + 1}
            </Button>
          ) : (
            <Button
              type="button"
              variant="ember"
              size="lg"
              onClick={handleFinish}
              isLoading={isSubmitting}
              rightIcon={<Rocket size={18} />}
            >
              LAUNCH PROFILE TO NETWORK
            </Button>
          )}
        </div>
      </div>
    </Chrome>
  );
};

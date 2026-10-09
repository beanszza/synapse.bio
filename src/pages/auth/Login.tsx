import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Chrome } from '../../components/Chrome';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SynapseMark } from '../../lib/brand';
import { signInWithUsername, normalizeUsername } from '../../lib/auth';
import { getMyProfile } from '../../lib/store';
import { Lock, User, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const clean = normalizeUsername(username);
      const res = await signInWithUsername(clean, password);
      const userId = res.user?.id;

      if (userId) {
        // Check if profile exists, otherwise redirect to onboarding
        const profile = await getMyProfile(userId);
        if (profile) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Chrome showNav={false}>
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#091c31]/90 border border-[#173654] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.5)] relative">
          {/* Cyber corner brackets */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#00d6c8]" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#00d6c8]" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#00d6c8]" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#00d6c8]" />

          {/* Header */}
          <div className="text-center mb-8 flex flex-col items-center">
            <SynapseMark size={52} className="mb-3" />
            <h1 className="font-['Michroma',sans-serif] text-xl sm:text-2xl tracking-wider text-[#e9f2f9]">
              ACCESS NODE
            </h1>
            <p className="text-xs font-['Oswald',sans-serif] tracking-widest text-[#9fb4c7] uppercase mt-1">
              synapse.bio // operative identification
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-[#dd0000]/15 border border-[#dd0000]/60 rounded-sm text-xs text-[#ff4d4d] font-['Manrope',sans-serif]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Username"
              placeholder="e.g. vince"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              leftAddon={<User size={16} />}
              required
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftAddon={<Lock size={16} />}
              required
            />

            <Button
              type="submit"
              variant="teal"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={18} />}
            >
              INITIALIZE SESSION
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#173654]/70 text-center">
            <p className="text-xs font-['Manrope',sans-serif] text-[#9fb4c7]">
              Need your personal link node?{' '}
              <Link
                to="/signup"
                className="text-[#00d6c8] font-['Oswald',sans-serif] tracking-wider uppercase hover:underline ml-1 font-semibold"
              >
                Claim your handle →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Chrome>
  );
};

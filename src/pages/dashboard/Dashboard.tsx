import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Chrome } from '../../components/Chrome';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PlatformIcon } from '../../components/PlatformIcon';
import { SynapseMark } from '../../lib/brand';
import { getCurrentUser, signOutUser } from '../../lib/auth';
import { getMyProfile, getLinksByUserId, saveProfile, saveLinks, uploadAvatar } from '../../lib/store';
import { Profile, ProfileLink, SocialPlatformId } from '../../types';
import { PLATFORMS } from '../../lib/platforms';
import {
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  Upload,
  Check,
  Save,
  LogOut,
  ChevronUp,
  ChevronDown,
  Globe,
  Share2,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);

      const p = await getMyProfile(currentUser.id);
      if (!p) {
        navigate('/onboarding');
        return;
      }
      setProfile(p);
      setName(p.name);
      setBio(p.bio || '');
      setAvatarPreview(p.avatar_url || null);

      const l = await getLinksByUserId(currentUser.id);
      setLinks(l);
    }
    loadData();
  }, [navigate]);

  const handleCopyLink = () => {
    if (!profile) return;
    const url = `${window.location.origin}/${profile.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddLink = () => {
    if (!user) return;
    const newLink: ProfileLink = {
      id: 'link-' + Date.now(),
      user_id: user.id,
      label: 'New Link',
      url: 'https://',
      platform: 'website',
      sort_order: links.length,
    };
    setLinks([...links, newLink]);
  };

  const handleUpdateLink = (id: string, field: 'label' | 'url' | 'platform', value: any) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleMoveLink = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;
    setLinks(newLinks);
  };

  const handleSaveAll = async () => {
    if (!user || !profile) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      let finalAvatarUrl = avatarPreview;
      if (avatarFile) {
        finalAvatarUrl = await uploadAvatar(user.id, avatarFile);
      }

      const updated = await saveProfile({
        username: profile.username,
        user_id: user.id,
        name,
        bio,
        avatar_url: finalAvatarUrl,
        platforms: profile.platforms,
        theme: profile.theme,
      });

      setProfile(updated);

      await saveLinks(
        user.id,
        links.map((l, idx) => ({
          label: l.label,
          url: l.url,
          platform: l.platform,
          sort_order: idx,
        }))
      );

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: any) {
      alert(err?.message || 'Error saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate('/login');
  };

  if (!profile || !user) {
    return (
      <Chrome>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center font-['Michroma',sans-serif] text-sm text-[#00d6c8] animate-pulse">
            LOADING OPERATIVE DATA...
          </div>
        </div>
      </Chrome>
    );
  }

  const profileUrl = `${window.location.origin}/${profile.username}`;

  return (
    <Chrome username={user.username} onLogout={handleLogout}>
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {/* Top Control Banner */}
        <div className="bg-[#091c31]/90 border border-[#173654] p-4 sm:p-6 rounded-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#00d6c8] p-0.5 bg-[#061424] overflow-hidden shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <SynapseMark size={24} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Michroma',sans-serif] text-base sm:text-lg text-[#e9f2f9]">
                  {name || profile.name}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-[#00d6c8]/20 text-[#00d6c8] border border-[#00d6c8]/40 rounded">
                  ACTIVE NODE
                </span>
              </div>
              <p className="text-xs font-mono text-[#00d6c8] mt-0.5">
                synapse.bio/{profile.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>

            <Link
              to={`/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 border border-[#173654] bg-[#091c31] hover:border-[#00d6c8] text-[#00d6c8] rounded-sm text-xs font-['Oswald',sans-serif] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View Profile</span>
              <ExternalLink size={13} />
            </Link>

            <Button
              type="button"
              variant="teal"
              size="sm"
              onClick={handleSaveAll}
              isLoading={isSaving}
              leftIcon={saveSuccess ? <Check size={14} /> : <Save size={14} />}
            >
              {saveSuccess ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Workspace Layout: Left Editor, Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Settings and Links Editor (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Identity Settings Card */}
            <div className="bg-[#091c31]/90 border border-[#173654] p-6 rounded-sm">
              <h2 className="font-['Michroma',sans-serif] text-sm text-[#00d6c8] tracking-wider mb-4 uppercase">
                // OPERATIVE PROFILE SETTINGS
              </h2>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border border-[#00d6c8] bg-[#061424] overflow-hidden shrink-0">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <SynapseMark size={24} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="cursor-pointer">
                      <span className="px-3 py-1.5 border border-[#173654] bg-[#061424] hover:border-[#00d6c8] text-xs font-['Oswald',sans-serif] uppercase tracking-wider text-[#e9f2f9] rounded-sm inline-flex items-center gap-2 transition-colors">
                        <Upload size={13} /> Change Avatar
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarFile}
                      />
                    </label>
                    <p className="text-[11px] text-[#9fb4c7]/60 mt-1">
                      PNG, JPG, or WEBP up to 5MB.
                    </p>
                  </div>
                </div>

                <Input
                  label="Display Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vince"
                />

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-['Oswald',sans-serif] uppercase tracking-wider text-[#9fb4c7]">
                    <span>Bio / Mission</span>
                    <span className="font-mono text-[11px] text-[#00d6c8]">
                      {bio.length} / 120 CHARS
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={120}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short bio about your craft or network..."
                    className="w-full bg-[#061424]/90 border border-[#173654] text-[#e9f2f9] font-['Manrope',sans-serif] text-sm p-3 rounded-sm transition-all duration-200 placeholder:text-[#9fb4c7]/40 focus:outline-none focus:border-[#00d6c8] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Links Editor Card */}
            <div className="bg-[#091c31]/90 border border-[#173654] p-6 rounded-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-['Michroma',sans-serif] text-sm text-[#00d6c8] tracking-wider uppercase">
                  // HYPERLINK NODES ({links.length})
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLink}
                  leftIcon={<Plus size={14} />}
                >
                  Add Link
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {links.map((link, index) => (
                  <div
                    key={link.id}
                    className="p-3.5 bg-[#061424] border border-[#173654] rounded-sm flex flex-col gap-2.5 transition-all hover:border-[#9fb4c7]/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <select
                          value={link.platform || 'website'}
                          onChange={(e) =>
                            handleUpdateLink(link.id, 'platform', e.target.value)
                          }
                          className="bg-[#091c31] border border-[#173654] text-xs font-['Oswald',sans-serif] uppercase tracking-wider text-[#00d6c8] rounded px-2 py-1 focus:outline-none cursor-pointer"
                        >
                          {PLATFORMS.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                          <option value="custom">Custom Link</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveLink(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-[#9fb4c7] hover:text-[#00d6c8] disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          <ChevronUp size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveLink(index, 'down')}
                          disabled={index === links.length - 1}
                          className="p-1 text-[#9fb4c7] hover:text-[#00d6c8] disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ChevronDown size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(link.id)}
                          className="p-1 text-[#9fb4c7]/50 hover:text-[#ff4d4d] cursor-pointer ml-1"
                          title="Delete link"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleUpdateLink(link.id, 'label', e.target.value)}
                        placeholder="Button Title"
                        className="bg-[#091c31] border border-[#173654] text-xs text-[#e9f2f9] px-2.5 py-1.5 rounded focus:outline-none focus:border-[#00d6c8]"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                        placeholder="https://..."
                        className="bg-[#091c31] border border-[#173654] text-xs text-[#e9f2f9] px-2.5 py-1.5 rounded focus:outline-none focus:border-[#00d6c8] font-mono"
                      />
                    </div>
                  </div>
                ))}

                {links.length === 0 && (
                  <div className="p-8 border border-dashed border-[#173654] rounded text-center text-[#9fb4c7] text-xs">
                    No links yet. Click <strong>+ Add Link</strong> above to start connecting your channels.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Mockup Device Frame (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="sticky top-8 w-full max-w-xs flex flex-col items-center">
              <span className="text-[11px] font-['Oswald',sans-serif] uppercase tracking-wider text-[#9fb4c7] mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d6c8] animate-ping" />
                LIVE HUD PREVIEW
              </span>

              {/* Smartphone Frame */}
              <div className="w-full bg-[#030b14] border-2 border-[#173654] rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
                {/* Speaker notch */}
                <div className="w-20 h-2.5 bg-[#061424] rounded-full mx-auto mb-4 border border-[#173654]/40" />

                {/* Profile Card Inside Frame */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-[#00d6c8] p-0.5 bg-[#091c31] shadow-[0_0_20px_rgba(0,214,200,0.4)] mb-3 overflow-hidden">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <SynapseMark size={24} />
                      </div>
                    )}
                  </div>

                  <h3 className="font-['Michroma',sans-serif] text-sm text-[#e9f2f9] tracking-wider truncate max-w-full">
                    {name || 'Operative'}
                  </h3>
                  <span className="text-[11px] font-mono text-[#00d6c8] mt-0.5 font-bold">
                    @{profile.username}
                  </span>

                  {bio && (
                    <p className="text-xs font-['Manrope',sans-serif] text-[#9fb4c7] mt-2 line-clamp-2 px-1">
                      {bio}
                    </p>
                  )}

                  {/* Links in preview */}
                  <div className="w-full flex flex-col gap-2 mt-5 max-h-[300px] overflow-y-auto pr-0.5">
                    {links.map((link) => (
                      <div
                        key={link.id}
                        className="w-full p-2.5 bg-[#091c31]/90 border border-[#173654] hover:border-[#00d6c8] rounded-sm flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="w-6 h-6 rounded bg-[#00d6c8]/10 text-[#00d6c8] flex items-center justify-center shrink-0">
                            <PlatformIcon platform={link.platform} size={13} />
                          </div>
                          <span className="text-xs font-['Oswald',sans-serif] uppercase tracking-wider text-[#e9f2f9] truncate">
                            {link.label || 'Link'}
                          </span>
                        </div>
                        <ExternalLink size={12} className="text-[#9fb4c7]/60 shrink-0 ml-1" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-3 border-t border-[#173654]/40 flex items-center gap-1.5 opacity-60">
                    <SynapseMark size={14} />
                    <span className="text-[9px] font-['Michroma',sans-serif] tracking-wider text-[#9fb4c7]">
                      SYNAPSE.BIO
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Chrome>
  );
};

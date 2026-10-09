import { supabase, isSupabaseConfigured } from './supabase';
import { Profile, ProfileLink, SocialPlatformId } from '../types';

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  if (!isSupabaseConfigured) {
    // Return base64 preview for mock mode
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  const fileExt = file.name.split('.').pop() || 'png';
  const filePath = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw new Error(`Avatar upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const clean = username.trim().toLowerCase();

  if (!isSupabaseConfigured) {
    const mockProfiles = JSON.parse(localStorage.getItem('synapse_mock_profiles') || '{}');
    return mockProfiles[clean] || null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', clean)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile by username:', error);
    return null;
  }
  return data;
}

export async function getMyProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured) {
    const mockProfiles = JSON.parse(localStorage.getItem('synapse_mock_profiles') || '{}');
    for (const key in mockProfiles) {
      if (mockProfiles[key].user_id === userId) return mockProfiles[key];
    }
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching my profile:', error);
    return null;
  }
  return data;
}

export async function saveProfile(profile: Partial<Profile> & { username: string; user_id: string; name: string }): Promise<Profile> {
  if (!isSupabaseConfigured) {
    const mockProfiles = JSON.parse(localStorage.getItem('synapse_mock_profiles') || '{}');
    const existing = mockProfiles[profile.username] || {};
    const updated: Profile = {
      username: profile.username,
      user_id: profile.user_id,
      name: profile.name,
      bio: profile.bio ?? existing.bio ?? '',
      avatar_url: profile.avatar_url ?? existing.avatar_url ?? '',
      platforms: profile.platforms ?? existing.platforms ?? [],
      theme: profile.theme ?? existing.theme ?? 'synapse-dark',
      created_at: existing.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockProfiles[profile.username] = updated;
    localStorage.setItem('synapse_mock_profiles', JSON.stringify(mockProfiles));
    return updated;
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      username: profile.username,
      user_id: profile.user_id,
      name: profile.name,
      bio: profile.bio || null,
      avatar_url: profile.avatar_url || null,
      platforms: profile.platforms || [],
      theme: profile.theme || 'synapse-dark',
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getLinksByUserId(userId: string): Promise<ProfileLink[]> {
  if (!isSupabaseConfigured) {
    const mockLinks = JSON.parse(localStorage.getItem('synapse_mock_links') || '{}');
    return (mockLinks[userId] || []).sort((a: ProfileLink, b: ProfileLink) => a.sort_order - b.sort_order);
  }

  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching links:', error);
    return [];
  }
  return data || [];
}

export async function saveLinks(
  userId: string,
  links: { label: string; url: string; platform?: SocialPlatformId | string; sort_order: number }[]
): Promise<void> {
  if (!isSupabaseConfigured) {
    const mockLinks = JSON.parse(localStorage.getItem('synapse_mock_links') || '{}');
    mockLinks[userId] = links.map((l, idx) => ({
      id: 'mock-link-' + idx + '-' + Date.now(),
      user_id: userId,
      ...l,
      sort_order: l.sort_order ?? idx,
      created_at: new Date().toISOString(),
    }));
    localStorage.setItem('synapse_mock_links', JSON.stringify(mockLinks));
    return;
  }

  // Delete existing links for this user, then insert fresh
  const { error: delError } = await supabase.from('links').delete().eq('user_id', userId);
  if (delError) {
    console.error('Error clearing old links:', delError);
  }

  if (links.length === 0) return;

  const toInsert = links.map((l, index) => ({
    user_id: userId,
    label: l.label,
    url: l.url,
    platform: l.platform || null,
    sort_order: index,
  }));

  const { error: insError } = await supabase.from('links').insert(toInsert);
  if (insError) {
    throw new Error(insError.message);
  }
}

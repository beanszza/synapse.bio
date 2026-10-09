import { supabase, isSupabaseConfigured } from './supabase';

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

export function usernameToEmail(username: string): string {
  const clean = normalizeUsername(username);
  return `${clean}@synapse.bio`;
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const clean = normalizeUsername(username);
  if (!clean || clean.length < 3) return false;

  if (!isSupabaseConfigured) {
    // Local mock check
    const localProfiles = JSON.parse(localStorage.getItem('synapse_mock_profiles') || '{}');
    return !localProfiles[clean];
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', clean)
    .maybeSingle();

  if (error) {
    console.error('Error checking username:', error);
    return false;
  }
  return !data;
}

export async function signUpWithUsername(username: string, password: string) {
  const clean = normalizeUsername(username);
  if (clean.length < 3) {
    throw new Error('Username must be at least 3 characters long (letters, numbers, underscores).');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const available = await isUsernameAvailable(clean);
  if (!available) {
    throw new Error(`Username "@${clean}" is already claimed. Please choose another.`);
  }

  if (!isSupabaseConfigured) {
    // Offline / demo fallback session
    const mockId = 'mock-' + clean;
    const session = { id: mockId, username: clean, email: usernameToEmail(clean) };
    localStorage.setItem('synapse_mock_session', JSON.stringify(session));
    return { user: { id: mockId, email: usernameToEmail(clean) }, session: null };
  }

  const email = usernameToEmail(clean);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: clean,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signInWithUsername(username: string, password: string) {
  const clean = normalizeUsername(username);
  if (!clean) {
    throw new Error('Please enter your username.');
  }
  if (!password) {
    throw new Error('Please enter your password.');
  }

  if (!isSupabaseConfigured) {
    // Offline / demo fallback session
    const session = { id: 'mock-' + clean, username: clean, email: usernameToEmail(clean) };
    localStorage.setItem('synapse_mock_session', JSON.stringify(session));
    return { user: { id: 'mock-' + clean }, session: null };
  }

  const email = usernameToEmail(clean);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOutUser() {
  if (!isSupabaseConfigured) {
    localStorage.removeItem('synapse_mock_session');
    return;
  }
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured) {
    const raw = localStorage.getItem('synapse_mock_session');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      id: parsed.id,
      email: parsed.email,
      username: parsed.username,
    };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Extract username from metadata or email prefix
  const username = user.user_metadata?.username || user.email?.split('@')[0] || '';
  return {
    id: user.id,
    email: user.email,
    username: normalizeUsername(username),
  };
}

export type SocialPlatformId =
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'twitter'
  | 'twitch'
  | 'discord'
  | 'github'
  | 'spotify'
  | 'linkedin'
  | 'website'
  | 'custom';

export interface SocialPlatformConfig {
  id: SocialPlatformId;
  name: string;
  icon: string;
  placeholder: string;
  urlPrefix?: string;
  color?: string;
}

export interface Profile {
  username: string;
  user_id: string;
  name: string;
  bio?: string | null;
  avatar_url?: string | null;
  platforms: SocialPlatformId[];
  theme: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileLink {
  id: string;
  user_id: string;
  label: string;
  url: string;
  platform?: SocialPlatformId | string;
  sort_order: number;
  created_at?: string;
}

export interface OnboardingState {
  platforms: SocialPlatformId[];
  theme: string;
  avatarFile: File | null;
  avatarPreview: string | null;
  name: string;
  bio: string;
  links: {
    id: string;
    platform: SocialPlatformId;
    label: string;
    url: string;
  }[];
}

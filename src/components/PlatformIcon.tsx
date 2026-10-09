import React from 'react';
import {
  Instagram,
  Youtube,
  Twitter,
  Tv,
  MessageSquare,
  Github,
  Music,
  Linkedin,
  Globe,
  ExternalLink,
  Video,
} from 'lucide-react';
import { SocialPlatformId } from '../types';

interface PlatformIconProps {
  platform?: SocialPlatformId | string;
  size?: number;
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = 18, className = '' }) => {
  switch (platform) {
    case 'instagram':
      return <Instagram size={size} className={className} />;
    case 'tiktok':
      return <Video size={size} className={className} />;
    case 'youtube':
      return <Youtube size={size} className={className} />;
    case 'twitter':
      return <Twitter size={size} className={className} />;
    case 'twitch':
      return <Tv size={size} className={className} />;
    case 'discord':
      return <MessageSquare size={size} className={className} />;
    case 'github':
      return <Github size={size} className={className} />;
    case 'spotify':
      return <Music size={size} className={className} />;
    case 'linkedin':
      return <Linkedin size={size} className={className} />;
    case 'website':
      return <Globe size={size} className={className} />;
    default:
      return <ExternalLink size={size} className={className} />;
  }
};

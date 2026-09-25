import React from 'react';
import {
  Wrench,
  Globe,
  Download,
  Code,
  BookOpen,
  Shield,
  Sparkles,
  Zap,
  Gamepad2,
  Video,
  Film,
  Plane,
  DollarSign,
  Layers,
  Cpu,
  Terminal,
  Smartphone,
  Bot,
  Share2,
  ExternalLink,
  MessageSquare,
  Settings,
  Key,
  Box,
  Star,
  Palette,
  Eye,
  Compass,
  FileText,
  Cloud,
  Database,
  Folder,
  Flame,
  Music,
  Headphones,
  Send,
  Package,
  Server,
  HardDrive,
  Lock,
  Unlock,
  LucideIcon
} from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

const ICON_MAP: Record<string, LucideIcon | React.ComponentType<{ size?: number; className?: string }>> = {
  Wrench,
  Globe,
  Download,
  Code,
  BookOpen,
  Shield,
  Sparkles,
  Zap,
  Gamepad2,
  Video,
  Film,
  Plane,
  DollarSign,
  Layers,
  Cpu,
  Terminal,
  Smartphone,
  Bot,
  Share2,
  ExternalLink,
  MessageSquare,
  Settings,
  Key,
  Box,
  Star,
  Palette,
  Eye,
  Compass,
  FileText,
  Cloud,
  Database,
  Folder,
  Flame,
  Music,
  Headphones,
  Send,
  Package,
  Server,
  HardDrive,
  Lock,
  Unlock,
  Whatsapp: SiWhatsapp,
  WhatsApp: SiWhatsapp
};

export const AVAILABLE_ICON_NAMES = Object.keys(ICON_MAP);

interface ToolIconProps {
  name: string;
  size?: number;
  className?: string;
  fallbackEmoji?: string;
}

export default function ToolIcon({ name, size = 18, className = '', fallbackEmoji }: ToolIconProps) {
  if (!name && fallbackEmoji) {
    return <span style={{ fontSize: `${size}px` }} className={className}>{fallbackEmoji}</span>;
  }

  // If the name is an emoji directly
  if (name && (/\p{Extended_Pictographic}/u.test(name) || name.length <= 2)) {
    return <span style={{ fontSize: `${size}px` }} className={className}>{name}</span>;
  }

  // Match case-insensitively or exact match
  const matchedKey = Object.keys(ICON_MAP).find(
    k => k.toLowerCase() === (name || '').toLowerCase()
  );

  if (matchedKey) {
    const Component = ICON_MAP[matchedKey];
    return <Component size={size} className={className} />;
  }

  // Check if it's whatsapp
  if (name && name.toLowerCase().includes('whatsapp')) {
    return <SiWhatsapp size={size} className={className} />;
  }

  // Fallback to emoji or general Wrench icon
  if (fallbackEmoji) {
    return <span style={{ fontSize: `${size}px` }} className={className}>{fallbackEmoji}</span>;
  }

  return <Wrench size={size} className={className} />;
}

import { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  details: {
    heading: string;
    useCase: string;
    benefits: string[];
  };
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
  timestamp: Date;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}
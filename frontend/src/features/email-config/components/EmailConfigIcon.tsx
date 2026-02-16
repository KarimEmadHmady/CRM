import React from 'react';
import { Mail, Server } from 'lucide-react';

interface EmailConfigIconProps {
  provider: string;
  className?: string;
}

export const EmailConfigIcon: React.FC<EmailConfigIconProps> = ({ 
  provider, 
  className = "w-5 h-5" 
}) => {
  return provider === 'gmail' ? 
    <Mail className={`${className} text-red-600`} /> : 
    <Server className={`${className} text-blue-600`} />;
};

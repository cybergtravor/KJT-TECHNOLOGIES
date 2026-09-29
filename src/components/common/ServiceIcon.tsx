import React from 'react';
import {
  Globe,
  Code2,
  Smartphone,
  Monitor,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  HardDrive,
  Camera,
  Network,
  Server,
  Cloud,
  Wrench,
  Cpu,
  Globe2,
  TrendingUp,
  Palette,
  Database,
  Mail,
  Compass,
  Fingerprint,
  Users,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface ServiceIconProps {
  name: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Globe':
      return <Globe className={className} />;
    case 'Code2':
      return <Code2 className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Monitor':
      return <Monitor className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'HardDrive':
      return <HardDrive className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'Network':
      return <Network className={className} />;
    case 'Server':
      return <Server className={className} />;
    case 'Cloud':
      return <Cloud className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Globe2':
      return <Globe2 className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Database':
      return <Database className={className} />;
    case 'Mail':
      return <Mail className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Fingerprint':
      return <Fingerprint className={className} />;
    case 'Users':
      return <Users className={className} />;
    default:
      return <Layers className={className} />;
  }
};

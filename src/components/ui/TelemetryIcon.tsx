import React from 'react';
import {
  Server,
  Gauge,
  AlertTriangle,
  Cpu,
  Activity,
  Clock,
  Shield,
  CheckCircle,
  Zap,
  Database,
} from 'lucide-react';
import { TelemetryIconName } from '../../types/course';

interface TelemetryIconProps {
  name: TelemetryIconName;
  className?: string;
}

export function TelemetryIcon({ name, className = 'w-4 h-4' }: TelemetryIconProps): React.JSX.Element {
  switch (name) {
    case 'Server':
      return <Server className={className} />;
    case 'Gauge':
      return <Gauge className={className} />;
    case 'AlertTriangle':
      return <AlertTriangle className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'CheckCircle':
      return <CheckCircle className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Database':
      return <Database className={className} />;
  }
}

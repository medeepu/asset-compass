export interface Asset {
  id: string;
  name: string;
  owner: string;
  ip: string;
  mac: string;
  hostname: string;
  deviceType: string;
  roleTag: string;
  status: 'online' | 'offline' | 'unknown';
  threatScore: number;
  confidenceScore: number;
  blastRadiusScore: number;
  firstSeen: string;
  lastSeen: string;
  category: string;
  location: string;
  network: string;
  interfaceType: string;
  ipHistory: HistoryItem[];
  hostnameHistory: HistoryItem[];
  macHistory: HistoryItem[];
  managementTools: string[];
}

export interface HistoryItem {
  value: string;
  timestamp: string;
  isCurrent: boolean;
}

export interface TrafficStats {
  inbound: number;
  outbound: number;
  unit: string;
}

export interface FlowData {
  id: string;
  sourceIp: string;
  destIp: string;
  sourcePort: number;
  destPort: number;
  protocol: string;
  bytes: number;
  packets: number;
  timestamp: string;
  application: string;
  direction: 'inbound' | 'outbound';
}

export interface ThreatEvent {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  timestamp: string;
  description: string;
  mitreCategory?: string;
  mitreId?: string;
}

export interface Peer {
  id: string;
  name: string;
  ip: string;
  location: string;
  type: 'internal' | 'external';
  category: string;
  connectionCount: number;
}

export interface MitreCategory {
  name: string;
  count: number;
  tactics: string[];
}

export interface ProtocolBreakdown {
  tcp: number;
  udp: number;
  icmp: number;
  other: number;
  unknownApps: string[];
}

export interface AnomalyDetail {
  id: string;
  type: string;
  description: string;
  confidence: number;
  timestamp: string;
}

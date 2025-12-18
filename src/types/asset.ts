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

export interface ApplicationData {
  id: string;
  name: string;
  category: string;
  bytes: number;
  packets: number;
  sessions: number;
  risk: 'low' | 'medium' | 'high';
}

export interface ConversationData {
  id: string;
  sourceIp: string;
  destIp: string;
  application: string;
  duration: string;
  bytesIn: number;
  bytesOut: number;
  startTime: string;
}

export interface QoSData {
  id: string;
  application: string;
  latency: number;
  jitter: number;
  packetLoss: number;
  mos: number;
}

export interface TimelineEvent {
  id: string;
  type: 'network' | 'security' | 'config' | 'identity';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'error';
}

export interface ChangeHistoryItem {
  id: string;
  changeType: 'os' | 'app' | 'behavior' | 'config';
  description: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

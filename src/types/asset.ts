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
  // NMS/IPAM Integration
  connectionType: 'wired' | 'wireless' | 'unknown';
  connectedSwitch?: string;
  switchPort?: string;
  vlan?: string;
  subnet?: string;
  dhcpServer?: string;
  dnsServer?: string;
  gateway?: string;
  // Wireless specific
  ssid?: string;
  accessPoint?: string;
  accessPointMac?: string;
  channel?: number;
  frequency?: string;
  signalStrength?: number;
  noiseLevel?: number;
  snr?: number;
  authMethod?: string;
  encryptionType?: string;
  // Tags and Comments
  tags?: string[];
  comments?: AssetComment[];
}

export interface AssetComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
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
  changePercent?: number;
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
  isNew?: boolean;
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
  mitreId?: string;
  mitreCategory?: string;
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
  type: 'network' | 'security' | 'identity' | 'peer';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'error';
}

export interface ChangeHistoryItem {
  id: string;
  changeType: 'ip' | 'mac' | 'hostname' | 'peer' | 'port' | 'vlan' | 'traffic';
  description: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface NetworkBehavior {
  bandwidthToday: number;
  bandwidthYesterday: number;
  flowCountToday: number;
  flowCountYesterday: number;
  uniquePeersToday: number;
  uniquePeersYesterday: number;
  newPeersToday: number;
}

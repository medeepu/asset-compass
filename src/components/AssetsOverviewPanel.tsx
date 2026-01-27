import { Asset } from "@/types/asset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScoreBadge } from "./ScoreBadge";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Monitor, 
  Server, 
  Laptop, 
  Smartphone,
  AlertTriangle,
  Shield,
  Activity,
  TrendingUp,
  Filter,
  Download,
  ChevronRight,
  Database,
  Wifi,
  Globe,
  HardDrive,
  Router,
  Camera,
  Phone,
  Printer,
  Users,
  Folder,
  AppWindow,
  Network,
  Settings,
  ArrowDownLeft,
  ArrowUpRight
} from "lucide-react";
import { useState, useMemo } from "react";
import { X } from "lucide-react";

interface AssetsOverviewPanelProps {
  assets: Asset[];
  onSelectAsset: (assetId: string) => void;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const getDeviceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'server':
      return Server;
    case 'laptop':
    case 'workstation':
      return Laptop;
    case 'mobile':
      return Smartphone;
    default:
      return Monitor;
  }
};

// Device roles with icons
const deviceRoles = [
  { id: 'domain-controller', label: 'Domain Controller', icon: Server, count: 5 },
  { id: 'file-server', label: 'File Server', icon: HardDrive, count: 8 },
  { id: 'mobile-device', label: 'Mobile Device', icon: Smartphone, count: 0 },
  { id: 'pc', label: 'PC', icon: Monitor, count: 55 },
  { id: 'vulnerability-scanner', label: 'Vulnerability Scanner', icon: Shield, count: 0 },
  { id: 'vpn-client', label: 'VPN Client', icon: Globe, count: 6 },
  { id: 'vpn-gateway', label: 'VPN Gateway', icon: Router, count: 1 },
  { id: 'wifi-ap', label: 'Wi-Fi Access Point', icon: Wifi, count: 0 },
  { id: 'ip-camera', label: 'IP Camera', icon: Camera, count: 0 },
  { id: 'medical-device', label: 'Medical Device', icon: Activity, count: 0 },
  { id: 'printer', label: 'Printer', icon: Printer, count: 1 },
  { id: 'voip-phone', label: 'VoIP Phone', icon: Phone, count: 43 },
  { id: 'database', label: 'Database', icon: Database, count: 7 },
  { id: 'web-server', label: 'Web Server', icon: Globe, count: 29 },
  { id: 'load-balancer', label: 'Load Balancer', icon: Network, count: 0 },
  { id: 'proxy-server', label: 'Web Proxy Server', icon: Globe, count: 0 },
  { id: 'firewall', label: 'Firewall', icon: Shield, count: 0 },
  { id: 'gateway', label: 'Gateway', icon: Router, count: 4 },
  { id: 'custom-device', label: 'Custom Device', icon: Settings, count: 1 },
  { id: 'nat-gateway', label: 'NAT Gateway', icon: Router, count: 4 },
  { id: 'attack-simulator', label: 'Attack Simulator', icon: AlertTriangle, count: 0 },
];

// Protocols with server/client counts
const protocolStats = [
  { name: 'Database', servers: 6, clients: 11 },
  { name: 'DHCP', servers: 9, clients: 23 },
  { name: 'DNS', servers: 17, clients: 91 },
  { name: 'HL7', servers: 1, clients: 2 },
  { name: 'HTTP', servers: 32, clients: 102 },
  { name: 'ICA', servers: 6, clients: 26 },
  { name: 'Kerberos', servers: 3, clients: 13 },
  { name: 'LDAP', servers: 6, clients: 29 },
  { name: 'MSRPC', servers: 7, clients: 25 },
  { name: 'NFS', servers: 4, clients: 4 },
  { name: 'SMB', servers: 12, clients: 45 },
  { name: 'SSH', servers: 8, clients: 32 },
];

// Summary stats for header
const headerStats = [
  { label: 'New Devices', value: 0, color: 'text-primary' },
  { label: 'Active Devices', value: 296, color: 'text-primary' },
  { label: 'Device Groups', value: 24, color: 'text-primary' },
  { label: 'Files', value: 1, color: 'text-primary' },
  { label: 'Users', value: 79, color: 'text-primary' },
  { label: 'Networks', value: 1, color: 'text-primary' },
  { label: 'Applications', value: 17, color: 'text-primary' },
];

export const AssetsOverviewPanel = ({ assets, onSelectAsset }: AssetsOverviewPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoleFilter, setActiveRoleFilter] = useState<string | null>(null);
  const [activeProtocolFilter, setActiveProtocolFilter] = useState<string | null>(null);

  // Map role IDs to asset properties
  const roleToAssetMapping: Record<string, string[]> = {
    'domain-controller': ['Domain Controller'],
    'file-server': ['File Server'],
    'mobile-device': ['Mobile'],
    'pc': ['Workstation', 'Laptop'],
    'vulnerability-scanner': ['Scanner'],
    'vpn-client': ['VPN Client'],
    'vpn-gateway': ['VPN Gateway'],
    'wifi-ap': ['Access Point'],
    'ip-camera': ['Camera'],
    'medical-device': ['Medical'],
    'printer': ['Printer'],
    'voip-phone': ['VoIP Phone'],
    'database': ['Database'],
    'web-server': ['Web Server'],
    'load-balancer': ['Load Balancer'],
    'proxy-server': ['Proxy'],
    'firewall': ['Firewall'],
    'gateway': ['Gateway'],
    'custom-device': ['Custom'],
    'nat-gateway': ['NAT Gateway'],
    'attack-simulator': ['Attack Simulator'],
  };

  // Filter assets based on active filters
  const filteredAssets = useMemo(() => {
    let result = assets;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.ip.includes(searchQuery)
      );
    }
    
    // Apply role filter
    if (activeRoleFilter) {
      const matchingTypes = roleToAssetMapping[activeRoleFilter] || [];
      result = result.filter(asset => 
        matchingTypes.some(type => 
          asset.deviceType.toLowerCase().includes(type.toLowerCase()) ||
          asset.roleTag.toLowerCase().includes(type.toLowerCase())
        )
      );
    }
    
    // Apply protocol filter (simulated - in real app would check actual protocol usage)
    if (activeProtocolFilter) {
      // For demo, filter based on device characteristics
      result = result.filter(asset => {
        const protocolLower = activeProtocolFilter.toLowerCase();
        if (protocolLower === 'http') return asset.deviceType.includes('Server') || asset.roleTag.includes('Web');
        if (protocolLower === 'dns') return true; // All devices use DNS
        if (protocolLower === 'smb') return asset.deviceType === 'Server' || asset.deviceType === 'Workstation';
        if (protocolLower === 'ssh') return asset.deviceType === 'Server';
        if (protocolLower === 'database') return asset.roleTag.includes('Database');
        if (protocolLower === 'ldap' || protocolLower === 'kerberos') return asset.deviceType === 'Server';
        return true;
      });
    }
    
    return result;
  }, [assets, searchQuery, activeRoleFilter, activeProtocolFilter]);

  const handleRoleClick = (roleId: string, count: number) => {
    if (count === 0) return;
    setActiveRoleFilter(prev => prev === roleId ? null : roleId);
    setActiveProtocolFilter(null); // Clear other filter
  };

  const handleProtocolClick = (protocolName: string) => {
    setActiveProtocolFilter(prev => prev === protocolName ? null : protocolName);
    setActiveRoleFilter(null); // Clear other filter
  };

  const clearFilters = () => {
    setActiveRoleFilter(null);
    setActiveProtocolFilter(null);
    setSearchQuery('');
  };

  const hasActiveFilter = activeRoleFilter || activeProtocolFilter;
  const activeFilterLabel = activeRoleFilter 
    ? deviceRoles.find(r => r.id === activeRoleFilter)?.label 
    : activeProtocolFilter;

  // Calculate summary stats
  const criticalAssets = assets.filter(a => a.threatScore >= 80).length;
  const highRiskAssets = assets.filter(a => a.threatScore >= 60 && a.threatScore < 80).length;

  // Top risky assets from filtered list
  const topRiskyAssets = [...filteredAssets].sort((a, b) => b.threatScore - a.threatScore).slice(0, 5);

  // Traffic summary
  const totalBytesIn = 245600000;
  const totalBytesOut = 189400000;

  const formatBytes = (bytes: number): string => {
    if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)} GB`;
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
    if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Browse Assets</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Summary Stats Row - Aligned Grid */}
        <div className="grid grid-cols-7 gap-3">
          {headerStats.map((stat, index) => (
            <div key={index} className="bg-secondary/30 border border-border/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-primary text-lg font-bold font-mono leading-none">
                {stat.value} <span className="text-xs font-normal text-muted-foreground">{stat.label.toLowerCase().replace(/s$/, '').replace('device', 'device')}{stat.value !== 1 ? 's' : ''}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Devices by Role and Protocol - Side by Side */}
          <div className="grid grid-cols-12 gap-6">
            {/* Devices by Role - Takes 7 columns */}
            <div className="col-span-7">
              <h2 className="text-sm font-medium text-foreground mb-3">Devices by Role</h2>
              <div className="grid grid-cols-3 gap-2">
                {deviceRoles.map((role) => {
                  const IconComponent = role.icon;
                  const isActive = activeRoleFilter === role.id;
                  return (
                    <Tooltip key={role.id}>
                      <TooltipTrigger asChild>
                        <div 
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all h-[60px]",
                            role.count === 0 
                              ? "bg-muted/10 border-border/30 opacity-50 cursor-not-allowed" 
                              : isActive
                                ? "bg-primary/10 border-primary ring-1 ring-primary"
                                : "bg-secondary/30 border-border hover:bg-secondary/50 hover:border-primary/50"
                          )}
                          onClick={() => handleRoleClick(role.id, role.count)}
                        >
                          <IconComponent className={cn(
                            "h-5 w-5 flex-shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )} />
                          <div className="min-w-0 flex-1">
                            <p className={cn(
                              "text-sm font-medium truncate leading-tight",
                              isActive && "text-primary"
                            )}>{role.label}</p>
                            <p className={cn(
                              "text-xs font-mono leading-tight",
                              role.count > 0 ? (isActive ? "text-primary" : "text-primary") : "text-muted-foreground"
                            )}>
                              {role.count} Device{role.count !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {role.count > 0 
                            ? `Click to filter ${role.count} ${role.label} device${role.count !== 1 ? 's' : ''}`
                            : `No ${role.label} devices`
                          }
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            {/* Devices by Protocol - Takes 5 columns */}
            <div className="col-span-5">
              <h2 className="text-sm font-medium text-foreground mb-3">Devices by Protocol</h2>
              <div className="bg-secondary/20 rounded-lg border border-border/50 overflow-hidden">
                <ScrollArea className="h-[460px]">
                  <div className="divide-y divide-border/30">
                    {protocolStats.map((protocol, index) => {
                      const isActive = activeProtocolFilter === protocol.name;
                      return (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <div 
                              className={cn(
                                "flex items-center justify-between px-4 py-3 cursor-pointer transition-all",
                                isActive
                                  ? "bg-primary/10 border-l-2 border-l-primary"
                                  : "hover:bg-secondary/30 border-l-2 border-l-transparent"
                              )}
                              onClick={() => handleProtocolClick(protocol.name)}
                            >
                              <span className={cn(
                                "text-sm font-medium",
                                isActive ? "text-primary" : "text-foreground"
                              )}>{protocol.name}</span>
                              <div className="flex items-center gap-6">
                                <span className="text-xs font-mono text-primary w-20 text-right">{protocol.servers} server{protocol.servers !== 1 ? 's' : ''}</span>
                                <span className="text-xs font-mono text-chart-2 w-20 text-right">{protocol.clients} client{protocol.clients !== 1 ? 's' : ''}</span>
                                <Settings className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Click to filter devices using {protocol.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          {/* Traffic Overview and Risk Summary - Equal Height Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-secondary/30 border border-border/50 rounded-lg p-4 flex items-center gap-4">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <ArrowDownLeft className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Inbound Traffic</p>
                <p className="text-xl font-bold font-mono text-foreground">{formatBytes(totalBytesIn)}</p>
              </div>
            </div>

            <div className="bg-secondary/30 border border-border/50 rounded-lg p-4 flex items-center gap-4">
              <div className="p-2.5 bg-chart-2/10 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Outbound Traffic</p>
                <p className="text-xl font-bold font-mono text-foreground">{formatBytes(totalBytesOut)}</p>
              </div>
            </div>

            <div className="bg-destructive/5 border border-destructive/30 rounded-lg p-4 flex items-center gap-4">
              <div className="p-2.5 bg-destructive/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Critical Risk Assets</p>
                <p className="text-xl font-bold font-mono text-destructive">{criticalAssets}</p>
              </div>
            </div>

            <div className="bg-threat-high/5 border border-threat-high/30 rounded-lg p-4 flex items-center gap-4">
              <div className="p-2.5 bg-threat-high/20 rounded-lg">
                <Shield className="h-5 w-5 text-threat-high" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">High Risk Assets</p>
                <p className="text-xl font-bold font-mono text-threat-high">{highRiskAssets}</p>
              </div>
            </div>
          </div>

          {/* Top Risky Assets */}
          <div>
            <h2 className="text-sm font-medium text-foreground mb-3">Top Risky Assets</h2>
            <div className="grid grid-cols-5 gap-3">
              {topRiskyAssets.map((asset, index) => {
                const DeviceIcon = getDeviceIcon(asset.deviceType);
                return (
                  <Tooltip key={asset.id}>
                    <TooltipTrigger asChild>
                      <div 
                        className="flex items-center justify-between p-3 bg-secondary/30 border border-border/50 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors h-[52px]"
                        onClick={() => onSelectAsset(asset.id)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-mono text-muted-foreground">#{index + 1}</span>
                          <DeviceIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs font-medium truncate">{asset.name}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <ScoreBadge score={asset.threatScore} label="" size="sm" showLabel={false} />
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{asset.ip} - {asset.deviceType}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Assets Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-medium text-foreground">
                  {hasActiveFilter ? 'Filtered Assets' : 'All Assets'}
                </h2>
                {hasActiveFilter && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1.5 pr-1">
                      <span className="text-xs">{activeFilterLabel}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={clearFilters}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {filteredAssets.length} device{filteredAssets.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilter && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8">
                    Clear Filter
                  </Button>
                )}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search assets..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-8 w-64 text-sm bg-secondary/30 border-border/50"
                  />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border/50 overflow-hidden bg-secondary/20">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/30 border-b border-border/50">
                    <TableHead className="text-xs font-semibold text-muted-foreground">Asset Name</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">IP Address</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Type</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Role</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Owner</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground text-center">Threat Score</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground text-center">Confidence</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Last Seen</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => {
                    const DeviceIcon = getDeviceIcon(asset.deviceType);
                    return (
                      <TableRow 
                        key={asset.id} 
                        className="cursor-pointer hover:bg-secondary/40 transition-colors border-b border-border/30"
                        onClick={() => onSelectAsset(asset.id)}
                      >
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-2">
                            <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{asset.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5 font-mono text-xs text-foreground">{asset.ip}</TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground">{asset.deviceType}</TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="outline" className="text-xs">{asset.roleTag}</Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground">{asset.owner}</TableCell>
                        <TableCell className="py-2.5 text-center">
                          <ScoreBadge score={asset.threatScore} label="" size="sm" showLabel={false} />
                        </TableCell>
                        <TableCell className="py-2.5 text-center">
                          <span className="text-xs font-mono text-muted-foreground">{asset.confidenceScore}%</span>
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground">{asset.lastSeen.split(' ')[0]}</TableCell>
                        <TableCell className="py-2.5">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

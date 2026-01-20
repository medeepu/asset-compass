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
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

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

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.ip.includes(searchQuery)
  );

  // Calculate summary stats
  const criticalAssets = assets.filter(a => a.threatScore >= 80).length;
  const highRiskAssets = assets.filter(a => a.threatScore >= 60 && a.threatScore < 80).length;
  const mediumRiskAssets = assets.filter(a => a.threatScore >= 40 && a.threatScore < 60).length;
  const lowRiskAssets = assets.filter(a => a.threatScore < 40).length;

  // Top risky assets
  const topRiskyAssets = [...assets].sort((a, b) => b.threatScore - a.threatScore).slice(0, 5);

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
          <div>
            <h1 className="text-xl font-semibold text-foreground">Browse Assets</h1>
          </div>
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
        
        {/* Summary Stats Row */}
        <div className="grid grid-cols-7 gap-3">
          {headerStats.map((stat, index) => (
            <Card key={index} className="bg-secondary/30 border-border/50">
              <CardContent className="py-3 px-4">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={cn("text-lg font-bold font-mono", stat.color)}>
                  {stat.value} {stat.label.toLowerCase().includes('device') && stat.value > 0 && 
                    <span className="text-xs font-normal text-muted-foreground">
                      {stat.label.toLowerCase().includes('new') ? 'new devices' : 
                       stat.label.toLowerCase().includes('active') ? 'active devices' :
                       stat.label.toLowerCase().includes('group') ? 'device groups' : ''}
                    </span>
                  }
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Devices by Role and Protocol */}
          <div className="grid grid-cols-5 gap-6">
            {/* Devices by Role */}
            <Card className="col-span-3">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">Devices by Role</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-3 gap-3">
                  {deviceRoles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                      <Tooltip key={role.id}>
                        <TooltipTrigger asChild>
                          <div className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                            role.count > 0 
                              ? "bg-secondary/30 border-border hover:bg-secondary/50" 
                              : "bg-muted/20 border-border/50 opacity-60"
                          )}>
                            <IconComponent className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{role.label}</p>
                              <p className={cn(
                                "text-xs font-mono",
                                role.count > 0 ? "text-primary" : "text-muted-foreground"
                              )}>
                                {role.count} Device{role.count !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">View {role.count} {role.label} device{role.count !== 1 ? 's' : ''}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Devices by Protocol */}
            <Card className="col-span-2">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">Devices by Protocol</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {protocolStats.map((protocol, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-between p-2.5 bg-secondary/30 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors">
                            <span className="text-sm font-medium">{protocol.name}</span>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                <ArrowDownLeft className="h-3 w-3 text-primary" />
                                <span className="text-xs font-mono text-primary">{protocol.servers} server{protocol.servers !== 1 ? 's' : ''}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ArrowUpRight className="h-3 w-3 text-chart-2" />
                                <span className="text-xs font-mono text-chart-2">{protocol.clients} client{protocol.clients !== 1 ? 's' : ''}</span>
                              </div>
                              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Click to view {protocol.name} activity</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Traffic Overview and Risk Summary */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ArrowDownLeft className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Inbound Traffic</p>
                    <p className="text-2xl font-bold font-mono">{formatBytes(totalBytesIn)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-2/10 rounded-lg">
                    <ArrowUpRight className="h-5 w-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Outbound Traffic</p>
                    <p className="text-2xl font-bold font-mono">{formatBytes(totalBytesOut)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-destructive/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Critical Risk</p>
                    <p className="text-2xl font-bold font-mono">{criticalAssets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-threat-high/50 bg-threat-high/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-threat-high/20 rounded-lg">
                    <Shield className="h-5 w-5 text-threat-high" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">High Risk</p>
                    <p className="text-2xl font-bold font-mono">{highRiskAssets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Risky Assets */}
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-medium">Top Risky Assets</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-5 gap-3">
                {topRiskyAssets.map((asset, index) => {
                  const DeviceIcon = getDeviceIcon(asset.deviceType);
                  return (
                    <Tooltip key={asset.id}>
                      <TooltipTrigger asChild>
                        <div 
                          className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
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
            </CardContent>
          </Card>

          {/* Assets Table */}
          <Card>
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">All Assets</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search assets..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8 w-64 text-sm"
                />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-xs font-semibold">Asset Name</TableHead>
                      <TableHead className="text-xs font-semibold">IP Address</TableHead>
                      <TableHead className="text-xs font-semibold">Type</TableHead>
                      <TableHead className="text-xs font-semibold">Role</TableHead>
                      <TableHead className="text-xs font-semibold">Owner</TableHead>
                      <TableHead className="text-xs font-semibold text-center">Threat Score</TableHead>
                      <TableHead className="text-xs font-semibold text-center">Confidence</TableHead>
                      <TableHead className="text-xs font-semibold">Last Seen</TableHead>
                      <TableHead className="text-xs font-semibold w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((asset) => {
                      const DeviceIcon = getDeviceIcon(asset.deviceType);
                      return (
                        <TableRow 
                          key={asset.id} 
                          className="hover:bg-secondary/50 cursor-pointer"
                          onClick={() => onSelectAsset(asset.id)}
                        >
                          <TableCell className="font-medium text-sm">
                            <div className="flex items-center gap-2">
                              <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                              {asset.name}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{asset.ip}</TableCell>
                          <TableCell className="text-xs">{asset.deviceType}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{asset.roleTag}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{asset.owner}</TableCell>
                          <TableCell className="text-center">
                            <ScoreBadge score={asset.threatScore} label="" size="sm" showLabel={false} />
                          </TableCell>
                          <TableCell className="text-center font-mono text-xs">{asset.confidenceScore}%</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{asset.lastSeen.split(' ')[0]}</TableCell>
                          <TableCell>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

import { useState } from "react";
import { FlowData, Peer, QoSData, ApplicationData, ConversationData } from "@/types/asset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Gauge, 
  Network, 
  Activity, 
  ArrowDown, 
  ArrowUp, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Search,
  Filter,
  Download,
  ArrowRight,
  AlertTriangle,
  Layers
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface NetworkAnalyticsTabProps {
  flows: FlowData[];
  peers: Peer[];
  qosData: QoSData[];
  applications: ApplicationData[];
  conversations: ConversationData[];
}

const formatBytes = (bytes: number): string => {
  if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)} GB`;
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)} KB`;
  return `${bytes} B`;
};

const trafficData = [
  { time: '00:00', inbound: 120, outbound: 80 },
  { time: '04:00', inbound: 45, outbound: 30 },
  { time: '08:00', inbound: 280, outbound: 190 },
  { time: '12:00', inbound: 420, outbound: 380 },
  { time: '16:00', inbound: 380, outbound: 320 },
  { time: '18:00', inbound: 520, outbound: 450 },
  { time: '20:00', inbound: 340, outbound: 280 },
  { time: '23:59', inbound: 180, outbound: 120 },
];

const topTalkers = [
  { ip: '10.0.0.50', bytes: 15240000, direction: 'outbound' },
  { ip: '192.168.1.100', bytes: 8920000, direction: 'inbound' },
  { ip: '8.8.8.8', bytes: 4500000, direction: 'outbound' },
  { ip: '172.16.0.25', bytes: 3200000, direction: 'inbound' },
  { ip: '10.10.10.1', bytes: 2800000, direction: 'outbound' },
];

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--traffic-out))',
  'hsl(var(--threat-medium))',
  'hsl(var(--threat-low))',
  'hsl(var(--muted-foreground))',
];

export const NetworkAnalyticsTab = ({ flows, peers, qosData, applications, conversations }: NetworkAnalyticsTabProps) => {
  const [showAllConversations, setShowAllConversations] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllFlows, setShowAllFlows] = useState(false);

  const sourcePeers = peers.filter((_, i) => i < 5);
  const destPeers = peers.filter((_, i) => i >= 5 || peers.length <= 5);
  
  const totalInbound = flows.filter(f => f.direction === 'inbound').reduce((sum, f) => sum + f.bytes, 0);
  const totalOutbound = flows.filter(f => f.direction === 'outbound').reduce((sum, f) => sum + f.bytes, 0);
  const totalPackets = flows.reduce((sum, f) => sum + f.packets, 0);

  const filteredConversations = conversations.filter(conv =>
    conv.sourceIp.includes(searchQuery) ||
    conv.destIp.includes(searchQuery) ||
    conv.application.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedConversations = showAllConversations ? filteredConversations : filteredConversations.slice(0, 5);

  const pieData = applications.slice(0, 5).map((app, index) => ({
    name: app.name,
    value: app.bytes,
    color: COLORS[index % COLORS.length],
  }));

  const highRiskApps = applications.filter(app => app.risk === 'high');

  return (
    <div className="space-y-6">
      {/* Traffic Summary Banner */}
      <div className="grid grid-cols-5 gap-3">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <ArrowDown className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Inbound</p>
                <p className="text-lg font-bold font-mono">{formatBytes(totalInbound)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-traffic-out/10 to-traffic-out/5 border-traffic-out/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-traffic-out/20 rounded-lg">
                <ArrowUp className="h-4 w-4 text-traffic-out" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Outbound</p>
                <p className="text-lg font-bold font-mono">{formatBytes(totalOutbound)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Packets</p>
                <p className="text-lg font-bold font-mono">{totalPackets.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Flows</p>
                <p className="text-lg font-bold font-mono">{flows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={highRiskApps.length > 0 ? 'border-destructive/50 bg-destructive/5' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", highRiskApps.length > 0 ? "bg-destructive/20" : "bg-secondary")}>
                <AlertTriangle className={cn("h-4 w-4", highRiskApps.length > 0 ? "text-destructive" : "text-muted-foreground")} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">High Risk Apps</p>
                <p className="text-lg font-bold font-mono">{highRiskApps.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Chart and Application Distribution */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Traffic Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--traffic-out))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--traffic-out))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="inbound" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorIn)" name="Inbound" />
                  <Area type="monotone" dataKey="outbound" stroke="hsl(var(--traffic-out))" strokeWidth={2} fill="url(#colorOut)" name="Outbound" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Application Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => formatBytes(value)}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '10px' }}
                    formatter={(value) => <span className="text-xs">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Source/Destination and QoS */}
      <div className="grid grid-cols-3 gap-4">
        {/* Source Analysis */}
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-chart-2" />
              Source Analysis (Outbound)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ScrollArea className="h-48">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Peer</TableHead>
                    <TableHead className="text-xs">IP Address</TableHead>
                    <TableHead className="text-xs">Conn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(sourcePeers.length > 0 ? sourcePeers : peers).map((peer, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs font-medium truncate max-w-[100px]">{peer.name}</TableCell>
                      <TableCell className="text-xs font-mono">{peer.ip}</TableCell>
                      <TableCell className="text-xs">{peer.connectionCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Destination Analysis */}
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4 text-primary" />
              Destination Analysis (Inbound)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ScrollArea className="h-48">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Peer</TableHead>
                    <TableHead className="text-xs">IP Address</TableHead>
                    <TableHead className="text-xs">Conn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(destPeers.length > 0 ? destPeers : peers).map((peer, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs font-medium truncate max-w-[100px]">{peer.name}</TableCell>
                      <TableCell className="text-xs font-mono">{peer.ip}</TableCell>
                      <TableCell className="text-xs">{peer.connectionCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* QoS Metrics */}
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              QoS Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-3">
              {qosData.slice(0, 4).map((metric, i) => {
                const getStatus = (val: number, threshold: number) => val < threshold * 0.5 ? 'good' : val < threshold ? 'warning' : 'critical';
                const latencyStatus = getStatus(metric.latency, 100);
                
                return (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg cursor-help">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] px-1.5 py-0",
                              latencyStatus === 'good' ? 'border-success text-success' :
                              latencyStatus === 'warning' ? 'border-threat-medium text-threat-medium' : 
                              'border-destructive text-destructive'
                            )}
                          >
                            {latencyStatus}
                          </Badge>
                          <span className="text-xs font-medium truncate max-w-[80px]">{metric.application}</span>
                        </div>
                        <span className="text-xs font-mono">{metric.latency}ms</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Jitter: {metric.jitter}ms | Packet Loss: {metric.packetLoss}% | MOS: {metric.mos}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Talkers */}
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Top Talkers
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-5 gap-3">
            {topTalkers.map((talker, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">#{index + 1}</span>
                  <span className="font-mono text-xs">{talker.ip}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn(
                    "text-[10px]",
                    talker.direction === 'inbound' ? 'text-primary border-primary/30' : 'text-traffic-out border-traffic-out/30'
                  )}>
                    {talker.direction === 'inbound' ? '↓' : '↑'}
                  </Badge>
                  <span className="font-mono text-xs">{formatBytes(talker.bytes)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversations - Expandable */}
      <Card>
        <Collapsible open={showAllConversations} onOpenChange={setShowAllConversations}>
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Network className="h-4 w-4 text-primary" />
              Conversations
              <Badge variant="secondary" className="text-xs">{conversations.length}</Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Filter..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-7 w-36 text-xs"
                />
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  {showAllConversations ? (
                    <>Show Less <ChevronUp className="h-3 w-3" /></>
                  ) : (
                    <>Show All <ChevronDown className="h-3 w-3" /></>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">Source IP</TableHead>
                    <TableHead className="text-xs font-semibold w-8"></TableHead>
                    <TableHead className="text-xs font-semibold">Destination IP</TableHead>
                    <TableHead className="text-xs font-semibold">Application</TableHead>
                    <TableHead className="text-xs font-semibold">Duration</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Bytes In</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Bytes Out</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedConversations.map((conv) => (
                    <TableRow key={conv.id} className="hover:bg-secondary/50">
                      <TableCell className="font-mono text-xs">{conv.sourceIp}</TableCell>
                      <TableCell>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{conv.destIp}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {conv.application}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{conv.duration}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-primary">{formatBytes(conv.bytesIn)}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-traffic-out">{formatBytes(conv.bytesOut)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <CollapsibleContent>
              {/* This expands the table to show all conversations */}
            </CollapsibleContent>
          </CardContent>
        </Collapsible>
      </Card>

      {/* Flow Summary - Expandable */}
      <Card>
        <Collapsible open={showAllFlows} onOpenChange={setShowAllFlows}>
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Network className="h-4 w-4 text-primary" />
              Flow Connections
              <Badge variant="secondary" className="text-xs">{flows.length}</Badge>
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                {showAllFlows ? (
                  <>Show Less <ChevronUp className="h-3 w-3" /></>
                ) : (
                  <>Show All <ChevronDown className="h-3 w-3" /></>
                )}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Source IP</TableHead>
                  <TableHead className="text-xs">Destination IP</TableHead>
                  <TableHead className="text-xs">Protocol</TableHead>
                  <TableHead className="text-xs">Port</TableHead>
                  <TableHead className="text-xs">Bytes</TableHead>
                  <TableHead className="text-xs">Packets</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(showAllFlows ? flows : flows.slice(0, 5)).map((flow, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs font-mono">{flow.sourceIp}</TableCell>
                    <TableCell className="text-xs font-mono">{flow.destIp}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{flow.protocol}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{flow.destPort}</TableCell>
                    <TableCell className="text-xs">{flow.bytes}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{flow.packets}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Collapsible>
      </Card>
    </div>
  );
};

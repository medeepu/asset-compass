import { FlowData, Peer, QoSData } from "@/types/asset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Gauge, Network } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

interface NetworkAnalyticsTabProps {
  flows: FlowData[];
  peers: Peer[];
  qosData: QoSData[];
}

export const NetworkAnalyticsTab = ({ flows, peers, qosData }: NetworkAnalyticsTabProps) => {
  const sourcePeers = peers.filter((_, i) => i < 5);
  const destPeers = peers.filter((_, i) => i >= 5 || peers.length <= 5);

  return (
    <div className="space-y-6">
      {/* Source/Destination Combined View */}
      <div className="grid grid-cols-2 gap-4">
        {/* Source Analysis */}
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-primary" />
              Source Analysis (Outbound)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Peer</TableHead>
                    <TableHead className="text-xs">IP Address</TableHead>
                    <TableHead className="text-xs">Connections</TableHead>
                    <TableHead className="text-xs">Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(sourcePeers.length > 0 ? sourcePeers : peers).map((peer, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm font-medium">{peer.name}</TableCell>
                      <TableCell className="text-sm font-mono">{peer.ip}</TableCell>
                      <TableCell className="text-sm">{peer.connectionCount}</TableCell>
                      <TableCell>
                        <Badge variant={peer.location === 'Internal' ? 'secondary' : 'outline'} className="text-xs">
                          {peer.location}
                        </Badge>
                      </TableCell>
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
              <ArrowDownLeft className="h-4 w-4 text-chart-2" />
              Destination Analysis (Inbound)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Peer</TableHead>
                    <TableHead className="text-xs">IP Address</TableHead>
                    <TableHead className="text-xs">Connections</TableHead>
                    <TableHead className="text-xs">Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(destPeers.length > 0 ? destPeers : peers).map((peer, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm font-medium">{peer.name}</TableCell>
                      <TableCell className="text-sm font-mono">{peer.ip}</TableCell>
                      <TableCell className="text-sm">{peer.connectionCount}</TableCell>
                      <TableCell>
                        <Badge variant={peer.location === 'Internal' ? 'secondary' : 'outline'} className="text-xs">
                          {peer.location}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* QoS Metrics */}
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" />
            Quality of Service Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-4 gap-4 mb-4">
            {qosData.slice(0, 4).map((metric, i) => {
              const getStatus = (val: number, threshold: number) => val < threshold * 0.5 ? 'good' : val < threshold ? 'warning' : 'critical';
              const latencyStatus = getStatus(metric.latency, 100);
              const displayValue = `${metric.latency}ms`;
              const threshold = 100;
              
              return (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div className="p-3 bg-secondary/30 rounded-lg cursor-help">
                      <p className="text-xs text-muted-foreground">{metric.application} - Latency</p>
                      <p className="text-lg font-bold">{displayValue}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              latencyStatus === 'good' ? 'bg-success' : 
                              latencyStatus === 'warning' ? 'bg-threat-medium' : 'bg-destructive'
                            )}
                            style={{ width: `${Math.min((metric.latency / threshold) * 100, 100)}%` }}
                          />
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            latencyStatus === 'good' ? 'border-success text-success' :
                            latencyStatus === 'warning' ? 'border-threat-medium text-threat-medium' : 
                            'border-destructive text-destructive'
                          )}
                        >
                          {latencyStatus}
                        </Badge>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Jitter: {metric.jitter}ms | Packet Loss: {metric.packetLoss}% | MOS: {metric.mos}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          
          {/* QoS Trend Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={qosData.map((d) => ({ name: d.application, latency: d.latency, jitter: d.jitter }))}>
                <defs>
                  <linearGradient id="colorQos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '8px', 
                    fontSize: '12px' 
                  }}
                />
                <Area type="monotone" dataKey="latency" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorQos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Flow Summary */}
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Network className="h-4 w-4 text-primary" />
            Top Flow Connections
          </CardTitle>
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
              {flows.slice(0, 8).map((flow, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-mono">{flow.sourceIp}</TableCell>
                  <TableCell className="text-sm font-mono">{flow.destIp}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{flow.protocol}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{flow.destPort}</TableCell>
                  <TableCell className="text-sm">{flow.bytes}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{flow.packets}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
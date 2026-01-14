import { useState } from "react";
import { ProtocolActivityData } from "@/types/asset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";
import { 
  Network, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Clock, 
  Activity,
  Zap
} from "lucide-react";

interface ProtocolActivityTabProps {
  protocolActivity: ProtocolActivityData[];
}

const formatBytes = (bytes: number): string => {
  if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)} GB`;
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)} KB`;
  return `${bytes} B`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const ProtocolActivityTab = ({ protocolActivity }: ProtocolActivityTabProps) => {
  const [selectedProtocol, setSelectedProtocol] = useState<string>(protocolActivity[0]?.protocol || 'TCP');

  const selectedData = protocolActivity.find(p => p.protocol === selectedProtocol);

  // Calculate totals for summary
  const totals = protocolActivity.reduce((acc, p) => ({
    connections: acc.connections + p.totalConnections,
    inboundBytes: acc.inboundBytes + p.inboundBytes,
    outboundBytes: acc.outboundBytes + p.outboundBytes,
  }), { connections: 0, inboundBytes: 0, outboundBytes: 0 });

  return (
    <div className="flex gap-4 h-[calc(100vh-220px)]">
      {/* Protocol Navigation Sidebar */}
      <div className="w-56 flex-shrink-0">
        <Card className="h-full">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Network className="h-4 w-4 text-primary" />
              Protocols
            </CardTitle>
          </CardHeader>
          <ScrollArea className="h-[calc(100%-56px)]">
            <div className="px-2 pb-2 space-y-0.5">
              {protocolActivity.map((protocol) => (
                <Tooltip key={protocol.protocol}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setSelectedProtocol(protocol.protocol)}
                      className={cn(
                        "w-full px-3 py-2 rounded-md text-left transition-colors flex items-center justify-between group",
                        selectedProtocol === protocol.protocol
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <span className="font-medium text-sm">{protocol.protocol}</span>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs px-1.5 py-0",
                          selectedProtocol === protocol.protocol
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted-foreground/10"
                        )}
                      >
                        {formatNumber(protocol.activeConnections)}
                      </Badge>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <div className="text-xs space-y-1">
                      <p className="font-medium">{protocol.protocol} Protocol</p>
                      <p>Active: {protocol.activeConnections} connections</p>
                      <p>Total: {protocol.totalConnections} connections</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-4 overflow-auto">
        {selectedData && (
          <>
            {/* Protocol Summary Header */}
            <Card>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    {selectedData.protocol} Summary
                  </CardTitle>
                  <div className="flex gap-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-right cursor-help">
                          <p className="text-2xl font-bold text-primary">{selectedData.medianRtt} ms</p>
                          <p className="text-xs text-muted-foreground">Median RTT</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Round Trip Time - 50th percentile response time</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-right cursor-help">
                          <p className="text-2xl font-bold text-destructive">{selectedData.p95Rtt} ms</p>
                          <p className="text-xs text-muted-foreground">95th %ile RTT</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">95th percentile - slowest 5% of requests</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-3 px-4">
                <div className="grid grid-cols-4 gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-3 rounded-lg bg-muted/50 cursor-help">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Zap className="h-3.5 w-3.5" />
                          <span className="text-xs">Active</span>
                        </div>
                        <p className="text-lg font-semibold">{formatNumber(selectedData.activeConnections)}</p>
                        <p className="text-xs text-muted-foreground">of {formatNumber(selectedData.totalConnections)} total</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Currently active {selectedData.protocol} connections</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-3 rounded-lg bg-chart-1/10 cursor-help">
                        <div className="flex items-center gap-2 text-chart-1 mb-1">
                          <ArrowDownToLine className="h-3.5 w-3.5" />
                          <span className="text-xs">Inbound</span>
                        </div>
                        <p className="text-lg font-semibold">{formatBytes(selectedData.inboundBytes)}</p>
                        <p className="text-xs text-muted-foreground">{formatNumber(selectedData.inboundPackets)} packets</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Total inbound traffic for {selectedData.protocol}</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-3 rounded-lg bg-chart-2/10 cursor-help">
                        <div className="flex items-center gap-2 text-chart-2 mb-1">
                          <ArrowUpFromLine className="h-3.5 w-3.5" />
                          <span className="text-xs">Outbound</span>
                        </div>
                        <p className="text-lg font-semibold">{formatBytes(selectedData.outboundBytes)}</p>
                        <p className="text-xs text-muted-foreground">{formatNumber(selectedData.outboundPackets)} packets</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Total outbound traffic for {selectedData.protocol}</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-3 rounded-lg bg-muted/50 cursor-help">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-xs">Avg RTT</span>
                        </div>
                        <p className="text-lg font-semibold">{selectedData.avgRtt} ms</p>
                        <p className="text-xs text-muted-foreground">average latency</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Average round-trip time for {selectedData.protocol}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>

            {/* Traffic Graph - Combined In/Out */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  {selectedData.protocol} Traffic (In/Out Combined)
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0 px-4 pb-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedData.timeSeries}>
                      <defs>
                        <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        label={{ 
                          value: 'Connections', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' }
                        }}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px' }}
                        iconType="circle"
                      />
                      <Area
                        type="monotone"
                        dataKey="inbound"
                        name="Inbound"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorInbound)"
                      />
                      <Area
                        type="monotone"
                        dataKey="outbound"
                        name="Outbound"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorOutbound)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* All Protocols Overview */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">All Protocols Overview</CardTitle>
              </CardHeader>
              <CardContent className="py-0 px-4 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {protocolActivity.map((protocol) => (
                    <Tooltip key={protocol.protocol}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedProtocol(protocol.protocol)}
                          className={cn(
                            "p-3 rounded-lg border transition-all text-left hover:shadow-sm",
                            selectedProtocol === protocol.protocol
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{protocol.protocol}</span>
                            <Badge 
                              variant={protocol.activeConnections > 100 ? "default" : "secondary"}
                              className="text-xs px-1.5 py-0"
                            >
                              {formatNumber(protocol.activeConnections)}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-chart-1">↓ {formatBytes(protocol.inboundBytes)}</span>
                              <span className="text-chart-2">↑ {formatBytes(protocol.outboundBytes)}</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden flex">
                              <div 
                                className="h-full bg-chart-1" 
                                style={{ 
                                  width: `${(protocol.inboundBytes / (protocol.inboundBytes + protocol.outboundBytes)) * 100}%` 
                                }}
                              />
                              <div 
                                className="h-full bg-chart-2" 
                                style={{ 
                                  width: `${(protocol.outboundBytes / (protocol.inboundBytes + protocol.outboundBytes)) * 100}%` 
                                }}
                              />
                            </div>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1">
                          <p className="font-medium">{protocol.protocol} Statistics</p>
                          <p>Active: {protocol.activeConnections} / Total: {protocol.totalConnections}</p>
                          <p>In: {formatBytes(protocol.inboundBytes)} ({formatNumber(protocol.inboundPackets)} pkts)</p>
                          <p>Out: {formatBytes(protocol.outboundBytes)} ({formatNumber(protocol.outboundPackets)} pkts)</p>
                          <p>RTT: {protocol.medianRtt}ms median / {protocol.p95Rtt}ms p95</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
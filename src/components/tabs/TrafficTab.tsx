import { useState } from "react";
import { FlowData } from "@/types/asset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Activity, Clock, ArrowDownUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface TrafficTabProps {
  flows: FlowData[];
}

const egressTrafficData = [
  { time: '00:00', value: 80 },
  { time: '04:00', value: 30 },
  { time: '08:00', value: 190 },
  { time: '12:00', value: 380 },
  { time: '16:00', value: 320 },
  { time: '18:00', value: 450 },
  { time: '20:00', value: 280 },
  { time: '23:59', value: 120 },
];

const ingressTrafficData = [
  { time: '00:00', value: 120 },
  { time: '04:00', value: 45 },
  { time: '08:00', value: 280 },
  { time: '12:00', value: 420 },
  { time: '16:00', value: 380 },
  { time: '18:00', value: 520 },
  { time: '20:00', value: 340 },
  { time: '23:59', value: 180 },
];

const egressTopTalkers = [
  { ip: '10.0.0.50', bytes: 15240000, port: 443, protocol: 'HTTPS' },
  { ip: '8.8.8.8', bytes: 4500000, port: 53, protocol: 'DNS' },
  { ip: '10.10.10.1', bytes: 2800000, port: 445, protocol: 'SMB' },
  { ip: '172.217.14.99', bytes: 1800000, port: 443, protocol: 'HTTPS' },
  { ip: '52.96.164.18', bytes: 1200000, port: 443, protocol: 'HTTPS' },
];

const ingressTopTalkers = [
  { ip: '192.168.1.100', bytes: 8920000, port: 80, protocol: 'HTTP' },
  { ip: '172.16.0.25', bytes: 3200000, port: 22, protocol: 'SSH' },
  { ip: '10.0.0.15', bytes: 2100000, port: 443, protocol: 'HTTPS' },
  { ip: '192.168.2.50', bytes: 1500000, port: 3389, protocol: 'RDP' },
  { ip: '10.5.5.5', bytes: 900000, port: 445, protocol: 'SMB' },
];

const formatBytes = (bytes: number): string => {
  if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)} GB`;
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)} KB`;
  return `${bytes} B`;
};

export const TrafficTab = ({ flows }: TrafficTabProps) => {
  const [direction, setDirection] = useState<'egress' | 'ingress'>('egress');

  const isEgress = direction === 'egress';
  const trafficData = isEgress ? egressTrafficData : ingressTrafficData;
  const topTalkers = isEgress ? egressTopTalkers : ingressTopTalkers;
  
  const relevantFlows = flows.filter(f => 
    isEgress ? f.direction === 'outbound' : f.direction === 'inbound'
  );
  const totalBytes = relevantFlows.reduce((sum, f) => sum + f.bytes, 0);
  const totalPackets = relevantFlows.reduce((sum, f) => sum + f.packets, 0);

  return (
    <div className="space-y-6">
      {/* Direction Toggle Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowDownUp className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Traffic Analysis</h2>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
          <Button
            variant={direction === 'egress' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDirection('egress')}
            className={cn(
              "gap-2 h-8",
              direction === 'egress' ? "bg-traffic-out text-white hover:bg-traffic-out/90" : ""
            )}
          >
            <ArrowUp className="h-4 w-4" />
            Egress / Outbound
          </Button>
          <Button
            variant={direction === 'ingress' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDirection('ingress')}
            className={cn(
              "gap-2 h-8",
              direction === 'ingress' ? "bg-primary text-white hover:bg-primary/90" : ""
            )}
          >
            <ArrowDown className="h-4 w-4" />
            Ingress / Inbound
          </Button>
        </div>
      </div>

      {/* Traffic Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className={cn(
          "bg-gradient-to-br",
          isEgress 
            ? "from-traffic-out/10 to-traffic-out/5 border-traffic-out/20" 
            : "from-primary/10 to-primary/5 border-primary/20"
        )}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isEgress ? "bg-traffic-out/20" : "bg-primary/20"
              )}>
                {isEgress ? (
                  <ArrowUp className="h-5 w-5 text-traffic-out" />
                ) : (
                  <ArrowDown className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{isEgress ? 'Outbound' : 'Inbound'} Traffic</p>
                <p className="text-2xl font-bold font-mono">{formatBytes(totalBytes)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Packets</p>
                <p className="text-2xl font-bold font-mono">{totalPackets.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Flows</p>
                <p className="text-2xl font-bold font-mono">{relevantFlows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unique Destinations</p>
                <p className="text-2xl font-bold font-mono">{topTalkers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            {isEgress ? (
              <ArrowUp className="h-4 w-4 text-traffic-out" />
            ) : (
              <ArrowDown className="h-4 w-4 text-primary" />
            )}
            {isEgress ? 'Outbound' : 'Inbound'} Traffic Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isEgress ? "hsl(var(--traffic-out))" : "hsl(var(--primary))"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isEgress ? "hsl(var(--traffic-out))" : "hsl(var(--primary))"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value} MB`, isEgress ? 'Outbound' : 'Inbound']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isEgress ? "hsl(var(--traffic-out))" : "hsl(var(--primary))"} 
                  strokeWidth={2}
                  fill="url(#colorTraffic)" 
                  name={isEgress ? 'Outbound' : 'Inbound'} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Talkers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Top {isEgress ? 'Destinations' : 'Sources'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topTalkers.map((talker, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-muted-foreground w-6">{index + 1}</span>
                  <span className="font-mono text-sm">{talker.ip}</span>
                  <Badge variant="outline" className="text-xs">
                    {talker.protocol}
                  </Badge>
                  <span className="text-xs text-muted-foreground">:{talker.port}</span>
                </div>
                <span className="font-mono text-sm font-medium">{formatBytes(talker.bytes)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
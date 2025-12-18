import { FlowData } from "@/types/asset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Activity, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface TrafficTabProps {
  flows: FlowData[];
}

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

const formatBytes = (bytes: number): string => {
  if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)} GB`;
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)} KB`;
  return `${bytes} B`;
};

export const TrafficTab = ({ flows }: TrafficTabProps) => {
  const totalInbound = flows.filter(f => f.direction === 'inbound').reduce((sum, f) => sum + f.bytes, 0);
  const totalOutbound = flows.filter(f => f.direction === 'outbound').reduce((sum, f) => sum + f.bytes, 0);
  const totalPackets = flows.reduce((sum, f) => sum + f.packets, 0);

  return (
    <div className="space-y-6">
      {/* Traffic Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ArrowDown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inbound Traffic</p>
                <p className="text-2xl font-bold font-mono">{formatBytes(totalInbound)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-traffic-out/10 rounded-lg">
                <ArrowUp className="h-5 w-5 text-traffic-out" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outbound Traffic</p>
                <p className="text-2xl font-bold font-mono">{formatBytes(totalOutbound)}</p>
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
                <p className="text-2xl font-bold font-mono">{flows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Traffic Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="inbound" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" name="Inbound" />
                <Area type="monotone" dataKey="outbound" stroke="hsl(var(--traffic-out))" fill="hsl(var(--traffic-out) / 0.2)" name="Outbound" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Talkers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Top Talkers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topTalkers.map((talker, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-muted-foreground w-6">{index + 1}</span>
                  <span className="font-mono text-sm">{talker.ip}</span>
                  <Badge variant="outline" className={talker.direction === 'inbound' ? 'text-primary border-primary/30' : 'text-traffic-out border-traffic-out/30'}>
                    {talker.direction === 'inbound' ? '↓ IN' : '↑ OUT'}
                  </Badge>
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

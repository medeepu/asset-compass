import { useState } from "react";
import { ApplicationData } from "@/types/asset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, ArrowUp, ArrowDown, ArrowDownUp, Layers } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface ApplicationTabProps {
  applications: ApplicationData[];
}

const formatBytes = (bytes: number): string => {
  if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)} GB`;
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)} KB`;
  return `${bytes} B`;
};

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--traffic-out))',
  'hsl(var(--threat-medium))',
  'hsl(var(--threat-low))',
  'hsl(var(--muted-foreground))',
];

// Mock data for egress vs ingress applications
const egressApplications: ApplicationData[] = [
  { id: 'e1', name: 'Microsoft 365', category: 'Productivity', bytes: 4500000000, packets: 3200000, sessions: 156, risk: 'low' },
  { id: 'e2', name: 'Google Workspace', category: 'Productivity', bytes: 2800000000, packets: 1800000, sessions: 89, risk: 'low' },
  { id: 'e3', name: 'Slack', category: 'Collaboration', bytes: 1200000000, packets: 890000, sessions: 234, risk: 'low' },
  { id: 'e4', name: 'Dropbox', category: 'Cloud Storage', bytes: 980000000, packets: 450000, sessions: 45, risk: 'medium' },
  { id: 'e5', name: 'Unknown HTTPS', category: 'Unknown', bytes: 450000000, packets: 280000, sessions: 12, risk: 'high' },
  { id: 'e6', name: 'Zoom', category: 'Collaboration', bytes: 380000000, packets: 520000, sessions: 34, risk: 'low' },
];

const ingressApplications: ApplicationData[] = [
  { id: 'i1', name: 'SSH', category: 'Remote Access', bytes: 2100000000, packets: 1500000, sessions: 45, risk: 'medium' },
  { id: 'i2', name: 'RDP', category: 'Remote Access', bytes: 1800000000, packets: 980000, sessions: 23, risk: 'high' },
  { id: 'i3', name: 'HTTPS (Internal)', category: 'Web', bytes: 1200000000, packets: 780000, sessions: 178, risk: 'low' },
  { id: 'i4', name: 'SMB', category: 'File Sharing', bytes: 890000000, packets: 450000, sessions: 67, risk: 'medium' },
  { id: 'i5', name: 'ICMP', category: 'Network', bytes: 120000000, packets: 890000, sessions: 89, risk: 'low' },
];

export const ApplicationTab = ({ applications }: ApplicationTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [direction, setDirection] = useState<'egress' | 'ingress'>('egress');

  const isEgress = direction === 'egress';
  const currentApplications = isEgress ? egressApplications : ingressApplications;

  const filteredApps = currentApplications.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pieData = currentApplications.slice(0, 5).map((app, index) => ({
    name: app.name,
    value: app.bytes,
    color: COLORS[index % COLORS.length],
  }));

  const categoryStats = currentApplications.reduce((acc, app) => {
    acc[app.category] = (acc[app.category] || 0) + app.bytes;
    return acc;
  }, {} as Record<string, number>);

  const highRiskApps = currentApplications.filter(app => app.risk === 'high');
  const totalBytes = currentApplications.reduce((sum, app) => sum + app.bytes, 0);

  return (
    <div className="space-y-6">
      {/* Direction Toggle Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Application Analysis</h2>
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

      {/* Summary Cards */}
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
                <p className="text-sm text-muted-foreground">{isEgress ? 'Egress' : 'Ingress'} Volume</p>
                <p className="text-2xl font-bold font-mono">{formatBytes(totalBytes)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Applications</p>
            <p className="text-2xl font-bold font-mono">{currentApplications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Categories</p>
            <p className="text-2xl font-bold font-mono">{Object.keys(categoryStats).length}</p>
          </CardContent>
        </Card>
        <Card className={highRiskApps.length > 0 ? 'border-destructive/50 bg-destructive/5' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              {highRiskApps.length > 0 && <AlertTriangle className="h-4 w-4 text-destructive" />}
              <p className="text-sm text-muted-foreground">High Risk</p>
            </div>
            <p className="text-2xl font-bold font-mono">{highRiskApps.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Application Distribution Chart */}
        <div className="col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                {isEgress ? (
                  <ArrowUp className="h-4 w-4 text-traffic-out" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-primary" />
                )}
                {isEgress ? 'Outbound' : 'Inbound'} Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatBytes(value)}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Table */}
        <div className="col-span-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">
                {isEgress ? 'Outbound' : 'Inbound'} Application Details
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Filter applications..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8 w-48 text-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-xs font-semibold">Application</TableHead>
                      <TableHead className="text-xs font-semibold">Category</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Bytes</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Packets</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Sessions</TableHead>
                      <TableHead className="text-xs font-semibold">Risk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApps.map((app) => (
                      <TableRow key={app.id} className="hover:bg-secondary/50">
                        <TableCell className="font-medium text-sm">{app.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{app.category}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{formatBytes(app.bytes)}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{app.packets.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{app.sessions}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'text-xs',
                              app.risk === 'high' && 'bg-destructive/10 text-destructive border-destructive/30',
                              app.risk === 'medium' && 'bg-threat-medium/10 text-threat-medium border-threat-medium/30',
                              app.risk === 'low' && 'bg-threat-low/10 text-threat-low border-threat-low/30',
                            )}
                          >
                            {app.risk.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
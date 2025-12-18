import { ApplicationData } from "@/types/asset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useState } from "react";
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

export const ApplicationTab = ({ applications }: ApplicationTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = applications.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pieData = applications.slice(0, 5).map((app, index) => ({
    name: app.name,
    value: app.bytes,
    color: COLORS[index % COLORS.length],
  }));

  const categoryStats = applications.reduce((acc, app) => {
    acc[app.category] = (acc[app.category] || 0) + app.bytes;
    return acc;
  }, {} as Record<string, number>);

  const highRiskApps = applications.filter(app => app.risk === 'high');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Applications</p>
            <p className="text-2xl font-bold font-mono">{applications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Categories</p>
            <p className="text-2xl font-bold font-mono">{Object.keys(categoryStats).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Sessions</p>
            <p className="text-2xl font-bold font-mono">{applications.reduce((sum, a) => sum + a.sessions, 0)}</p>
          </CardContent>
        </Card>
        <Card className={highRiskApps.length > 0 ? 'border-destructive/50' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              {highRiskApps.length > 0 && <AlertTriangle className="h-4 w-4 text-destructive" />}
              <p className="text-sm text-muted-foreground">High Risk Apps</p>
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
              <CardTitle className="text-base font-semibold">Application Distribution</CardTitle>
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
              <CardTitle className="text-base font-semibold">Application Details</CardTitle>
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

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
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface AssetsOverviewPanelProps {
  assets: Asset[];
  onSelectAsset: (assetId: string) => void;
}

const COLORS = [
  'hsl(var(--destructive))',
  'hsl(var(--threat-high))',
  'hsl(var(--threat-medium))',
  'hsl(var(--threat-low))',
  'hsl(var(--muted-foreground))',
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
  const avgThreatScore = Math.round(assets.reduce((sum, a) => sum + a.threatScore, 0) / assets.length);

  // Device type distribution
  const deviceTypes = assets.reduce((acc, asset) => {
    acc[asset.deviceType] = (acc[asset.deviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceTypePieData = Object.entries(deviceTypes).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length],
  }));

  // Risk distribution for bar chart
  const riskDistribution = [
    { name: 'Critical', count: criticalAssets, color: 'hsl(var(--destructive))' },
    { name: 'High', count: highRiskAssets, color: 'hsl(var(--threat-high))' },
    { name: 'Medium', count: mediumRiskAssets, color: 'hsl(var(--threat-medium))' },
    { name: 'Low', count: lowRiskAssets, color: 'hsl(var(--threat-low))' },
  ];

  // Top risky assets
  const topRiskyAssets = [...assets].sort((a, b) => b.threatScore - a.threatScore).slice(0, 5);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Assets Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor and manage all network assets in your environment
            </p>
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
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Assets</p>
                    <p className="text-2xl font-bold font-mono">{assets.length}</p>
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

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-lg">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Score</p>
                    <p className="text-2xl font-bold font-mono">{avgThreatScore}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Low Risk</p>
                    <p className="text-2xl font-bold font-mono">{lowRiskAssets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Risk Distribution */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={60} />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Device Types */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">Device Types</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceTypePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {deviceTypePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {deviceTypePieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-xs text-muted-foreground">{entry.name} ({entry.value})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Risky Assets */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">Top Risky Assets</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-2">
                  {topRiskyAssets.map((asset, index) => {
                    const DeviceIcon = getDeviceIcon(asset.deviceType);
                    return (
                      <Tooltip key={asset.id}>
                        <TooltipTrigger asChild>
                          <div 
                            className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                            onClick={() => onSelectAsset(asset.id)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground w-4">#{index + 1}</span>
                              <DeviceIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs font-medium truncate max-w-[100px]">{asset.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
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
          </div>

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
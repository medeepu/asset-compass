import { Asset } from "@/types/asset";
import { ScoreBadge } from "./ScoreBadge";
import { Button } from "@/components/ui/button";
import { Server, Monitor, Shield, Wifi, ChevronDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AssetHeaderProps {
  asset: Asset;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'traffic', label: 'Traffic' },
  { id: 'application', label: 'Application' },
  { id: 'source', label: 'Source' },
  { id: 'destination', label: 'Destination' },
  { id: 'qos', label: 'QoS' },
  { id: 'conversation', label: 'Conversation' },
  { id: 'events', label: 'Events', count: 347 },
  { id: 'timeline', label: 'Timeline' },
];

const getDeviceIcon = (deviceType: string) => {
  switch (deviceType.toLowerCase()) {
    case 'server':
      return Server;
    case 'network switch':
    case 'gateway':
    case 'load balancer':
      return Wifi;
    case 'firewall':
      return Shield;
    default:
      return Monitor;
  }
};

export const AssetHeader = ({ asset, activeTab, onTabChange }: AssetHeaderProps) => {
  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-start justify-between">
        {/* Left: Asset Identity */}
        <div className="flex items-center gap-4">
          <ScoreBadge score={asset.threatScore} label="" size="lg" showLabel={false} />
          
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-foreground">{asset.name}</h1>
              <span className="text-muted-foreground font-mono text-sm">{asset.ip}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{asset.category}</span>
              <span className="opacity-40">|</span>
              <span>NetFlow</span>
              <span className="opacity-40">|</span>
              <span>{asset.deviceType}</span>
            </div>
          </div>
        </div>

        {/* Right: Metadata and Actions */}
        <div className="flex items-center gap-6">
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">First seen</span>
              <p className="font-mono text-foreground">{asset.firstSeen}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Seen</span>
              <p className="font-mono text-foreground">{asset.lastSeen}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <MoreHorizontal className="h-4 w-4" />
                Actions
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Add Comment</DropdownMenuItem>
              <DropdownMenuItem>Assign Owner</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuItem>Drill to Incident</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 mt-4 -mb-4 border-b border-transparent">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[1px]',
              activeTab === tab.id
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground hover:border-muted'
            )}
          >
            {tab.label}
            {tab.count && <span className="ml-1 text-xs">({tab.count})</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

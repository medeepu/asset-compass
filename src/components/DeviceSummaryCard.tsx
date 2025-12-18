import { Asset } from "@/types/asset";
import { DataTag } from "./DataTag";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

interface DeviceSummaryCardProps {
  asset: Asset;
}

export const DeviceSummaryCard = ({ asset }: DeviceSummaryCardProps) => {
  return (
    <div className="panel-card">
      <h3 className="section-title">Device Summary</h3>
      
      <div className="space-y-4">
        {/* Host IP */}
        <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
          <span className="text-sm text-muted-foreground">Host IP</span>
          <div className="flex flex-wrap gap-1.5">
            {asset.ipHistory.slice(0, 4).map((ip, index) => (
              <DataTag key={index} value={ip.value} isCurrent={ip.isCurrent} showInfo />
            ))}
            {asset.ipHistory.length > 4 && (
              <button className="link-text flex items-center gap-1">
                View all <ChevronDown className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Hostname */}
        <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
          <span className="text-sm text-muted-foreground">Hostname:</span>
          <span className="text-sm font-medium">{asset.hostname}</span>
        </div>

        {/* Category */}
        <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
          <span className="text-sm text-muted-foreground">Category</span>
          <span className="text-sm">{asset.category}</span>
        </div>

        {/* Category Type */}
        <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
          <span className="text-sm text-muted-foreground">Category</span>
          <span className="text-sm">{asset.deviceType}</span>
        </div>

        {/* Location */}
        <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
          <span className="text-sm text-muted-foreground">Location:</span>
          <span className="text-sm">{asset.location}</span>
        </div>

        {/* First Seen */}
        <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
          <span className="text-sm text-muted-foreground">First Seen:</span>
          <span className="text-sm font-mono">{asset.firstSeen.split(' ')[0]} {asset.firstSeen.split(' ')[1]} IST</span>
        </div>

        {/* Last Seen */}
        <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
          <span className="text-sm text-muted-foreground">Last Seen:</span>
          <span className="text-sm font-mono">{asset.lastSeen.split(' ')[0]} {asset.lastSeen.split(' ')[1]} IST</span>
        </div>

        {/* Network */}
        <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
          <span className="text-sm text-muted-foreground">Network:</span>
          <span className="text-sm">{asset.network}</span>
        </div>

        {/* Management Detected */}
        <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
          <span className="text-sm text-muted-foreground">Management Detected:</span>
          <div className="flex flex-wrap gap-1.5">
            {asset.managementTools.map((tool, index) => (
              <DataTag key={index} value={tool} showInfo />
            ))}
          </div>
        </div>

        {/* MAC Address */}
        <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
          <span className="text-sm text-muted-foreground">MAC Address:</span>
          <div className="flex flex-col gap-1.5">
            {asset.macHistory.slice(0, 4).map((mac, index) => (
              <DataTag key={index} value={mac.value} isCurrent={mac.isCurrent} showInfo />
            ))}
            {asset.macHistory.length > 4 && (
              <button className="link-text flex items-center gap-1 mt-1">
                View all <ChevronDown className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Interface Type */}
        <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
          <span className="text-sm text-muted-foreground">Interface Type</span>
          <span className="text-sm">{asset.interfaceType}</span>
        </div>
      </div>
    </div>
  );
};

import { Asset } from "@/types/asset";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Info, Network, Server, MapPin, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface DeviceSummaryCardProps {
  asset: Asset;
}

const InfoRow = ({ label, value, tooltip }: { label: string; value: React.ReactNode; tooltip?: string }) => (
  <div className="flex items-start justify-between py-1.5 border-b border-border/50 last:border-0">
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
    <div className="text-xs font-medium text-foreground text-right max-w-[180px] truncate">{value}</div>
  </div>
);

export const DeviceSummaryCard = ({ asset }: DeviceSummaryCardProps) => {
  const [showAllIPs, setShowAllIPs] = useState(false);
  const [showAllMACs, setShowAllMACs] = useState(false);

  const currentIP = asset.ipHistory.find(ip => ip.isCurrent);
  const historicalIPs = asset.ipHistory.filter(ip => !ip.isCurrent);
  const currentMAC = asset.macHistory.find(mac => mac.isCurrent);
  const historicalMACs = asset.macHistory.filter(mac => !mac.isCurrent);

  return (
    <div className="panel-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-primary" />
          <h3 className="section-title mb-0">Asset Identity</h3>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground">
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p className="text-xs">Device identity from flow data, DHCP, ARP, and NMS/IPAM integration</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-4">
        {/* Identity Section */}
        <div className="space-y-0">
          <InfoRow label="Hostname" value={asset.hostname} tooltip="Current hostname from DNS/DHCP" />
          
          {/* Current IP with expandable history */}
          <div className="py-1.5 border-b border-border/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">IP Address</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Current and historical IP addresses from DHCP/ARP</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium">{currentIP?.value}</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-success/10 text-success border-success/30">Current</Badge>
              </div>
            </div>
            {historicalIPs.length > 0 && (
              <Collapsible open={showAllIPs} onOpenChange={setShowAllIPs}>
                <CollapsibleTrigger className="flex items-center gap-1 text-xs text-primary hover:underline mt-1.5 ml-auto">
                  {showAllIPs ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {historicalIPs.length} previous IP{historicalIPs.length > 1 ? 's' : ''}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-1.5 pl-2 border-l-2 border-muted ml-1">
                  {historicalIPs.map((ip, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-mono text-muted-foreground">{ip.value}</span>
                      <span className="text-muted-foreground/60">{ip.timestamp}</span>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>

          {/* Current MAC with expandable history */}
          <div className="py-1.5 border-b border-border/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">MAC Address</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium">{currentMAC?.value}</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-success/10 text-success border-success/30">Current</Badge>
              </div>
            </div>
            {historicalMACs.length > 0 && (
              <Collapsible open={showAllMACs} onOpenChange={setShowAllMACs}>
                <CollapsibleTrigger className="flex items-center gap-1 text-xs text-primary hover:underline mt-1.5 ml-auto">
                  {showAllMACs ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {historicalMACs.length} previous MAC{historicalMACs.length > 1 ? 's' : ''}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-1.5 pl-2 border-l-2 border-muted ml-1">
                  {historicalMACs.map((mac, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-mono text-muted-foreground">{mac.value}</span>
                      <span className="text-muted-foreground/60">{mac.timestamp}</span>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>

          <InfoRow label="Device Type" value={asset.deviceType} />
          <InfoRow label="Role" value={asset.roleTag} tooltip="Assigned role based on traffic patterns" />
        </div>

        {/* NMS/IPAM Section */}
        {(asset.connectedSwitch || asset.vlan || asset.subnet) && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <Network className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Network Infrastructure</span>
            </div>
            <div className="space-y-0 bg-secondary/30 rounded-lg p-2">
              {asset.connectedSwitch && (
                <InfoRow label="Switch" value={asset.connectedSwitch} tooltip="Connected switch from NMS discovery" />
              )}
              {asset.switchPort && (
                <InfoRow label="Port" value={asset.switchPort} tooltip="Switch port from SNMP polling" />
              )}
              {asset.vlan && (
                <InfoRow label="VLAN" value={asset.vlan} tooltip="VLAN assignment from switch" />
              )}
              {asset.subnet && (
                <InfoRow label="Subnet" value={asset.subnet} tooltip="IP subnet from IPAM" />
              )}
              {asset.gateway && (
                <InfoRow label="Gateway" value={asset.gateway} tooltip="Default gateway" />
              )}
            </div>
          </div>
        )}

        {/* Location & Time Section */}
        <div className="pt-3 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">Location</p>
                <p className="text-xs font-medium">{asset.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">Last Seen</p>
                <p className="text-xs font-mono">{asset.lastSeen.split(' ')[1]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Tools */}
        {asset.managementTools.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Management Detected</p>
            <div className="flex flex-wrap gap-1.5">
              {asset.managementTools.map((tool, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="text-xs cursor-help">
                      {tool}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Detected via network traffic analysis</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

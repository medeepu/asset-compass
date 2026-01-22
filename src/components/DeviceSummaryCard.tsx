import { Asset } from "@/types/asset";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info, Server, MapPin, Clock, Wifi, Cable, Link2, Edit3, Plus, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { IPHistoryModal } from "./IPHistoryModal";

interface DeviceSummaryCardProps {
  asset: Asset;
}

const InfoRow = ({ label, value, tooltip, editable }: { label: string; value: React.ReactNode; tooltip?: string; editable?: boolean }) => (
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
    <div className="flex items-center gap-1.5">
      <div className="text-xs font-medium text-foreground text-right max-w-[180px] truncate">{value}</div>
      {editable && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground/50 hover:text-primary transition-colors">
              <Edit3 className="h-3 w-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Click to edit manually</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  </div>
);

const IntegrationCTA = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-secondary/50 border border-dashed border-primary/30 rounded-lg p-3 space-y-2">
    <div className="flex items-start gap-2">
      <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
      <div className="flex-1">
        <p className="text-xs font-medium text-foreground">{title}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="h-7 text-xs flex-1">
        <Link2 className="h-3 w-3 mr-1" />
        Connect Integration
      </Button>
      <Button variant="ghost" size="sm" className="h-7 text-xs">
        <Plus className="h-3 w-3 mr-1" />
        Add Manually
      </Button>
    </div>
  </div>
);

export const DeviceSummaryCard = ({ asset }: DeviceSummaryCardProps) => {
  const [showAllMACs, setShowAllMACs] = useState(false);

  const currentIP = asset.ipHistory.find(ip => ip.isCurrent);
  const historicalIPs = asset.ipHistory.filter(ip => !ip.isCurrent);
  const currentMAC = asset.macHistory.find(mac => mac.isCurrent);
  const historicalMACs = asset.macHistory.filter(mac => !mac.isCurrent);

  // Determine if integration data is available (simulated check)
  const hasNMSIntegration = !!(asset.connectedSwitch || asset.switchPort);
  const hasWirelessIntegration = !!(asset.accessPoint || asset.ssid);
  const hasDeviceTypeData = !!(asset.deviceType && asset.deviceType !== 'Unknown');
  const hasRoleData = !!(asset.roleTag && asset.roleTag !== 'Unknown');

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
            <p className="text-xs">Device identity from packet capture and optional NMS/IPAM integration</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-4">
        {/* Section 1: Packet-Captured Data (Always Available) */}
        <div className="space-y-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-success/10 text-success border-success/30">
              From Packet Capture
            </Badge>
          </div>
          
          <InfoRow label="Hostname" value={asset.hostname} tooltip="Hostname detected from DNS queries, DHCP, or NetBIOS" />
          
          {/* Current IP with modal for history */}
          <div className="py-1.5 border-b border-border/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">IP Address</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Current IP from packet capture. Click to view history.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium">{currentIP?.value}</span>
                {historicalIPs.length > 0 && (
                  <IPHistoryModal ipHistory={asset.ipHistory}>
                    <button className="text-xs text-primary hover:underline flex items-center gap-1">
                      <span>{asset.ipHistory.length} IPs</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </IPHistoryModal>
                )}
              </div>
            </div>
          </div>

          {/* Current MAC with expandable history */}
          <div className="py-1.5 border-b border-border/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">MAC Address</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Hardware address from ARP/NDP</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium">{currentMAC?.value}</span>
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

          {/* First/Last Seen - from packet data */}
          <div className="grid grid-cols-2 gap-2 py-2">
            <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">First Seen</p>
                <p className="text-xs font-mono">{asset.firstSeen}</p>
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

        {/* Section 2: Device Classification (Requires Integration or Manual Input) */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/30">
              Device Classification
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="text-xs">Device type and role - from OpManager Plus integration or manual entry</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {hasDeviceTypeData || hasRoleData ? (
            <div className="space-y-0 bg-secondary/30 rounded-lg p-2">
              <InfoRow 
                label="Device Type" 
                value={asset.deviceType} 
                tooltip="Device classification from integration or manual entry"
                editable
              />
              <InfoRow 
                label="Role" 
                value={asset.roleTag} 
                tooltip="Assigned role - can be updated manually"
                editable
              />
              <InfoRow 
                label="Category" 
                value={asset.category} 
                tooltip="Asset category for grouping"
                editable
              />
            </div>
          ) : (
            <IntegrationCTA 
              title="Device Classification Unavailable"
              description="Connect OpManager Plus or enter device type/role manually to enrich this asset."
            />
          )}
        </div>

        {/* Section 3: Network Infrastructure (Requires NMS/IPAM Integration) */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            {asset.connectionType === 'wireless' ? (
              <Wifi className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Cable className="h-3.5 w-3.5 text-primary" />
            )}
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-warning/10 text-warning border-warning/30">
              From OpManager Plus / OpUtils
            </Badge>
          </div>

          {/* Wired Connection Details */}
          {asset.connectionType === 'wired' && hasNMSIntegration && (
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
          )}

          {/* Wireless Connection Details */}
          {asset.connectionType === 'wireless' && hasWirelessIntegration && (
            <div className="space-y-0 bg-secondary/30 rounded-lg p-2">
              {asset.ssid && (
                <InfoRow label="SSID" value={asset.ssid} tooltip="Wireless network name" />
              )}
              {asset.accessPoint && (
                <InfoRow 
                  label="Access Point" 
                  value={
                    <div className="text-right">
                      <div>{asset.accessPoint}</div>
                      {asset.accessPointMac && (
                        <div className="text-[10px] font-mono text-muted-foreground">{asset.accessPointMac}</div>
                      )}
                    </div>
                  } 
                  tooltip="Connected access point name and MAC address" 
                />
              )}
              {asset.frequency && (
                <InfoRow 
                  label="Frequency" 
                  value={`${asset.frequency} (Ch ${asset.channel})`} 
                  tooltip="Wireless frequency band and channel" 
                />
              )}
              {asset.signalStrength !== undefined && (
                <InfoRow 
                  label="Signal" 
                  value={
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <div 
                            key={bar} 
                            className={cn(
                              "w-1 rounded-sm",
                              bar === 1 ? "h-1" : bar === 2 ? "h-2" : bar === 3 ? "h-3" : bar === 4 ? "h-3.5" : "h-4",
                              asset.signalStrength! >= -50 ? (bar <= 5 ? "bg-success" : "bg-muted") :
                              asset.signalStrength! >= -60 ? (bar <= 4 ? "bg-success" : "bg-muted") :
                              asset.signalStrength! >= -70 ? (bar <= 3 ? "bg-warning" : "bg-muted") :
                              asset.signalStrength! >= -80 ? (bar <= 2 ? "bg-destructive" : "bg-muted") :
                              (bar <= 1 ? "bg-destructive" : "bg-muted")
                            )}
                          />
                        ))}
                      </div>
                      <span>{asset.signalStrength} dBm</span>
                    </div>
                  } 
                  tooltip={`Signal strength: ${asset.signalStrength} dBm${asset.snr ? `, SNR: ${asset.snr} dB` : ''}`} 
                />
              )}
              {asset.authMethod && (
                <InfoRow 
                  label="Security" 
                  value={
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-success/10 text-success border-success/30">
                      {asset.authMethod}
                    </Badge>
                  } 
                  tooltip={`Authentication: ${asset.authMethod}${asset.encryptionType ? `, Encryption: ${asset.encryptionType}` : ''}`} 
                />
              )}
              {asset.vlan && (
                <InfoRow label="VLAN" value={asset.vlan} tooltip="VLAN assignment" />
              )}
              {asset.subnet && (
                <InfoRow label="Subnet" value={asset.subnet} tooltip="IP subnet from IPAM" />
              )}
              {asset.gateway && (
                <InfoRow label="Gateway" value={asset.gateway} tooltip="Default gateway" />
              )}
            </div>
          )}

          {/* No Integration CTA */}
          {!hasNMSIntegration && asset.connectionType !== 'wireless' && (
            <IntegrationCTA 
              title="Network Infrastructure Details Unavailable"
              description="Connect OpManager Plus or OpUtils to see switch port, VLAN, and other infrastructure details."
            />
          )}
          {!hasWirelessIntegration && asset.connectionType === 'wireless' && (
            <IntegrationCTA 
              title="Wireless Details Unavailable"
              description="Connect OpManager Plus to see access point, SSID, and signal strength details."
            />
          )}
        </div>

        {/* Section 4: Location (Integration or Manual) */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground">Location</p>
              <p className="text-xs font-medium">{asset.location || 'Not specified'}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground/50 hover:text-primary transition-colors">
                  <Edit3 className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Click to edit location</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Management Tools Detected */}
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

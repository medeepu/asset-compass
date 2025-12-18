import { Asset, ThreatEvent, Peer, MitreCategory, FlowData, ProtocolBreakdown, AnomalyDetail } from "@/types/asset";
import { AssetHeader } from "./AssetHeader";
import { DeviceSummaryCard } from "./DeviceSummaryCard";
import { TrafficCard } from "./TrafficCard";
import { EventsSummaryCard } from "./EventsSummaryCard";
import { MitreAttackCard } from "./MitreAttackCard";
import { PeerMapCard } from "./PeerMapCard";
import { FlowsTable } from "./FlowsTable";
import { ThreatEventsList } from "./ThreatEventsList";
import { AnomalyDetailsCard } from "./AnomalyDetailsCard";
import { ProtocolBreakdownCard } from "./ProtocolBreakdownCard";
import { ScoreCards } from "./ScoreCards";
import { ActionButtons } from "./ActionButtons";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AssetDetailPanelProps {
  asset: Asset;
  events: ThreatEvent[];
  peers: Peer[];
  mitreCategories: MitreCategory[];
  flows: FlowData[];
  protocols: ProtocolBreakdown;
  anomalies: AnomalyDetail[];
}

export const AssetDetailPanel = ({
  asset,
  events,
  peers,
  mitreCategories,
  flows,
  protocols,
  anomalies,
}: AssetDetailPanelProps) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Asset Header */}
      <AssetHeader asset={asset} />

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Row 1: Device Summary, Traffic, Events, MITRE */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <DeviceSummaryCard asset={asset} />
            </div>
            <div className="col-span-2">
              <div className="space-y-4">
                <TrafficCard inbound={4532} outbound={5421} />
                <ScoreCards asset={asset} />
              </div>
            </div>
            <div className="col-span-2">
              <EventsSummaryCard events={events} />
            </div>
            <div className="col-span-4">
              <MitreAttackCard categories={mitreCategories} totalEvents={27} />
            </div>
          </div>

          {/* Row 2: Peer Map, Threat Events, Anomalies */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <PeerMapCard peers={peers} assetName={asset.name} />
            </div>
            <div className="col-span-4">
              <ThreatEventsList events={events} />
            </div>
            <div className="col-span-4">
              <div className="space-y-4">
                <AnomalyDetailsCard anomalies={anomalies} />
                <ProtocolBreakdownCard protocols={protocols} />
              </div>
            </div>
          </div>

          {/* Row 3: Actions */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <ActionButtons />
            </div>
          </div>

          {/* Row 4: Flows Table */}
          <FlowsTable flows={flows} />
        </div>
      </ScrollArea>
    </div>
  );
};

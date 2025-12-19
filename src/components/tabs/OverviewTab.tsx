import { Asset, ThreatEvent, Peer, MitreCategory, FlowData, ProtocolBreakdown, AnomalyDetail, ChangeHistoryItem } from "@/types/asset";
import { DeviceSummaryCard } from "../DeviceSummaryCard";
import { TrafficCard } from "../TrafficCard";
import { EventsSummaryCard } from "../EventsSummaryCard";
import { MitreAttackCard } from "../MitreAttackCard";
import { PeerMapCard } from "../PeerMapCard";
import { ThreatEventsList } from "../ThreatEventsList";
import { AnomalyDetailsCard } from "../AnomalyDetailsCard";
import { ProtocolBreakdownCard } from "../ProtocolBreakdownCard";
import { ScoreCards } from "../ScoreCards";
import { ChangeHistoryCard } from "../ChangeHistoryCard";
import { FlowsTable } from "../FlowsTable";

interface OverviewTabProps {
  asset: Asset;
  events: ThreatEvent[];
  peers: Peer[];
  mitreCategories: MitreCategory[];
  flows: FlowData[];
  protocols: ProtocolBreakdown;
  anomalies: AnomalyDetail[];
  changeHistory: ChangeHistoryItem[];
}

export const OverviewTab = ({
  asset,
  events,
  peers,
  mitreCategories,
  flows,
  protocols,
  anomalies,
  changeHistory,
}: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      {/* Row 1: Device Summary, Scores & Traffic */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-5">
          <DeviceSummaryCard asset={asset} />
        </div>
        <div className="col-span-3">
          <div className="space-y-4">
            <ScoreCards asset={asset} />
            <TrafficCard inbound={4532} outbound={5421} />
          </div>
        </div>
        <div className="col-span-4">
          <div className="space-y-4">
            <EventsSummaryCard events={events} />
            <ProtocolBreakdownCard protocols={protocols} />
          </div>
        </div>
      </div>

      {/* Row 2: Threat Events, Anomalies, Peer Map & MITRE */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <ThreatEventsList events={events.slice(0, 5)} />
        </div>
        <div className="col-span-4">
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex-1">
              <AnomalyDetailsCard anomalies={anomalies} />
            </div>
            <ChangeHistoryCard changes={changeHistory} />
          </div>
        </div>
        <div className="col-span-4">
          <MitreAttackCard categories={mitreCategories} totalEvents={27} />
        </div>
      </div>

      {/* Row 3: Peer Map */}
      <PeerMapCard peers={peers} assetName={asset.name} />

      {/* Row 4: Flows Table */}
      <FlowsTable flows={flows} />
    </div>
  );
};

import { Asset, ThreatEvent, Peer, MitreCategory, FlowData, ProtocolBreakdown, AnomalyDetail, ChangeHistoryItem, ApplicationData, ConversationData } from "@/types/asset";
import { DeviceSummaryCard } from "../DeviceSummaryCard";
import { DetectionAlertsCard } from "../DetectionAlertsCard";
import { PeerSummaryCard } from "../PeerSummaryCard";
import { ApplicationHighlightsCard } from "../ApplicationHighlightsCard";
import { MitreSummaryCard } from "../MitreSummaryCard";
import { ScoreCards } from "../ScoreCards";
import { ChangeHistoryCard } from "../ChangeHistoryCard";
import { PeerMapCard } from "../PeerMapCard";
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
  applications: ApplicationData[];
  conversations: ConversationData[];
}

export const OverviewTab = ({
  asset,
  peers,
  mitreCategories,
  flows,
  anomalies,
  changeHistory,
  applications,
  conversations,
}: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      {/* Row 1: Asset Identity, Network Behavior, Risk Scores */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <DeviceSummaryCard asset={asset} />
        </div>
        <div className="col-span-4">
          <ScoreCards asset={asset} />
        </div>
        <div className="col-span-4">
          <DetectionAlertsCard anomalies={anomalies} />
        </div>
      </div>

      {/* Row 2: Peer Context, Application Highlights, MITRE Summary */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <PeerSummaryCard peers={peers} />
        </div>
        <div className="col-span-4">
          <ApplicationHighlightsCard applications={applications} conversations={conversations} />
        </div>
        <div className="col-span-4">
          <div className="space-y-4">
            <MitreSummaryCard categories={mitreCategories} totalEvents={27} />
            <ChangeHistoryCard changes={changeHistory} />
          </div>
        </div>
      </div>

      {/* Row 3: Peer Map */}
      <PeerMapCard peers={peers} assetName={asset.name} />

      {/* Row 4: Flows Table */}
      <FlowsTable flows={flows} />
    </div>
  );
};

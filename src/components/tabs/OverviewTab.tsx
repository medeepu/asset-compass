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
import { TrafficCard } from "../TrafficCard";

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
    <div className="space-y-4">
      {/* Row 1: Asset Summary (taller) + Right Column (Risk + Detection stacked) */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <DeviceSummaryCard asset={asset} />
        </div>
        <div className="col-span-8">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Left sub-column: Risk + Traffic */}
            <div className="flex flex-col gap-4">
              <ScoreCards asset={asset} />
              <TrafficCard inbound={2450} outbound={1230} />
            </div>
            {/* Right sub-column: Detection Alerts */}
            <div className="h-full">
              <DetectionAlertsCard anomalies={anomalies} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Peer Context, Application Highlights, MITRE + Change History */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <PeerSummaryCard peers={peers} />
        </div>
        <div className="col-span-4">
          <ApplicationHighlightsCard applications={applications} conversations={conversations} />
        </div>
        <div className="col-span-4">
          <div className="flex flex-col gap-4 h-full">
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

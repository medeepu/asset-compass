import { useState } from "react";
import { Asset, ThreatEvent, Peer, MitreCategory, FlowData, ProtocolBreakdown, AnomalyDetail, ApplicationData, ConversationData, QoSData, TimelineEvent, ChangeHistoryItem, NetworkBehavior } from "@/types/asset";
import { AssetHeader } from "./AssetHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OverviewTab } from "./tabs/OverviewTab";
import { TrafficTab } from "./tabs/TrafficTab";
import { ApplicationTab } from "./tabs/ApplicationTab";
import { SourceDestTab } from "./tabs/SourceDestTab";
import { QoSTab } from "./tabs/QoSTab";
import { ConversationTab } from "./tabs/ConversationTab";
import { EventsTab } from "./tabs/EventsTab";
import { TimelineTab } from "./tabs/TimelineTab";
import { CommentsTab } from "./CommentsTab";

interface AssetDetailPanelProps {
  asset: Asset;
  events: ThreatEvent[];
  peers: Peer[];
  mitreCategories: MitreCategory[];
  flows: FlowData[];
  protocols: ProtocolBreakdown;
  anomalies: AnomalyDetail[];
  applications: ApplicationData[];
  conversations: ConversationData[];
  qosData: QoSData[];
  timelineEvents: TimelineEvent[];
  changeHistory: ChangeHistoryItem[];
  networkBehavior: NetworkBehavior;
}

export const AssetDetailPanel = ({
  asset,
  events,
  peers,
  mitreCategories,
  flows,
  protocols,
  anomalies,
  applications,
  conversations,
  qosData,
  timelineEvents,
  changeHistory,
  networkBehavior,
}: AssetDetailPanelProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            asset={asset}
            events={events}
            peers={peers}
            mitreCategories={mitreCategories}
            flows={flows}
            protocols={protocols}
            anomalies={anomalies}
            changeHistory={changeHistory}
            applications={applications}
            conversations={conversations}
            networkBehavior={networkBehavior}
          />
        );
      case 'traffic':
        return <TrafficTab flows={flows} />;
      case 'application':
        return <ApplicationTab applications={applications} />;
      case 'source':
        return <SourceDestTab flows={flows} peers={peers} type="source" />;
      case 'destination':
        return <SourceDestTab flows={flows} peers={peers} type="destination" />;
      case 'qos':
        return <QoSTab qosData={qosData} />;
      case 'conversation':
        return <ConversationTab conversations={conversations} />;
      case 'events':
        return <EventsTab events={events} mitreCategories={mitreCategories} />;
      case 'timeline':
        return <TimelineTab timelineEvents={timelineEvents} changeHistory={changeHistory} />;
      case 'comments':
        return <CommentsTab asset={asset} />;
      default:
        return (
          <OverviewTab
            asset={asset}
            events={events}
            peers={peers}
            mitreCategories={mitreCategories}
            flows={flows}
            protocols={protocols}
            anomalies={anomalies}
            changeHistory={changeHistory}
            applications={applications}
            conversations={conversations}
            networkBehavior={networkBehavior}
          />
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <AssetHeader asset={asset} activeTab={activeTab} onTabChange={setActiveTab} />
      <ScrollArea className="flex-1">
        <div className="p-6">
          {renderTabContent()}
        </div>
      </ScrollArea>
    </div>
  );
};

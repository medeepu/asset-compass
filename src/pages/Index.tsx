import { useState } from "react";
import { TopNavBar } from "@/components/TopNavBar";
import { AssetListPanel } from "@/components/AssetListPanel";
import { AssetDetailPanel } from "@/components/AssetDetailPanel";
import { AssetsOverviewPanel } from "@/components/AssetsOverviewPanel";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  mockAssets, 
  mockFlows, 
  mockThreatEvents, 
  mockPeers, 
  mockMitreCategories,
  mockProtocolBreakdown,
  mockAnomalies,
  mockApplications,
  mockConversations,
  mockQoSData,
  mockTimelineEvents,
  mockChangeHistory,
  mockNetworkBehavior,
} from "@/data/mockData";
import { mockDNSData } from "@/data/dnsData";
import { mockDHCPData } from "@/data/dhcpData";

const Index = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<'overview' | 'detail'>('overview');
  
  const selectedAsset = selectedAssetId 
    ? mockAssets.find(a => a.id === selectedAssetId) || mockAssets[0]
    : mockAssets[0];

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    setActiveMainTab('detail');
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* Top Navigation */}
        <TopNavBar />
        
        {/* Main Tabs */}
        <div className="border-b border-border bg-card px-6">
          <Tabs value={activeMainTab} onValueChange={(v) => setActiveMainTab(v as 'overview' | 'detail')}>
            <TabsList className="h-10 bg-transparent border-0 p-0">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4"
              >
                Assets
              </TabsTrigger>
              <TabsTrigger 
                value="detail" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4"
                disabled={!selectedAssetId}
              >
                Asset Detail
                {selectedAssetId && selectedAsset && (
                  <span className="ml-2 text-xs text-muted-foreground">({selectedAsset.name})</span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {activeMainTab === 'overview' ? (
            /* Full Width Assets Overview - No Left Panel */
            <AssetsOverviewPanel 
              assets={mockAssets} 
              onSelectAsset={handleSelectAsset}
            />
          ) : (
            <>
              {/* Left Panel - Asset List */}
              <div className="w-80 flex-shrink-0 border-r border-border">
                <AssetListPanel
                  assets={mockAssets}
                  selectedAssetId={selectedAssetId}
                  onSelectAsset={handleSelectAsset}
                />
              </div>

              {/* Right Panel - Asset Details */}
              <AssetDetailPanel
                asset={selectedAsset}
                events={mockThreatEvents}
                peers={mockPeers}
                mitreCategories={mockMitreCategories}
                flows={mockFlows}
                protocols={mockProtocolBreakdown}
                anomalies={mockAnomalies}
                applications={mockApplications}
                conversations={mockConversations}
                qosData={mockQoSData}
                timelineEvents={mockTimelineEvents}
                changeHistory={mockChangeHistory}
                networkBehavior={mockNetworkBehavior}
                dnsData={mockDNSData}
                dhcpData={mockDHCPData}
              />
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Index;
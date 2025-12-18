import { useState } from "react";
import { TopNavBar } from "@/components/TopNavBar";
import { AssetListPanel } from "@/components/AssetListPanel";
import { AssetDetailPanel } from "@/components/AssetDetailPanel";
import { 
  mockAssets, 
  mockFlows, 
  mockThreatEvents, 
  mockPeers, 
  mockMitreCategories,
  mockProtocolBreakdown,
  mockAnomalies 
} from "@/data/mockData";

const Index = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(mockAssets[0].id);
  
  const selectedAsset = mockAssets.find(a => a.id === selectedAssetId) || mockAssets[0];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Navigation */}
      <TopNavBar />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Asset List */}
        <div className="w-72 flex-shrink-0">
          <AssetListPanel
            assets={mockAssets}
            selectedAssetId={selectedAssetId}
            onSelectAsset={setSelectedAssetId}
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
        />
      </div>
    </div>
  );
};

export default Index;

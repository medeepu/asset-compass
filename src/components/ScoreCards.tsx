import { Asset } from "@/types/asset";
import { ScoreBadge } from "./ScoreBadge";

interface ScoreCardsProps {
  asset: Asset;
}

export const ScoreCards = ({ asset }: ScoreCardsProps) => {
  return (
    <div className="panel-card">
      <h3 className="section-title">Risk Assessment</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <ScoreBadge score={asset.threatScore} label="Threat Score" />
        <ScoreBadge score={asset.confidenceScore} label="Confidence" />
        <ScoreBadge score={asset.blastRadiusScore} label="Blast Radius" />
      </div>
    </div>
  );
};

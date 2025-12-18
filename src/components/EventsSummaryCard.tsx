import { ThreatEvent } from "@/types/asset";
import { ArrowRight } from "lucide-react";

interface EventsSummaryCardProps {
  events: ThreatEvent[];
}

export const EventsSummaryCard = ({ events }: EventsSummaryCardProps) => {
  const highCount = events.filter(e => e.severity === 'critical' || e.severity === 'high').length;
  const mediumCount = events.filter(e => e.severity === 'medium').length;
  const lowCount = events.filter(e => e.severity === 'low' || e.severity === 'info').length;
  const total = events.length;

  return (
    <div className="panel-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title mb-0">Events</h3>
        <button className="link-text flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Total */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold font-mono text-foreground">{total}</span>
          <span className="text-muted-foreground">Total</span>
        </div>

        {/* Severity Breakdown Bar */}
        <div className="h-2 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-threat-high transition-all duration-500"
            style={{ width: `${(highCount / total) * 100}%` }}
          />
          <div 
            className="h-full bg-threat-medium transition-all duration-500"
            style={{ width: `${(mediumCount / total) * 100}%` }}
          />
          <div 
            className="h-full bg-threat-low transition-all duration-500"
            style={{ width: `${(lowCount / total) * 100}%` }}
          />
        </div>

        {/* Counts */}
        <div className="flex items-center justify-between text-center">
          <div>
            <span className="text-2xl font-bold font-mono text-threat-high">{highCount}</span>
            <p className="text-xs text-muted-foreground">High</p>
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-threat-medium">{mediumCount}</span>
            <p className="text-xs text-muted-foreground">Medium</p>
          </div>
          <div>
            <span className="text-2xl font-bold font-mono text-threat-low">{lowCount}</span>
            <p className="text-xs text-muted-foreground">Low</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Progress } from "@/components/ui/progress";

interface TrafficCardProps {
  inbound: number;
  outbound: number;
}

export const TrafficCard = ({ inbound, outbound }: TrafficCardProps) => {
  const total = inbound + outbound;
  const inPercent = (inbound / total) * 100;
  
  return (
    <div className="panel-card">
      <h3 className="section-title">Traffic</h3>
      
      <div className="space-y-4">
        {/* Inbound */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 w-12">
            <div className="w-2 h-2 rounded-full bg-traffic-in" />
            <span className="text-xs text-muted-foreground">IN</span>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="stat-value">{inbound.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">MB</span>
            </div>
          </div>
        </div>

        {/* Outbound */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 w-12">
            <div className="w-2 h-2 rounded-full bg-traffic-out" />
            <span className="text-xs text-muted-foreground">OUT</span>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="stat-value">{outbound.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">MB</span>
            </div>
          </div>
        </div>

        {/* Visual Bar */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-traffic-in transition-all duration-500"
            style={{ width: `${inPercent}%` }}
          />
          <div 
            className="h-full bg-traffic-out transition-all duration-500"
            style={{ width: `${100 - inPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

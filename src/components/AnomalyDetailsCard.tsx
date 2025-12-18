import { AnomalyDetail } from "@/types/asset";
import { cn } from "@/lib/utils";
import { Activity, Zap, Network, Timer } from "lucide-react";

interface AnomalyDetailsCardProps {
  anomalies: AnomalyDetail[];
}

const getAnomalyIcon = (type: string) => {
  if (type.includes('Traffic')) return Activity;
  if (type.includes('Connection')) return Network;
  if (type.includes('Timing')) return Timer;
  return Zap;
};

export const AnomalyDetailsCard = ({ anomalies }: AnomalyDetailsCardProps) => {
  return (
    <div className="panel-card">
      <h3 className="section-title">Anomaly Details</h3>
      
      <div className="space-y-3">
        {anomalies.map((anomaly) => {
          const Icon = getAnomalyIcon(anomaly.type);
          return (
            <div 
              key={anomaly.id}
              className="p-3 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground">{anomaly.type}</h4>
                    <div className={cn(
                      'text-xs font-mono px-2 py-0.5 rounded',
                      anomaly.confidence >= 90 ? 'bg-threat-high/20 text-threat-high' :
                      anomaly.confidence >= 70 ? 'bg-threat-medium/20 text-threat-medium' :
                      'bg-threat-info/20 text-threat-info'
                    )}>
                      {anomaly.confidence}% confidence
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{anomaly.description}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{anomaly.timestamp}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

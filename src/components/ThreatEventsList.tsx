import { ThreatEvent } from "@/types/asset";
import { ThreatBadge } from "./ThreatBadge";
import { AlertTriangle, Clock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThreatEventsListProps {
  events: ThreatEvent[];
}

export const ThreatEventsList = ({ events }: ThreatEventsListProps) => {
  return (
    <div className="panel-card">
      <h3 className="section-title">Active Threat Events</h3>
      
      <div className="space-y-2">
        {events.slice(0, 5).map((event) => (
          <div 
            key={event.id}
            className={cn(
              'p-3 rounded-lg border transition-colors cursor-pointer hover:bg-secondary/50',
              event.severity === 'critical' && 'border-threat-critical/30 bg-threat-critical/5',
              event.severity === 'high' && 'border-threat-high/30 bg-threat-high/5',
              event.severity === 'medium' && 'border-threat-medium/30 bg-threat-medium/5',
              event.severity === 'low' && 'border-border',
              event.severity === 'info' && 'border-border',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-8 h-8 rounded flex items-center justify-center flex-shrink-0',
                  event.severity === 'critical' && 'bg-threat-critical/20',
                  event.severity === 'high' && 'bg-threat-high/20',
                  event.severity === 'medium' && 'bg-threat-medium/20',
                )}>
                  <AlertTriangle className={cn(
                    'h-4 w-4',
                    event.severity === 'critical' && 'text-threat-critical',
                    event.severity === 'high' && 'text-threat-high',
                    event.severity === 'medium' && 'text-threat-medium',
                  )} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{event.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{event.description}</p>
                </div>
              </div>
              <ThreatBadge severity={event.severity} className="flex-shrink-0">
                {event.severity}
              </ThreatBadge>
            </div>
            
            <div className="flex items-center gap-4 mt-2 ml-11 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {event.timestamp}
              </div>
              {event.mitreId && (
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {event.mitreId}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

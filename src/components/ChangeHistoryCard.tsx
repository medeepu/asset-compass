import { ChangeHistoryItem } from "@/types/asset";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChangeHistoryCardProps {
  changes: ChangeHistoryItem[];
}

const getChangeTypeColor = (type: string) => {
  switch (type) {
    case 'os':
      return 'bg-primary/10 text-primary border-primary/30';
    case 'app':
      return 'bg-traffic-out/10 text-traffic-out border-traffic-out/30';
    case 'behavior':
      return 'bg-threat-medium/10 text-threat-medium border-threat-medium/30';
    case 'config':
      return 'bg-muted text-muted-foreground border-muted-foreground/30';
    default:
      return 'bg-muted text-muted-foreground border-muted-foreground/30';
  }
};

export const ChangeHistoryCard = ({ changes }: ChangeHistoryCardProps) => {
  return (
    <div className="panel-card">
      <h3 className="section-title">Change History</h3>
      <div className="space-y-3">
        {changes.slice(0, 3).map((change) => (
          <div key={change.id} className="p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <Badge variant="outline" className={cn('text-xs capitalize', getChangeTypeColor(change.changeType))}>
                {change.changeType}
              </Badge>
              <span className="text-xs text-muted-foreground">{change.timestamp.split(' ')[0]}</span>
            </div>
            <p className="text-sm font-medium">{change.description}</p>
            {change.oldValue && change.newValue && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <span className="truncate max-w-[80px]">{change.oldValue.split(' ')[0]}</span>
                <ArrowRight className="h-3 w-3 flex-shrink-0" />
                <span className="truncate max-w-[80px]">{change.newValue.split(' ')[0]}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

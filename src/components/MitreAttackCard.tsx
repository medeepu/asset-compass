import { MitreCategory } from "@/types/asset";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MitreAttackCardProps {
  categories: MitreCategory[];
  totalEvents: number;
}

export const MitreAttackCard = ({ categories, totalEvents }: MitreAttackCardProps) => {
  const activeCategories = categories.filter(c => c.count > 0);
  
  return (
    <div className="panel-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title mb-0">Events by Mitre ATT&CK</h3>
      </div>
      
      <div className="space-y-4">
        {/* Total Events */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-bold font-mono text-foreground">{totalEvents}</span>
          <span className="text-muted-foreground">Total Events</span>
        </div>

        {/* Categories List */}
        <div className="space-y-1">
          {categories.map((category) => (
            <div 
              key={category.name}
              className={cn(
                'flex items-center justify-between py-1.5 px-2 rounded transition-colors',
                category.count > 0 ? 'hover:bg-secondary cursor-pointer' : 'opacity-50'
              )}
            >
              <div className="flex items-center gap-2">
                {category.count > 0 && (
                  <span className={cn(
                    'w-6 h-6 rounded text-xs font-bold flex items-center justify-center font-mono',
                    category.count >= 10 ? 'bg-threat-high/20 text-threat-high' :
                    category.count >= 5 ? 'bg-threat-medium/20 text-threat-medium' :
                    'bg-threat-info/20 text-threat-info'
                  )}>
                    {category.count}
                  </span>
                )}
                <span className={cn(
                  'text-sm',
                  category.count > 0 ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {category.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View Insights Link */}
        <button className="link-text flex items-center gap-1 mt-4">
          View insights <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

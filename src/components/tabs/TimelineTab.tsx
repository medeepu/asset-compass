import { TimelineEvent, ChangeHistoryItem } from "@/types/asset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Network, Shield, Settings, User, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TimelineTabProps {
  timelineEvents: TimelineEvent[];
  changeHistory: ChangeHistoryItem[];
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'network':
      return Network;
    case 'security':
      return Shield;
    case 'config':
      return Settings;
    case 'identity':
      return User;
    default:
      return Network;
  }
};

const getEventColor = (type: string, severity?: string) => {
  if (severity === 'error') return 'text-destructive bg-destructive/10';
  if (severity === 'warning') return 'text-threat-medium bg-threat-medium/10';
  switch (type) {
    case 'security':
      return 'text-destructive bg-destructive/10';
    case 'network':
      return 'text-primary bg-primary/10';
    case 'config':
      return 'text-muted-foreground bg-muted';
    case 'identity':
      return 'text-traffic-out bg-traffic-out/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

export const TimelineTab = ({ timelineEvents, changeHistory }: TimelineTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredEvents = timelineEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Timeline Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold font-mono">{timelineEvents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Security Events</p>
            <p className="text-2xl font-bold font-mono text-destructive">
              {timelineEvents.filter(e => e.type === 'security').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Network Events</p>
            <p className="text-2xl font-bold font-mono text-primary">
              {timelineEvents.filter(e => e.type === 'network').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Config Changes</p>
            <p className="text-2xl font-bold font-mono">
              {timelineEvents.filter(e => e.type === 'config').length + changeHistory.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Timeline */}
        <div className="col-span-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Activity Timeline</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search timeline..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-8 w-48 text-sm"
                  />
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                
                <div className="space-y-4">
                  {filteredEvents.map((event, index) => {
                    const Icon = getEventIcon(event.type);
                    const colorClasses = getEventColor(event.type, event.severity);
                    
                    return (
                      <div key={event.id} className="relative flex gap-4 pl-4">
                        {/* Timeline dot */}
                        <div className={cn("relative z-10 p-2 rounded-full", colorClasses)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        {/* Event content */}
                        <div className="flex-1 pb-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm">{event.title}</h4>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {event.type}
                                </Badge>
                                {event.severity && (
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      'text-xs',
                                      event.severity === 'error' && 'bg-destructive/10 text-destructive border-destructive/30',
                                      event.severity === 'warning' && 'bg-threat-medium/10 text-threat-medium border-threat-medium/30',
                                      event.severity === 'info' && 'bg-primary/10 text-primary border-primary/30',
                                    )}
                                  >
                                    {event.severity}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{event.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Change History Sidebar */}
        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Change History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {changeHistory.map((change) => (
                  <div key={change.id} className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {change.changeType}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{change.timestamp}</span>
                    </div>
                    <p className="text-sm font-medium">{change.description}</p>
                    {change.oldValue && change.newValue && (
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="text-muted-foreground truncate max-w-[100px]">{change.oldValue}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground truncate max-w-[100px]">{change.newValue}</span>
                      </div>
                    )}
                    {!change.oldValue && change.newValue && (
                      <p className="text-xs text-muted-foreground mt-1">Added: {change.newValue}</p>
                    )}
                    {change.oldValue && !change.newValue && (
                      <p className="text-xs text-muted-foreground mt-1">Removed: {change.oldValue}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

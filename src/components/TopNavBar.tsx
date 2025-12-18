import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronDown } from "lucide-react";

export const TopNavBar = () => {
  return (
    <header className="h-12 bg-background border-b border-border flex items-center justify-between px-4">
      {/* Left - Navigation */}
      <nav className="flex items-center gap-1">
        {['Overview', 'Investigate', 'Assets', 'Events', 'Reports', 'Settings'].map((item, index) => (
          <button
            key={item}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${
              index === 2 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Right - Time Range */}
      <div className="flex items-center gap-2">
        <Select defaultValue="10d">
          <SelectTrigger className="w-36 h-8 text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last 1 hour</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="10d">Last 10 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};

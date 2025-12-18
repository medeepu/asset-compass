import { ProtocolBreakdown } from "@/types/asset";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface ProtocolBreakdownCardProps {
  protocols: ProtocolBreakdown;
}

export const ProtocolBreakdownCard = ({ protocols }: ProtocolBreakdownCardProps) => {
  const data = [
    { name: 'TCP', value: protocols.tcp, color: 'hsl(195, 85%, 50%)' },
    { name: 'UDP', value: protocols.udp, color: 'hsl(280, 65%, 60%)' },
    { name: 'ICMP', value: protocols.icmp, color: 'hsl(142, 71%, 45%)' },
    { name: 'Other', value: protocols.other, color: 'hsl(25, 95%, 53%)' },
  ];

  return (
    <div className="panel-card">
      <h3 className="section-title">Protocol Breakdown</h3>
      
      <div className="flex items-center gap-4">
        {/* Pie Chart */}
        <div className="w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
              <span className="text-sm font-mono font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Unknown Applications */}
      {protocols.unknownApps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Unknown Applications</h4>
          <div className="flex flex-wrap gap-1.5">
            {protocols.unknownApps.map((app, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-secondary rounded text-xs font-mono text-muted-foreground"
              >
                {app}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

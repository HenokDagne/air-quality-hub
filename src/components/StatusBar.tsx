import { Card } from "@/components/ui/card";
import { Activity, Clock, MapPin } from "lucide-react";

interface StatusBarProps {
  roomName: string;
  uptime: string;
}

export function StatusBar({ roomName, uptime }: StatusBarProps) {
  return (
    <Card variant="status" className="p-4">
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{roomName}</span>
        </div>
        <div className="hidden sm:block h-4 w-px bg-border" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Uptime: {uptime}</span>
        </div>
        <div className="hidden sm:block h-4 w-px bg-border" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>Monitoring Active</span>
        </div>
      </div>
    </Card>
  );
}

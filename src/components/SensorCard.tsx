import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  status: "good" | "moderate" | "poor";
  statusText: string;
  className?: string;
}

const statusStyles = {
  good: {
    badge: "bg-success/10 text-success border-success/20",
    glow: "shadow-[0_0_30px_hsl(142_76%_36%/0.15)]",
    icon: "text-success",
  },
  moderate: {
    badge: "bg-warning/10 text-warning border-warning/20",
    glow: "shadow-[0_0_30px_hsl(38_92%_50%/0.15)]",
    icon: "text-warning",
  },
  poor: {
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    glow: "shadow-[0_0_30px_hsl(0_72%_51%/0.15)]",
    icon: "text-destructive",
  },
};

export function SensorCard({
  title,
  value,
  unit,
  icon: Icon,
  status,
  statusText,
  className,
}: SensorCardProps) {
  const styles = statusStyles[status];

  return (
    <Card variant="sensor" className={cn(styles.glow, className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className={cn("h-5 w-5", styles.icon)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight font-mono">
            {value}
          </span>
          <span className="text-lg text-muted-foreground">{unit}</span>
        </div>
        <div className="mt-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
              styles.badge
            )}
          >
            {statusText}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

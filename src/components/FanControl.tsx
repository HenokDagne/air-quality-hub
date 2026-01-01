import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Fan, Power } from "lucide-react";

interface FanControlProps {
  isOn: boolean;
  onToggle: (value: boolean) => void;
  className?: string;
}

export function FanControl({ isOn, onToggle, className }: FanControlProps) {
  return (
    <Card variant="control" className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ventilation Control
          </CardTitle>
          <Power className={cn(
            "h-4 w-4 transition-colors",
            isOn ? "text-success" : "text-muted-foreground"
          )} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "relative p-4 rounded-full transition-all duration-500",
              isOn
                ? "bg-primary/10 shadow-[0_0_30px_hsl(173_80%_40%/0.3)]"
                : "bg-secondary"
            )}>
              <Fan
                className={cn(
                  "h-10 w-10 transition-all",
                  isOn
                    ? "text-primary animate-spin-slow"
                    : "text-muted-foreground"
                )}
              />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {isOn ? "Running" : "Off"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isOn ? "Active ventilation" : "System standby"}
              </p>
            </div>
          </div>

          <Switch
            checked={isOn}
            onCheckedChange={(value) => onToggle(value)}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {isOn && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-success">Operational</span>
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

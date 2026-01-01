import { Building2, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isConnected: boolean;
  lastUpdated: Date | null;
}

export function Header({ isConnected, lastUpdated }: HeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Meeting Hall <span className="text-gradient">Air Quality</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Indoor Environment Monitoring System
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Last updated</p>
                <p className="text-sm font-mono">
                  {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            )}
            
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
              isConnected 
                ? "bg-success/10 text-success" 
                : "bg-destructive/10 text-destructive"
            )}>
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4" />
                  <span className="hidden sm:inline">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4" />
                  <span className="hidden sm:inline">Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

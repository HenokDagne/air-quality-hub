import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface UserQrSearchProps {
  baseUrl?: string;
  className?: string;
  label?: string;
}

// Renders a small search box that turns the current query into a QR code.
export function UserQrSearch({
  baseUrl = "https://air-quality-hub-theta.vercel.app",
  className,
  label = "User QR lookup",
}: UserQrSearchProps) {
  const [query, setQuery] = useState("");

  const target = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return baseUrl;

    const lower = trimmed.toLowerCase();
    if (lower.startsWith("http://") || lower.startsWith("https://")) {
      return trimmed;
    }

    const separator = baseUrl.endsWith("/") ? "" : "/";
    return `${baseUrl}${separator}${encodeURIComponent(trimmed)}`;
  }, [baseUrl, query]);

  return (
    <div className={cn("rounded-xl border bg-card p-4 shadow-sm", className)}>
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Search className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium leading-tight">{label}</p>
          <p className="text-xs text-muted-foreground">
            Type a user handle, email, or paste a URL
          </p>
        </div>
      </div>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g., jane.doe"
        className="mb-4"
        aria-label="User search query"
      />

      <div className="grid items-center gap-4 sm:grid-cols-[auto,1fr]">
        <div className="flex items-center justify-center rounded-lg bg-muted p-4">
          <QRCodeSVG value={target} size={168} />
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Target URL
          </p>
          <div className="rounded-md bg-muted px-3 py-2 text-sm break-all">
            {target}
          </div>
          <p className="text-xs text-muted-foreground">
            Scan with a phone camera to open the user page.
          </p>
        </div>
      </div>
    </div>
  );
}

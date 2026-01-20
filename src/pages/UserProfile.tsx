import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";

export default function UserProfile() {
  const { id } = useParams();

  const display = useMemo(() => {
    if (!id) return "Unknown";
    try {
      return decodeURIComponent(id);
    } catch {
      return id;
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={true} lastUpdated={null} />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-xl rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight">User Profile</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This page is opened via QR lookup.
          </p>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Identifier
            </p>
            <div className="mt-2 rounded-md bg-muted px-3 py-2 font-mono text-sm break-all">
              {display}
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            You can customize this page to fetch and display real user data.
          </p>
        </div>
      </main>
    </div>
  );
}

import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

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

  const { data, isLoading, isError } = useQuery<{
    user: { id: string; name: string; role: string; email?: string };
  }>({
    queryKey: ["user", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error(`Failed to load user: ${res.status}`);
      return res.json();
    },
  });

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

          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Details
            </p>
            {isLoading ? (
              <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            ) : isError ? (
              <div className="mt-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                Could not load user data.
              </div>
            ) : data?.user ? (
              <div className="mt-2 space-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  {data.user.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Role:</span>{" "}
                  {data.user.role}
                </div>
                {data.user.email && (
                  <div>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    {data.user.email}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">
                No user found.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

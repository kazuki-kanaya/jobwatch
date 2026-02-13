import { useEffect, useState } from "react";
import { getMe } from "@/features/me/me.api";
import type { MeResponse } from "@/features/me/me.types";

export default function HomePage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await getMe();
        if (isMounted) {
          setMe(response);
        }
      } catch (e) {
        if (isMounted) {
          const message = e instanceof Error ? e.message : "Failed to load user";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) return <div className="p-6">Loading profile...</div>;
  if (error) return <div className="p-6 text-destructive">{error}</div>;
  if (!me) return <div className="p-6">No profile data.</div>;

  return (
    <div className="p-6">
      <h1 className="font-semibold text-2xl">Home</h1>
      <p className="mt-4">Signed in as: {me.name}</p>
      <p className="text-muted-foreground text-sm">user_id: {me.user_id}</p>
    </div>
  );
}

import type { VercelRequest, VercelResponse } from "@vercel/node";

// Simple demo user store. Replace with your DB or external API.
const USERS: Record<
  string,
  { id: string; name: string; role: string; email?: string }
> = {
  guest: {
    id: "guest",
    name: "Guest User",
    role: "viewer",
    email: "guest@example.com",
  },
  admin: {
    id: "admin",
    name: "Admin",
    role: "administrator",
    email: "admin@example.com",
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const key = Array.isArray(id) ? id[0] : id;

  // Simulate fetch/latency if needed
  // await new Promise(r => setTimeout(r, 150));

  const user = key ? USERS[key.toLowerCase()] : undefined;

  if (!user) {
    return res.status(404).json({ error: "USER_NOT_FOUND", id: key ?? null });
  }

  return res.status(200).json({ user });
}

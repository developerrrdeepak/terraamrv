import { createServer } from "../server";

const app = createServer();

export default function handler(req: any, res: any) {
  // Ensure Express sees the original /api/* path
  const originalUrl = req.url || "/";
  if (!originalUrl.startsWith("/api")) {
    req.url = "/api" + (originalUrl.startsWith("/") ? originalUrl : "/" + originalUrl);
  }
  return app(req, res);
}

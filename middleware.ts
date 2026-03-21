import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Read allowed origins from environment variable, default to empty string if not set
  const allowedOriginsStr = process.env.ALLOWED_ORIGINS || "";
  const allowedOrigins = allowedOriginsStr.split(",").map(origin => origin.trim()).filter(Boolean);

  // Get the origin of the incoming request
  const requestOrigin = req.headers.get("origin") || "";

  // Check if the request's origin is in the allowed list
  // If no allowed origins are configured, we fallback to an empty string to deny CORS
  const isAllowedOrigin = allowedOrigins.includes(requestOrigin);
  const originToSet = isAllowedOrigin ? requestOrigin : "";

  // Define headers for CORS
  const responseHeaders = {
    "Access-Control-Allow-Origin": originToSet,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
  };

  // Handle OPTIONS request (Preflight Request)
  if (req.method === "OPTIONS") {
    // Return early without headers if origin is not allowed
    if (!originToSet) {
      return new NextResponse(null, { status: 403 });
    }
    return new NextResponse(null, { status: 204, headers: responseHeaders });
  }

  // Continue request normally
  const response = NextResponse.next();

  // Only set the CORS headers if the origin is allowed
  if (originToSet) {
    Object.entries(responseHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  } else {
    // Still set Vary: Origin so CDNs cache properly
    response.headers.set("Vary", "Origin");
  }

  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: "/api/:path*",
};

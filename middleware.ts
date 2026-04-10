import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Read allowed origins from environment variable, default to empty string if not set
  const allowedOriginsStr = process.env.ALLOWED_ORIGINS || "";
  const allowedOrigins = allowedOriginsStr.split(",").map(origin => origin.trim()).filter(Boolean);

  // Always allow Apollo Studio for GraphQL exploration
  if (!allowedOrigins.includes("https://studio.apollographql.com")) {
    allowedOrigins.push("https://studio.apollographql.com");
  }

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
    "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
    "Access-Control-Allow-Credentials": "true",
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

import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALE_PATTERN = `(${routing.locales.join("|")})`;

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth check for protected paths (with locale prefix)
  const protectedMatch = pathname.match(new RegExp(`^/${LOCALE_PATTERN}/dashboard`));
  if (protectedMatch) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      const locale = protectedMatch[1];
      const loginUrl = new URL(`/${locale}/login`, request.url);
      const redirectPath = pathname + (request.nextUrl.search || "");
      loginUrl.searchParams.set("redirect", redirectPath);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

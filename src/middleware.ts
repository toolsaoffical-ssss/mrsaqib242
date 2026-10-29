import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const pathname = request.nextUrl.pathname;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LAYER -1: ALWAYS ALLOW STATIC ASSETS & PUBLIC SEO FILES
  // Never block robots, sitemaps, favicons, llms, or fonts
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/llms.txt' ||
    pathname === '/version.json' ||
    pathname === '/favicon.ico' ||
    pathname === '/favicon.png' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public') ||
    pathname.match(/\.(xml|txt|json|ico|png|jpg|jpeg|svg|webp|woff|woff2|ttf|css|js)$/i)
  ) {
    return NextResponse.next();
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LAYER 0: EDGE ADMIN ROUTE PROTECTION
  // Block unauthenticated access to admin APIs at the Edge
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const isAdminApi = pathname.startsWith('/api/admin/');
  const isPublicAdminRoute = 
    pathname === '/api/admin/login' || 
    pathname === '/api/admin/login-honeypot' || 
    pathname === '/api/admin/logout' ||
    pathname === '/api/admin/mirage/generate' ||
    pathname === '/api/admin/mirage/labels';

  if (isAdminApi && !isPublicAdminRoute) {
    const adminToken = request.cookies.get('ms_admin_token')?.value;
    if (!adminToken) {
      // No token = No access. Block APIs.
      return NextResponse.json(
        { error: 'Unauthorized: No session token' },
        { status: 401 }
      );
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LAYER 1: SEARCH ENGINES, CRAWLERS, SOCIAL & AI PREVIEWS
  // Explicitly allow all legitimate search engines, SEO tools,
  // social bots, and AI agents so SEO & indexing are 100% flawless.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const searchEngineRegex = /(google|googlebot|google-inspectiontool|googleother|google-extended|googleweblight|adsbot|mediapartners|feedfetcher|apis-google|bingbot|bingpreview|msnbot|adidxbot|microsoft-inspectiontool|slurp|duckduckbot|baiduspider|yandex|sogou|exabot|applebot|facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|pinterest|slackbot|skypeuripreview|vkshare|redditbot|gptbot|chatgpt|claudebot|claude-web|perplexitybot|anthropic|cohere|lighthouse|chrome-lighthouse|screaming\s*frog|ahrefsbot|semrushbot)/i;

  if (searchEngineRegex.test(userAgent)) {
    return NextResponse.next();
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LAYER 1.5: ULTRA-FAST EDGE REDIRECTS (< 2ms) FOR SOCIAL HUBS & CHANNELS
  // Real human visitors get instantaneous 308 redirect (< 2ms) to the target app/profile.
  // Bots / preview scrapers above bypassed this to get full OpenGraph cards & JSON-LD!
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const SOCIAL_REDIRECTS: Record<string, string> = {
    '/channel': 'https://www.whatsapp.com/channel/0029VbBTSK1EquiWrUt5uV1I',
    '/whatsapp': 'https://wa.me/923478936242',
    '/wa': 'https://wa.me/923478936242',
    '/tiktok': 'https://www.tiktok.com/@mr_saqib_242',
    '/tt': 'https://www.tiktok.com/@mr_saqib_242',
    '/facebook': 'https://www.facebook.com/profile.php?id=100085188689033',
    '/fb': 'https://www.facebook.com/profile.php?id=100085188689033',
    '/snapchat': 'https://www.snapchat.com/add/mrsaqib242',
    '/snap': 'https://www.snapchat.com/add/mrsaqib242',
    '/instagram': 'https://www.instagram.com/mr_saqib242',
    '/insta': 'https://www.instagram.com/mr_saqib242',
    '/ig': 'https://www.instagram.com/mr_saqib242',
    '/telegram': 'https://t.me/mrsaqib242',
    '/tg': 'https://t.me/mrsaqib242',
    '/tele': 'https://t.me/mrsaqib242',
    '/github': 'https://github.com/mr-saqib-242',
    '/gh': 'https://github.com/mr-saqib-242',
    '/git': 'https://github.com/mr-saqib-242',
  };

  const COOKIE_MAP: Record<string, string> = {
    '/channel': 'ms_channel_url',
    '/whatsapp': 'ms_wa_url',
    '/wa': 'ms_wa_url',
    '/tiktok': 'ms_tt_url',
    '/tt': 'ms_tt_url',
    '/facebook': 'ms_fb_url',
    '/fb': 'ms_fb_url',
    '/snapchat': 'ms_sc_url',
    '/snap': 'ms_sc_url',
    '/instagram': 'ms_ig_url',
    '/insta': 'ms_ig_url',
    '/ig': 'ms_ig_url',
    '/telegram': 'ms_tg_url',
    '/tg': 'ms_tg_url',
    '/tele': 'ms_tg_url',
    '/github': 'ms_gh_url',
    '/gh': 'ms_gh_url',
    '/git': 'ms_gh_url',
  };

  const cookieKey = COOKIE_MAP[pathname];
  const dynamicFromCookie = cookieKey ? request.cookies.get(cookieKey)?.value : null;
  const redirectTarget = dynamicFromCookie ? decodeURIComponent(dynamicFromCookie) : SOCIAL_REDIRECTS[pathname];

  if (redirectTarget) {
    const redirectRes = NextResponse.redirect(redirectTarget, 307);
    redirectRes.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=60');
    return redirectRes;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LAYER 2: TERMINAL HACKING & EXPLOIT SCANNER PROTECTION
  // Block known penetration testing scanners and exploit tools
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const cliToolsRegex = /(sqlmap|nmap|nikto|dirb|gobuster|masscan|zgrab|httpx|wpscan|acunetix|nessus)/i;

  if (cliToolsRegex.test(userAgent)) {
    const skull = `
\x1b[31m\x1b[1m
        _..._
      .'     '.
     /  _   _  \\
    |  (o) (o)  |
    |   \\___/   |
     \\  |   |  /
      \\ |   | /
       \\_____/
\x1b[0m`;

    const trapMessage = `${skull}
\x1b[41m\x1b[97m\x1b[1m [!] ACCESS DENIED - SCRIPT KIDDIE DETECTED \x1b[0m

\x1b[33m> Target:\x1b[0m ${pathname}
\x1b[33m> Tool:\x1b[0m ${userAgent || 'Unknown CLI/Script'}
\x1b[33m> Trace:\x1b[0m Logged and reported

\x1b[32m\x1b[1m"Beta ji, terminal me command chalane se koi hacker nahi ban jata.
Jao ja kar apna homework karo.
Isko hack karna tumhare bas ki baat nahi!"\x1b[0m

\x1b[90mSecurity Protocol: Master Mirage Matrix
Admin: Saqib242\x1b[0m
`;

    return new NextResponse(trapMessage, {
      status: 403,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Hack-Status': 'Script Kiddie Blocked',
        'Connection': 'close'
      },
    });
  }

  // Allow browsers and clean visitors to pass through normally
  return NextResponse.next();
}

export const config = {
  // Apply to all routes except Next.js static files and images
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.png|robots.txt|sitemap.xml|llms.txt|version.json).*)'],
};


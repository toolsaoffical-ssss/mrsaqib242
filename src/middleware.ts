import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  // Regex to detect popular terminal-based hacking/scanning tools
  const cliToolsRegex = /(curl|wget|python|libwww|sqlmap|nmap|nikto|dirb|gobuster|postman|insomnia|go-http-client|java|ruby|perl|php|masscan|zgrab|httpx)/i;

  if (cliToolsRegex.test(userAgent)) {
    // Generate the terminal trap
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

\x1b[33m> Target:\x1b[0m ${request.nextUrl.pathname}
\x1b[33m> Tool:\x1b[0m ${userAgent}
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

  // Allow browsers to pass through normally
  return NextResponse.next();
}

export const config = {
  // Apply to all routes except Next.js static files and images
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

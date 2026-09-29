const fs = require('fs');
let code = fs.readFileSync('src/components/ToolsPage.tsx', 'utf8');

const marqueeLogic = `
          <div className="relative z-20 bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-orange-500/20 border-b border-orange-500/20 px-4 py-2.5 backdrop-blur-md overflow-hidden">
            <style>{\`
              @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
              .animate-marquee-slow { animation: marquee 30s linear infinite; }
              .animate-marquee-normal { animation: marquee 20s linear infinite; }
              .animate-marquee-fast { animation: marquee 10s linear infinite; }
            \`}</style>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 overflow-hidden flex-1 relative">
                <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/30 text-orange-400 z-10 relative">
                  <Flame size={12} />
                </span>
                
                <div className="flex-1 overflow-hidden relative" style={{ height: '18px' }}>
                  <p className={\`absolute whitespace-nowrap \${
                    !settings.announcement_speed || settings.announcement_speed === 'static' 
                      ? 'relative truncate' 
                      : settings.announcement_speed === 'slow'
                        ? 'animate-marquee-slow'
                        : settings.announcement_speed === 'fast'
                          ? 'animate-marquee-fast'
                          : 'animate-marquee-normal'
                  } text-xs \${settings.announcement_color || 'text-orange-200'} \${settings.announcement_font || 'font-medium'}\`}>
                    {settings.announcement_text}
                  </p>
                </div>
              </div>
`;

code = code.replace(
  /<div className="relative z-20 bg-gradient-to-r from-orange-500\/20 via-amber-500\/10 to-orange-500\/20 border-b border-orange-500\/20 px-4 py-2\.5 backdrop-blur-md">[\s\S]*?<p className="truncate font-medium text-xs text-orange-200">\s*\{settings\.announcement_text\}\s*<\/p>\s*<\/div>/,
  marqueeLogic
);

fs.writeFileSync('src/components/ToolsPage.tsx', code);

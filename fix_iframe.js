const fs = require('fs');
let code = fs.readFileSync('src/components/AllProjectsPage.tsx', 'utf8');

const iframeCode = `<iframe 
              src={project.url} 
              title={project.name}
              className="project-iframe"
              loading="lazy"
            />`;

const imgCode = `<img 
              src={\`https://image.thum.io/get/width/600/crop/800/\${project.url}\`} 
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: 'top' }}
              loading="lazy"
              onError={(e) => {
                // Fallback to microlink if thum.io fails
                if (!e.currentTarget.src.includes('microlink')) {
                  e.currentTarget.src = \`https://api.microlink.io/?url=\${encodeURIComponent(project.url)}&screenshot=true&meta=false&embed=screenshot.url\`;
                }
              }}
            />`;

code = code.replace(iframeCode, imgCode);

// Also remove `project-iframe` from CSS or just leave it. I replaced the whole iframe tag.

fs.writeFileSync('src/components/AllProjectsPage.tsx', code);

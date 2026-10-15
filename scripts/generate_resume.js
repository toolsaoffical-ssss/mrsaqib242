const fs = require('fs');
const path = require('path');

function createPdf() {
  const lines = [
    { text: 'MUHAMMAD SAQIB', size: 22, bold: true, y: 770 },
    { text: 'Full-Stack Software Engineer & Cyber Security Specialist', size: 12, bold: false, y: 750 },
    { text: 'Location: Gojra, Faisalabad, Pakistan  |  Phone: +92 347 8936242', size: 9, bold: false, y: 732 },
    { text: 'Email: saqibsaqqibsaqib@gmail.com  |  Portfolio: https://mrsaqib242.vercel.app', size: 9, bold: false, y: 718 },
    { text: 'GitHub: https://github.com/mrsaqib242  |  Socials: @mr_saqib242', size: 9, bold: false, y: 704 },
    
    { text: '---------------------------------------------------------------------------------------------------------------------------------', size: 8, bold: false, y: 690 },
    { text: 'EXECUTIVE PROFILE & SUMMARY', size: 12, bold: true, y: 672 },
    { text: 'Results-driven Full-Stack Software Engineer & Cyber Security Specialist with proven expertise in building modern,', size: 9, bold: false, y: 656 },
    { text: 'ultra-fast web applications, hardened cloud databases, and AI-powered solutions. Specialized in Next.js 15,', size: 9, bold: false, y: 644 },
    { text: 'React 19, Supabase Zero-Trust Row-Level Security, resilient REST APIs, and automated digital workflows.', size: 9, bold: false, y: 632 },

    { text: 'TECHNICAL PROFICIENCIES', size: 12, bold: true, y: 604 },
    { text: '* Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, HTML5, CSS3, Responsive Design', size: 9, bold: false, y: 588 },
    { text: '* Backend & APIs: Node.js, Express, Next.js Serverless Routes, RESTful APIs, Secure Webhooks, Microservices', size: 9, bold: false, y: 574 },
    { text: '* Databases & Security: PostgreSQL, Supabase RLS, MySQL, SQLite, Token-Based Auth, CSRF / CORS Defense', size: 9, bold: false, y: 560 },
    { text: '* Cloud & DevOps: Vercel Edge Deployments, GitHub CI/CD, Git Version Control, Environment Security', size: 9, bold: false, y: 546 },
    { text: '* AI & Integration: Google Gemini API, OpenAI Assistants, Chatbot Automations, WhatsApp Direct APIs', size: 9, bold: false, y: 532 },

    { text: 'KEY PROJECTS & HIGHLIGHTS', size: 12, bold: true, y: 504 },
    { text: '1. Saqib Visuals & Central Portfolio Hub (https://mrsaqib242.vercel.app)', size: 10, bold: true, y: 488 },
    { text: '   - Architectural showcase featuring real-time dynamic REST API contact syndication and portfolio showcases.', size: 9, bold: false, y: 474 },
    { text: '   - Hardened Admin Dashboard with multi-layer device protection, travel security locks, and PBKDF2 hashing.', size: 9, bold: false, y: 462 },
    
    { text: '2. Zero-Trust API Guard Gateway', size: 10, bold: true, y: 442 },
    { text: '   - Built custom security middleware enforcing strict domain whitelisting, CORS preflight verification, and token guards.', size: 9, bold: false, y: 428 },

    { text: '3. Interactive 3-Step Client Project Estimator', size: 10, bold: true, y: 408 },
    { text: '   - Streamlined client discovery pipeline connecting automated WhatsApp priority dispatch with database logging.', size: 9, bold: false, y: 394 },

    { text: 'SERVICES & CLIENT ENGAGEMENT', size: 12, bold: true, y: 364 },
    { text: '* Full-Stack SaaS & Web Application Development (Next.js, TypeScript, Tailwind CSS)', size: 9, bold: false, y: 348 },
    { text: '* Cyber Security Audits, Supabase Row-Level Security (RLS) & Penetration Testing', size: 9, bold: false, y: 334 },
    { text: '* AI Chatbots, Gemini API Automation & Intelligent Agent Workflows', size: 9, bold: false, y: 320 },
    { text: '* High-Converting Portfolio & Landing Page Development (98+ SEO Scores)', size: 9, bold: false, y: 306 },

    { text: 'AVAILABILITY & CONTACT', size: 12, bold: true, y: 276 },
    { text: '* Status: Open for Remote Worldwide Contracts & Enterprise Consulting', size: 9, bold: false, y: 260 },
    { text: '* Direct WhatsApp: +92 347 8936242  |  Email: saqibsaqqibsaqib@gmail.com', size: 9, bold: false, y: 246 },
    { text: '* Response Time: Under 15 Minutes Priority Response via WhatsApp', size: 9, bold: false, y: 232 }
  ];

  let stream = 'BT\n';
  for (const line of lines) {
    const font = line.bold ? '/F2' : '/F1';
    stream += font + ' ' + line.size + ' Tf\n';
    stream += '50 ' + line.y + ' Td\n';
    const escaped = line.text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    stream += '(' + escaped + ') Tj\n';
    stream += '-50 -' + line.y + ' Td\n';
  }
  stream += 'ET\n';

  const streamLen = Buffer.byteLength(stream);

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n',
    '4 0 obj\n<< /Length ' + streamLen + ' >>\nstream\n' + stream + 'endstream\nendobj\n',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n'
  ];

  let header = '%PDF-1.4\n';
  let body = '';
  let xref = 'xref\n0 7\n0000000000 65535 f \n';

  let currentOffset = Buffer.byteLength(header);
  for (let i = 0; i < objects.length; i++) {
    const padded = String(currentOffset).padStart(10, '0');
    xref += padded + ' 00000 n \n';
    body += objects[i];
    currentOffset += Buffer.byteLength(objects[i]);
  }

  const xrefOffset = currentOffset;
  const trailer = 'trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF\n';

  const pdfBuffer = Buffer.from(header + body + xref + trailer, 'utf-8');
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'resume.pdf'), pdfBuffer);
  console.log('Successfully created public/resume.pdf! Size:', pdfBuffer.length, 'bytes');
}

createPdf();

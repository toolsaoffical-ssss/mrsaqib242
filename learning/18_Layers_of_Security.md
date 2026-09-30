# 🛡️ 18 Layers of Cyber Security Masterclass
*By Saqib (Advanced Security Architect) & Antigravity*

Yeh document aapke revision ke liye banaya gaya hai. Isme un 18 security layers ka nichor (summary) hai jo ek aam website ko military-grade system banati hain.

---

### 1. PBKDF2 (Password-Based Key Derivation Function 2)
*   **Kiya Hai:** Password Hashing ka nizam.
*   **Detail:** Password ko as-it-is save karne ke bajaye usme "Salt" (random lafz) mila kar PBKDF2 blender mein daal kar Hash banaya jata hai.
*   **Defense:** Agar database hack bhi ho jaye, toh hacker password nahi parh sakta. Avalanche Effect ki wajah se ek choti si tabdeeli poori hash badal deti hai.

### 2. JWT & HMAC (JSON Web Token & Hash-based Message Authentication Code)
*   **Kiya Hai:** Session Management aur Digital Moher (Signature).
*   **Detail:** Login ke baad server aapko ek JWT (Token/Chabi) deta hai. Hacker is token ke ander likhe `user` ko `admin` bananene ki koshish karta hai.
*   **Defense:** Token ke aakhir mein HMAC ki khufiya moher (signature) hoti hai. Token mein ek lafz ki changing se moher toot jati hai aur server access deny kar deta hai.

### 3. Honeypot Trap
*   **Kiya Hai:** Bots aur Spam Protection.
*   **Detail:** Contact forms par bots aakar kachra (spam) bhejte hain. Aam websites CAPTCHA lagati hain jo user ko tang karta hai.
*   **Defense:** Hum form mein ek "Invisible (Khufiya) Input Field" banate hain. Insaan usay khali chhorta hai, bot usay fill kar deta hai. Server samajh jata hai ke yeh bot hai aur usay block kar deta hai.

### 4. RLS (Row Level Security)
*   **Kiya Hai:** Database ki androni hifazat.
*   **Detail:** Agar hacker ko database ki API key (anon_key) mil jaye, toh wo `SELECT *` ya `DELETE *` ki commands chalata hai.
*   **Defense:** RLS har single row (line) par ek bodyguard khara kar deta hai. Bina "Admin Token" ke, database kisi bhi API request ko data dikhane ya delete karne se saaf inkaar kar deta hai.

### 5. CSRF (Cross-Site Request Forgery)
*   **Kiya Hai:** Behroopiya Attack.
*   **Detail:** Hacker aapko kisi aur website ka link bhejta hai. Background mein wo website aapke browser mein save login cookie ko use kar ke aapki main website par "Delete All" jaisi command bhejti hai.
*   **Defense:** `SameSite=Strict` Cookie policy aur `Origin` validation. Server check karta hai ke request dusri website se aayi hai toh usay block kar deta hai.

### 6. Rate Limiting & Auto-Ban (DDoS / Brute Force Protection)
*   **Kiya Hai:** Distributed Denial of Service se dhaal.
*   **Detail:** Hacker bots laga kar 1 minute mein 10,000 passwords guess karta hai ya server ko crash karne ki koshish karta hai.
*   **Defense:** Server ka Bouncer check karta hai. Jaise hi ek limit cross hoti hai (e.g. 5 requests), server Error 429 de kar IP ko 24 ghante ke liye Auto-Ban kar deta hai.

### 7. XSS (Cross-Site Scripting)
*   **Kiya Hai:** Zehreela Code (Input attack).
*   **Detail:** Hacker contact form mein aam message ki jagah JavaScript code `<script>steal_cookie()</script>` bhejta hai, jo Admin ke browser mein chal kar uski cookie bhej deta hai.
*   **Defense:** Input Sanitization aur Escaping. Frontend (React) brackets `< >` ko aam text bana deta hai taake code execute (run) na ho sake.

### 8. SQLi (SQL Injection)
*   **Kiya Hai:** Database ko dhoka dena.
*   **Detail:** Hacker login ya search box mein `' OR 1=1 --` ya `DROP TABLE` jaisi khufiya database commands type karta hai taake database bypass ho jaye.
*   **Defense:** Parameterized Queries (jaise Supabase/PostgREST). Yeh database ko sikhate hain ke user ka data sirf ek "Aam Lafz" hai, koi "Command" nahi.

### 9. Device Fingerprinting & Quarantine
*   **Kiya Hai:** Ajnabi Machine ka Jail (Travel Security).
*   **Detail:** Hacker password chura kar apne naye computer se login karta hai.
*   **Defense:** System machine ka OS, browser aur settings (Fingerprint) check karta hai. Agar device naya ho, toh usay 48-Ghante ki Jail (Quarantine) mein phenk diya jata hai jab tak purana computer usay approve na kare.

### 10. MITM (Man-in-the-Middle) & SSL/TLS
*   **Full Names:** Secure Sockets Layer / Transport Layer Security.
*   **Detail:** Hacker public Wi-Fi par baith kar hawa mein urrne wala aapka data (password) parh leta hai.
*   **Defense:** HTTPS aur SSL/TLS. Yeh data ko mobile se nikalne se pehle encrypt (lock) kar deta hai. Hacker agar pakar bhi le toh usay sirf kachra (garbage) milta hai. Chabi sirf server ke paas hoti hai.

### 11. Clickjacking (UI Redressing)
*   **Kiya Hai:** Khufiya Sheeshe (Iframe) ka dhoka.
*   **Detail:** Hacker apni website par ek "Play Game" button lagata hai aur uske theek upar invisible iframe mein aapke Admin Panel ka "Delete" button chupa deta hai.
*   **Defense:** `X-Frame-Options: DENY` aur CSP. Server browser ko order deta hai ke meri website ko kisi dusri website ke frame (sheeshe) mein open na kiya jaye.

### 12. Path Traversal (LFI - Local File Inclusion)
*   **Kiya Hai:** Kamray se bahar nikal kar file chori.
*   **Detail:** Hacker image download ke URL mein `../../../../../.env` likh kar server ke main (root) folder se passwords wali file nikalne ki koshish karta hai.
*   **Defense:** Sandboxing aur Input Validation. Server kisi bhi request mein `../` jaisi harkat dekhte hi Access Denied kar deta hai.

### 13. IDOR (Insecure Direct Object Reference)
*   **Kiya Hai:** URL mein ID badal kar chori.
*   **Detail:** Hacker apna invoice dekhne ke bajaye URL mein `id=5` ko badal kar `id=6` kar deta hai taake dusre ka data parh sakay.
*   **Defense:** 
  1. Ownership Check (Server dekhta hai ke ID 6 is user ka nahi).
  2. UUIDs (Random lambi strings like `a8b2...`). Guess karna na-mumkin hai.

### 14. CORS (Cross-Origin Resource Sharing)
*   **Kiya Hai:** API ka Bouncer.
*   **Detail:** Hacker apni website (`hacker.com`) se background mein aapki API ko call kar ke data nikalne ki koshish karta hai.
*   **Defense:** CORS Bouncer sirf `mrsaqib242.com` (VIP list) ko allow karta hai. Browser bouncer ki baat maan kar doosri websites ko "CORS Red Error" de kar rok deta hai.

### 15. Timing Attacks
*   **Kiya Hai:** Stopwatch ka dhoka.
*   **Detail:** Hacker check karta hai ke server kis PIN/Password par jawab dene mein zyada time le raha hai, aur us time ke farq se asli password guess kar leta hai.
*   **Defense:** Artificial Delays. Server mein `Math.random()` laga kar response time ko upar neechay kiya jata hai, taake hacker ki calculation tabah ho jaye.

### 16. Parameter Tampering (Mass Assignment)
*   **Kiya Hai:** Extra Data ka Dhoka.
*   **Detail:** Hacker profile update ke JSON form mein khud se `"role": "admin"` ya `"balance": 99999` add kar deta hai.
*   **Defense:** Strict Destructuring. Backend code mein `const { name, phone } = req.body;` likha hota hai, jo sirf allow ki hui cheezon ko pakarta hai aur extra kachre ko dustbin mein phenk deta hai.

### 17. Payload Size Limiting (Denial of Wallet / Zip Bomb)
*   **Kiya Hai:** Server ka dam ghutna.
*   **Detail:** Hacker contact form mein 10 GB ka text daal kar bhej deta hai jis se server ki RAM 100% full ho jati hai aur Cloud company aapko hazaron dollar ka internet bill bhej deti hai.
*   **Defense:** Request Size Limit (`limit: '2mb'`). Server 2MB se bari request ko andar aane se pehle hi bahar se reject (Error 413) kar deta hai.

### 18. Audit Logs & Intrusion Alerts (Security Telemetry)
*   **Kiya Hai:** System ke CCTV Cameras.
*   **Detail:** Koi bhi security 100% unbreakable nahi hoti. Agar hacker chup chap koshish karta rahay aur admin andha ho, toh nuksan pakka hai.
*   **Defense:** Honeypot traps, failed logins, aur IP bans hamesha Database mein record hote hain. Admin Panel par Laal Batti (Red Alert) jalti hai, jahan Admin hacker ki IP, country, aur attack type dekh kar usay 1-click se hamesha ke liye BAN kar sakta hai.

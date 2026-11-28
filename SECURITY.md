# Security notes

## What this website already does

| Risk | Protection |
|---|---|
| Malicious scripts injected into the page (XSS) | A Content-Security-Policy allows scripts and styles only from this site and the two named CDNs. There are no inline scripts, no inline styles, no inline event handlers. All text that comes from data files is escaped before display. |
| Your site shown inside someone else's page (clickjacking) | `frame-ancestors 'none'` and `X-Frame-Options: DENY` |
| Visitors sent over unencrypted HTTP | Forced redirect to HTTPS and `Strict-Transport-Security` |
| Browser guessing file types | `X-Content-Type-Options: nosniff` |
| Browser features you do not use (camera, microphone, location...) | Turned off by `Permissions-Policy` |
| Links leaking where visitors came from | `Referrer-Policy: strict-origin-when-cross-origin`; external links use `noopener noreferrer` |
| A CDN file being swapped for a malicious one | Integrity hashes (run `node tools/generate-sri.mjs` once, see below) |
| Source and tooling files being downloaded | `.htaccess` blocks dotfiles (except `.well-known`), `tools/`, `*.md` and similar |
| Spam and bots on the request form | Hidden honeypot field, a "too fast to be human" check, one request per minute per browser, text cleaning, a 60-second timeout |

## What a website alone cannot do (do this on the API)

The request form posts to your API. Anyone can call that address directly
and skip the page entirely, so **the API must protect itself**. For a NestJS API:

- **Validate every field** with a `ValidationPipe` using `whitelist: true` and
  `forbidNonWhitelisted: true` and length limits on each field. Never trust the page's checks.
- **Rate-limit** the public endpoint (`@nestjs/throttler`, for example 5 requests per minute per IP). The page's cooldown can be bypassed.
- **Allow only your site in CORS**: `origin: ['https://www.qoechtechnologies.co.ke']`, not `*`.
- **Use `helmet`** and set a small JSON body limit (for example 20 KB).
- **Escape or ignore HTML** in stored text, and escape it again wherever the admin dashboard displays it.
- If the API sends emails, never put visitor text into email headers (subject, to, reply-to) without removing line breaks.
- **Make reference codes unguessable**, and never return other people's requests from a code lookup.
- Hide internal errors: return a short message, log the details privately.
- Consider a CAPTCHA such as Cloudflare Turnstile if spam appears.
- Keep dependencies updated (`npm audit`) and keep secrets only in environment variables.

## Before go-live checklist

- [ ] Fill in the `Contact:` line in `.well-known/security.txt` and delete the two comment lines.
- [ ] Run `node tools/generate-sri.mjs` (needs internet and Node 18+), then upload the updated `index.html`.
- [ ] Open the live site with the browser console open (F12 > Console). Look for red messages starting "Refused to ...". Each one names something the policy blocked; add it to the policy only if it is something you want.
- [ ] Test the headers at https://securityheaders.com and https://observatory.mozilla.org
- [ ] Submit a test request from a phone and check it reaches you.
- [ ] Turn on two-factor sign-in for your hosting, domain registrar, email and GitHub accounts. A stolen password is far more likely than a clever hack.
- [ ] Keep a backup copy of the whole folder somewhere other than the host.

## When you change the policy

The Content-Security-Policy appears in four places: the `<meta>` tag in `index.html`,
and the header files (`.htaccess`, `_headers`, `vercel.json`). Change them together.
Adding a new CDN, font host, image host or API address means adding it to all four.

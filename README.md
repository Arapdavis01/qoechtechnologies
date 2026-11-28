# Qoech Technologies website

A fast, mobile-friendly company site built with plain HTML, CSS and JavaScript.
There is nothing to install or compile: upload the files and it works.

## Folder map

```
index.html                  The page (all sections live here)
404.html                    Page shown for addresses that do not exist
robots.txt, sitemap.xml     Search-engine files
.htaccess                   Security + cache settings for Apache / cPanel hosts
_headers                    Same settings for Netlify / Cloudflare Pages
vercel.json                 Same settings for Vercel
.well-known/security.txt    Where researchers report security problems (fill in!)

css/                        Styles, split by purpose (see css/README.md)
  base/        tokens (colours, fonts), reset, utilities, accessibility
  components/  navbar, preloader, modals, wizard form, FAQ, WhatsApp button...
  sections/    one file per page section (hero, about, services...)
  responsive/  breakpoints and the small-phone polish
  pages/       styles for other pages (404)

js/                         Behaviour, split into small modules
  boot.js      tiny script that runs first (scroll reset, preloader failsafe)
  main.js      the entry point: lists every feature, one line each
  config.js    API address and limits  <-- the only place to change addresses
  utils/       shared helpers (escaping, text cleaning)
  data/        services.js and projects.js  <-- edit your content here
  modules/     one file per feature (menu, tabs, wizard form, modals...)

images/                     Your pictures (see images/README.md)
tools/                      Helper scripts. Do not upload this folder.
```

## Previewing on your computer

The page uses modern JavaScript modules, and browsers refuse to run those when
you double-click `index.html` (the address starts with `file://`). Serve the
folder instead. Any one of these works:

- VS Code: install the "Live Server" extension, right-click `index.html`, "Open with Live Server".
- Python: `python3 -m http.server 8080` in this folder, then open http://localhost:8080
- Node: `npx serve`

## Putting it online

1. Copy your existing `images/` folder into this one (see `images/README.md`).
2. Upload everything **except** `tools/`, `README.md` and `SECURITY.md` to the
   host's public folder (`public_html` on cPanel).
3. Keep the settings file that matches your host and ignore the other two:
   cPanel/Apache = `.htaccess`, Netlify/Cloudflare = `_headers`, Vercel = `vercel.json`.
   Make sure hidden files were uploaded (`.htaccess`, `.well-known/`).
4. Work through the checklist in `SECURITY.md`.

## Changing content

| To change | Edit |
|---|---|
| Service pop-ups | `js/data/services.js` |
| Project case studies | `js/data/projects.js` |
| FAQ answers | the `#faq` section in `index.html` **and** the matching `FAQPage` block near the bottom of `<head>` (Google needs both to say the same thing) |
| Form address or limits | `js/config.js` |
| Colours, fonts, radius | `css/base/01-tokens-reset-typography.css` (the `:root` block) |
| Contact details | `index.html` (search for the phone number or email) |

After you upload a CSS or JS change, browsers may show the old file for up to an
hour. Press Ctrl+F5 (or clear the site's data on a phone) to see it at once.

## Turning a feature off

Open `js/main.js` and put `//` in front of the feature's line. For example
`// initEagle();` switches off the eagle flight animation.

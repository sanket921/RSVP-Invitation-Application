# Start-Up Social — RSVP Invitation

RSVP page for **Start-Up Social by Axis Bank** (02 December 2026, Bengaluru).

Guests enter their name and company and confirm attendance, then get the **I Am Attending** frame to download and post on LinkedIn.

## Flow
1. **RSVP** — name, company, attending yes/no ("no" shows a thank-you screen)
2. **Frame** — shows the I Am Attending frame, Continue
3. **Share** — Download frame / LinkedIn (downloads the image and opens LinkedIn)

## Edit event details
Change the `EVENT` block at the top of `script.js` (name, date, city, frame image).

## Run locally
```sh
python3 -m http.server 5173
```
Then open http://localhost:5173/

## Deploy
Static site (no build step): `index.html`, `styles.css`, `script.js`, `assets/`. Works as-is on Vercel, Netlify or GitHub Pages.

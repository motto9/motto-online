# mollyotto.online

A playful Y2K / early-web personal site. Static, no build step.

## Structure

```
index.html      markup shell
styles.css      all styles
app.js          rendering + interactions (persona swap, draggable accessories, etc.)
content.json    all copy — synced from Notion
assets/
  dolls/        the paper-doll art + draggable accessories (axe, purse)
  icons/        pixel icons for the persona pills
  photo.webp    the polaroid
  grid/         bento imagery
```

## Editing copy

Copy lives in a Notion workspace ("Where's Molly? — Site Copy": Personas, Bento cards,
Settings) and is pulled into `content.json`. Edit in Notion, re-sync, redeploy.

## Deploy

Static site on Vercel, auto-deployed from GitHub (`motto9/motto-online`):
push to `main` and Vercel builds + deploys to https://www.mollyotto.online automatically.

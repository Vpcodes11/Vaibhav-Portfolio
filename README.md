# Vaibhav Pamnani portfolio

A client-facing, single-page portfolio for Vaibhav Pamnani, a social media and growth manager. It introduces his services and approach, uses supplied results to establish credibility, and presents Tatva by Tradeprop as a detailed example of his work. The site uses HTML, CSS and vanilla JavaScript. There is no build step or framework.

## What's included

- A lightweight 3D layered hero with floating campaign cards, a rotating VP cube, pointer tilt and scroll depth. Project and gallery images also respond subtly to pointer movement. Motion pauses offscreen and becomes static when reduced motion is preferred.
- A Tatva case study with the live project website, supplied 21-page brochure, villa and project imagery, and supplied large-screen marketing film.
- A concise healthcare content result that uses supplied figures without publishing unapproved client imagery.
- Social-first service copy, verified results, contextual calls to action, and a project email link with a short brief already filled in.
- A keyboard-accessible image gallery and dark and light themes.
- Responsive layouts for phones, tablets and desktops.

The villa and project images were extracted from the brochure Vaibhav supplied. The film in `assets/videos/tatva-display-film.mp4` is an optimized 720p web copy of the supplied 1080p source. The source file is not altered.

## Files

```text
vaib-portfolio/
├── index.html
├── css/style.css
├── js/main.js
├── assets/
│   ├── favicon.svg
│   ├── tatva-brochure.pdf
│   ├── images/tatva/*.webp
│   └── videos/tatva-display-film.mp4
└── README.md
```

## Preview

Open `index.html` directly in a browser, or run `python -m http.server 8000` from this folder and open `http://localhost:8000`. No install or build command is needed.

## Edit

- Update copy, links and the contact email in `index.html`.
- Adjust colors, typography and layouts in `css/style.css`. The default is the lime and warm-ivory theme; visitors can select dark mode.
- Update theme, menu, scroll reveals, 3D pointer motion and lightbox behavior in `js/main.js`.
- Replace images with optimized WebP files and keep descriptive alt text, dimensions and lazy loading for images below the first screen.
- Replace the film with a web-optimized MP4; keep video controls and a poster image.

The site intentionally leaves out healthcare client imagery, the separate 3D website claim, tool names and a resume link until those materials and details are verified. The scene on this portfolio is a CSS 3D presentation of campaign assets; it does not claim the Tatva website itself uses 3D technology.

## Deploy on Netlify

1. Open Netlify's manual deployment page.
2. Drag the `vaib-portfolio` folder, containing `index.html`, into the upload area.
3. Netlify serves the static site directly. Leave the build command blank.
4. Alternatively, connect the Git repository and set the publish directory to `vaib-portfolio` if it sits inside a larger repository. If this folder is the repository root, publish from the root.

The same static files can be hosted on GitHub Pages or Vercel without a build step.

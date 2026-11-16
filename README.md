This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Stack and tool logos

Add a name to an `items` array in `src/components/StackAndTools.tsx` or a project's technology tags. `TechStack` loads its SVG automatically from the [Simple Icons CDN](https://github.com/LitoMore/simple-icons-cdn):

```tsx
items: ['React', 'Next.js', 'TypeScript', 'GSAP', 'HTML5', 'CSS3', 'TanStack Query', 'Docker']
```

No icon import or download is needed. Matching is case insensitive; spaces are removed and dots become `dot`. For unusual brand names, add a slug alias or custom SVG `src` in `src/lib/technology-logos.ts`. Find supported slugs in the [Simple Icons catalog](https://simpleicons.org). Local Convex and Flet logos are preserved.

The CDN serves current logos as its catalog updates, subject to browser caching. CDN logos require internet access; unsupported names or failed requests display a generic icon with the technology label retained. Monochrome overrides adapt to the site's theme. VS Code, Antigravity, Codex, and OmniRoute use local SVGs; their sources are recorded in `public/assets/logos/SOURCES.md`.

Headings and bold text use Plus Jakarta Sans from Google Fonts through `next/font/google`. Regular body text uses the local Hanken Grotesk font. The Google font is downloaded at build time and served by the site.

To mark your usual choices for new projects, edit `goToTechnologies` in `src/data/stack-preferences.ts`. The initial entries are **samples**, so replace them with your own picks. Match the names in `StackAndTools.tsx`; add or remove names to show or hide the “Go-to” marker. Set the list to `[]` to hide all markers and their legend. These markers appear only in the Stack & tools section.

Go-to picks have a hand-drawn circle around their logo. Category tabs animate the logos with a short scatter-and-settle transition, and the selected underline slides between tabs. Each logo tilts in 3D toward the mouse pointer and springs back when it leaves; touch gets a small press effect. Reduced-motion preferences disable these effects while keeping the circles visible.

### Sidebar portrait

Edit `src/data/hero-portrait.ts` to choose the front and reverse images and the speech bubble's `bubbleText`. Image paths start at `public` (for example, `public/assets/portrait-back.webp` becomes `/assets/portrait-back.webp`). Set `bubbleText` to `''` to hide the bubble. The reverse uses `me_and_bebe.webp`, converted losslessly from the original JPEG and served without further image compression.

Drag the portrait down and left to peel the sticker and reveal the reverse image and handwritten bubble. The drag has gentle resistance and spring smoothing, with a slower 0.85-second settling animation. Release past 55% to complete the reveal; shorter drags settle back. Drag up and right to cover it again. Keyboard users can toggle with Enter or Space. Completing a reveal temporarily changes only the accent color to pink with floating hearts for five seconds, without changing the light/dark theme or saved preferences. Reduced-motion mode shows stationary hearts and skips settling animations. The poke button still triggers a wobble.

### Experience content

Set `showWorkExperience` in `src/data/experience/experience.ts`:

- `false` (default) displays `src/data/experience/project-experience.ts`.
- `true` displays `src/data/experience/work-experience.ts`.

The setting controls the homepage, experience archive, page metadata, search, and experience links. Project entries stay in the curated order when dates are blank; add confirmed dates when available.

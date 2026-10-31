# Project images

## Add files

Put screenshots in `public/assets/projects/`, optionally inside a folder for each project:

```
public/assets/projects/visaia/home.webp
public/assets/projects/visaia/farm.webp
public/assets/projects/visaia/detection.webp
```

WebP, PNG, and JPG are supported. The URL starts with `/assets/`, without `/public`.

## Add paths to the project array

Open `src/data/projects/projects.ts`, find the project by its `id`, and edit `images`:

```ts
"id": "visaia",
"images": [
  "/assets/projects/visaia/home.webp",
  "/assets/projects/visaia/farm.webp",
  "/assets/projects/visaia/detection.webp"
],
```

No separate `image` field is needed. Add as many paths as you want.

- **One image:** a static image, without carousel controls, drag behavior, or card animation.
- **Two or more:** the animated carousel with arrows, thumbnails, swipe, and keyboard navigation.
- **Empty array:** no image area. Blank paths are ignored.
- **First image:** also supplies the homepage and All Projects card cover.
- **Order:** the same order as the array.

The carousel updates automatically when the number of images changes.

## Optional captions and cropping

Simple paths are enough. These optional project-level defaults apply to them:

```ts
"imageLabel": "Application screenshots",
"imageFit": "contain",
"imagePosition": "center top",
```

`contain` shows a full screenshot without cropping, useful for mobile screens. `cover` fills the frame and crops the edges; it is the default. Change or remove the existing "Project artwork" label when replacing artwork with real screenshots.

For individual image settings, mix an object into the same array:

```ts
"images": [
  "/assets/projects/visaia/home.webp",
  {
    "src": "/assets/projects/visaia/detection.webp",
    "alt": "VISAIA pest detection screen",
    "caption": "Pest detection",
    "fit": "contain",
    "position": "center"
  }
],
```

Cards use a 16:10 frame and detail images become wider on larger screens. Around 1600 x 1000 is a useful starting point for desktop captures. Check both views after replacing an image. Use a new filename if an overwritten file stays cached.

# Blog and local writing studio

## Write without editing code

1. Run `npm run portfolio` and open `http://localhost:3000/blog` (or the port Next prints).
2. Click **New post**, or press **Ctrl+A** / **Cmd+A** outside a text field.
3. Write the title and article. The toolbar supports bold, italic, underline,
   body / medium / large headings, lists, quotes, links, code, images, and undo/redo.
   Select words and use the **px** field to set any size from 12 to 64 pixels
   (press Enter or click away to apply). Use **Aa** to reset to the paragraph
   or heading default. With no selection, the size applies to the next text you type.
   Ctrl+A inside an input or the article keeps its normal Select All behavior.
4. Add tags, an excerpt, a cover image, and optional article image descriptions/captions.
5. Use **Preview** to see the article styling. **Save draft** saves a private working
   post; **Publish locally** makes it visible on your local blog.
6. Commit `src/data/blogs.ts` plus any new files in `public/assets/blog/`, then push
   and deploy. Your Vercel site displays the published posts from that commit.

Published posts can be edited through **Manage posts**. Save changes to update a
post, or **Save draft** to remove it from the public blog on the next deployment.
There is no automatic production publishing or Git push.

## Storage and development boundaries

No password or environment variables are needed for this workflow. The writing
studio is shown only in Next's development mode. All write/upload routes also
check development mode, a localhost / loopback Host, and a same-origin Origin
header. Production routes return 404, even when called directly. The editor does
not appear during `npm run build` + `npm start` or on Vercel. Do not expose your
development server to the internet; this is a local writing tool, not an admin CMS.

Posts are saved atomically to `src/data/blogs.ts`. A revision check prevents one
editor or a manual file edit from silently overwriting newer changes. If you see
a conflict, copy your work, close and reopen the editor, then apply the changes.
A browser working copy is also stored locally and restored when the saved post
has not changed. The working copy is not a replacement for saving to the file.

Uploaded PNG, JPEG, WebP, and GIF images (up to 5 MB each) are saved with generated
filenames in `public/assets/blog/`. Include them in Git. Removed or replaced images
are retained so older references are not broken; unused images may be removed
manually after checking references. Text is stored as structured editor JSON and
rendered as React elements, rather than injecting stored HTML.

## Add posts in code

`src/data/blogs.ts` exports `blogs: BlogPost[]`. Keep the export declaration and
use JSON-compatible values inside the array: double-quoted keys and strings, no
trailing commas, comments inside the array, functions, spreads, or expressions.
The local editor can read and rewrite this format. The `BlogPost` type lives in
`src/types/blog.ts`; article content uses Tiptap document nodes. The easiest way
to get a complete example is to save a draft in the editor and inspect the file.

Drafts are omitted from public lists, post URLs, metadata, and client search data.
Published posts have a slug, timestamps, title, excerpt, tags, optional cover,
and structured content. Blog pages use the existing RouteShell and PageHeader,
including your normal navigation, themes, background, and footer.

## Checks

- `node --test tests/blog-local.test.mjs` tests the real route handlers against
  an isolated temporary project: save, edit, publish, conflict detection, image
  upload, invalid content, local host/origin checks, and production rejection.
- `npx tsc --noEmit`
- `npm run build`

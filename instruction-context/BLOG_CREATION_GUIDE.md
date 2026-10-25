# Blog Creation Guide

This guide defines the authoring rules, MDX conventions, and publishing workflow for `hophuc-blog` (`https://blog.phuchanhtrinh.work`).

---

## ✍️ 1. Writing Style, Accuracy & Privacy Rules

- **Authentic & Concise Voice**: Keep personal writing authentic, natural, reflective, and concise.
- **Grammar & Tone**: Correct grammar and awkward phrasing without changing the author's meaning, tone, or personality.
- **Strict Factual Accuracy**: Never invent personal facts, work experience, projects, achievements, or qualifications.
- **Privacy Protection**:
  - Do **not** disclose the author's current country, city, or location unless explicitly requested.
  - Do **not** mention the author's current employer or current employment arrangement unless explicitly requested.
  - Do **not** add location or employer details to frontmatter, SEO metadata, or structured data.
- **Learning Direction Framing**: Describe Dynamics AX, Microsoft Power Platform, Power BI, and business application integrations as technologies currently being explored and learned—not areas of established expertise.
- **Maintenance Safety**: Preserve existing article URLs (slugs), publication dates, and article prose when performing unrelated maintenance. Do not rewrite or delete existing articles without explicit approval.

---

## 📁 2. File Structure & Naming Conventions

Place blog posts in `data/blog/` using lowercase `kebab-case` filenames with the `.mdx` extension:

```text
data/
├── blog/
│   ├── your-post-slug.mdx          # Standard blog post -> /blog/your-post-slug
│   └── nested-category/
│       └── your-nested-post.mdx    # Nested post -> /blog/nested-category/your-nested-post
└── authors/
    └── default.mdx                 # Author profile (/my-profile)
```

- ✅ `my-blog-post.mdx`
- ❌ `My Blog Post.mdx` or `my_blog_post.mdx`

---

## 🎯 3. Frontmatter Schema & Language Metadata

Only use frontmatter fields supported by `contentlayer.config.ts`.

### Required Authoring Fields

- **`title`** (`string`, required by schema): Clear, descriptive post title (recommended under 60 characters for SEO).
- **`date`** (`string`, `YYYY-MM-DD`, required by schema): Publication date.
- **`postType`** (`number`, defaults to `0`): Single source of truth for article language:
  - `0` = **Vietnamese** (`VI · Tiếng Việt`)
  - `1` = **English** (`EN · English`)
- **`tags`** (`string[]`, defaults to `[]`): Topic/category tags (kept separate from language identification).
- **`draft`** (`boolean`): Set to `false` to publish, or `true` to hide in production builds.
- **`summary`** (`string`): Brief description for article listings, Open Graph, and meta description (recommended 150–200 characters).

### Optional Supported Fields

- **`images`** (`string[]`): Featured image path(s), e.g., `['/static/images/featured.jpg']`. The first image is used for Open Graph, Twitter cards, and JSON-LD `BlogPosting.image` (falls back to `siteMetadata.socialBanner` when empty `[]`).
- **`lastmod`** (`string`, `YYYY-MM-DD`): Last modification date.
- **`authors`** (`string[]`): Author slug references (defaults to `['default']`).
- **`layout`** (`string`): Layout component (`PostLayout` default, `PostSimple`, or `PostBanner`).
- **`bibliography`** (`string`): BibTeX file reference for citations.
- **`canonicalUrl`** (`string`): Explicit canonical URL if cross-posted.

### Language Metadata Rules

- **Single Source of Truth**: Use `postType` (`0` = Vietnamese, `1` = English) to identify the post language. Do not introduce a duplicate language field unless the architecture explicitly requires it.
- **Content-Based Classification**: Always determine language from the **actual article body content**, never from the title or tags alone (for example, a Vietnamese article that quotes an English phrase in its title or body still uses `postType: 0`).
- **Ask When Unclear**: If an article's primary language is genuinely ambiguous (e.g., equally mixed bilingual text), ask for confirmation rather than guessing.

---

## 🏷️ 4. Tags & Categories

On the `/blog` listing page, **Language** (`EN · English` / `VI · Tiếng Việt`) and **Categories** (`tags`) are displayed and filtered as separate groups. Each article shows a compact language badge alongside its publication date and topic tags below its title.

### Tagging Rules

1. **Separate Language from Topic**: Use `postType` for language identification and `tags` strictly for topic classification.
2. **Reuse Existing Tags First**: Prefer established tags based on the article's actual topic and language:
   - **Active Vietnamese Tags (`postType: 0`)**:
     - `'cau-chuyen'` — Personal stories, career reflections, milestones
     - `'bai-hoc-cuoc-song'` — Life lessons, mindset, personal growth
   - **Active English Tags (`postType: 1`)**:
     - `'story'` — Personal stories, career reflections, milestones
     - `'life-lessons'` — Life lessons, mindset, personal growth
3. **Avoid Tag Sprawl**: Do not create near-duplicate tags (e.g., `'stories'` vs `'story'`, or `'bai-hoc'` vs `'bai-hoc-cuoc-song'`).
4. **Confirm New Categories**: Ask the author before introducing a new tag/category or changing the existing taxonomy when the right classification is unclear.

### How Tag Files Are Generated

During `yarn build` (via `contentlayer.config.ts`), tags from non-draft posts are written to:

- `app/tag-data.json` — All tags across both languages (used by `/tags` and static tag route generation)
- `app/tag-data-english.json` — Tags from English posts (`postType: 1`)
- `app/tag-data-vietnamese.json` — Tags from Vietnamese posts (`postType: 0`)

---

## 📸 5. MDX Conventions, Images & Layouts

### Images & Alt Text

- Store static images in `/public/static/images/` and reference them as `/static/images/your-image.jpg`.
- Always provide **accurate, descriptive `alt` text** that describes what is visually in the image (never copy generic placeholder alt text from another post).
- When a post includes a hero image in its body, also set `images: ['/static/images/your-image.jpg']` in frontmatter so Open Graph and Twitter previews match the article.

**Markdown Image:**

```markdown
![Descriptive alt text](/static/images/example.jpg)
_Optional image caption._
```

**HTML Image (when explicit width is desired):**

```mdx
<img src="/static/images/example.jpg" alt="Descriptive alt text" width="400" height="auto" />
```

**Two-Column Image Grid:**

```jsx
<div className="-mx-2 flex flex-wrap overflow-hidden xl:-mx-2">
  <div className="my-1 w-full overflow-hidden px-2 xl:my-1 xl:w-1/2 xl:px-2">
    ![First image description](/static/images/image1.jpg)
  </div>
  <div className="my-1 w-full overflow-hidden px-2 xl:my-1 xl:w-1/2 xl:px-2">
    ![Second image description](/static/images/image2.jpg)
  </div>
</div>
```

### Heading Hierarchy & Formatting

- The post `title` in frontmatter renders as the page's single `<h1>`.
- Inside the MDX body, start main sections with `##` (`<h2>`) and subsections with `###` (`<h3>`). Never use `#` (`<h1>`) inside the article body.

### Layout Options

Specify `layout` in frontmatter when a non-default layout is needed:

1. **`PostLayout`** (default) — Standard layout with author details, reading time, tags, and previous/next navigation.
2. **`PostSimple`** — Simplified single-column layout without sidebar.
3. **`PostBanner`** — Full-bleed banner layout (requires `images: ['/static/images/banner.jpg']`).

### Code Blocks, Math, TOC & Citations

**Code Block with Title, Line Numbers & Highlighting:**

````markdown
```js:example.js {1,3-4} showLineNumbers
const message = 'Hello World'
console.log(message)
```
````

**Inline Table of Contents:**

```jsx
<TOCInline toc={props.toc} exclude="Introduction" toHeading={2} />
```

**Math (KaTeX):**
Use `$E = mc^2$` for inline math and `$$ ... $$` for block math.

**Footnotes & Citations:**
Use standard GFM footnotes (`[^1]`) or add `bibliography: references-data.bib` to frontmatter and cite with `[@CitationKey]`.

---

## 📋 6. Post Templates

### Vietnamese Personal / Reflection Post (`postType: 0`)

```mdx
---
title: '07 - [Tiêu đề bài viết]'
date: '2026-04-20'
tags: ['cau-chuyen']
draft: false
summary: 'Tóm tắt ngắn gọn nội dung chính của bài viết (khoảng 150-200 ký tự).'
images: ['/static/images/your-image.jpg']
postType: 0
---

<img
  src="/static/images/your-image.jpg"
  alt="[Mô tả chính xác hình ảnh]"
  width="400"
  height="auto"
/>
_[Chú thích ngắn dưới ảnh nếu có.]_

[Mở đầu câu chuyện tự nhiên, chân thật...]

---

## 🌱 [Tiêu đề phần chính 1]

[Nội dung chia sẻ và góc nhìn cá nhân...]

## 💡 [Tiêu đề phần chính 2]

- **[Ý chính 1]**: [Giải thích ngắn gọn]
- **[Ý chính 2]**: [Giải thích ngắn gọn]

---

Cảm ơn bạn đã đọc.  
**— Phúc**
```

### English Personal / Technical Post (`postType: 1`)

```mdx
---
title: '03 - [Your Post Title]'
date: '2026-04-20'
tags: ['story']
draft: false
summary: 'A concise summary of the article for listings and SEO (recommended 150-200 characters).'
images: ['/static/images/your-image.jpg']
postType: 1
---

![Accurate description of the image](/static/images/your-image.jpg)
_Optional caption._

[Opening context in a clear, personal voice...]

## ✨ [Main Section]

[Main story, technical notes, or reflection...]

## 🎯 [Key Takeaways]

- **[Takeaway 1]**: [Explanation]
- **[Takeaway 2]**: [Explanation]

---

**Thank you for reading!**  
**— Phuc**
```

---

## 🚀 7. Publishing & Verification Checklist

Before finalizing any new or updated blog post:

1. **Frontmatter & MDX Syntax**:
   - [ ] Only supported frontmatter fields are used and YAML syntax is valid.
   - [ ] `date` (and `lastmod` if present) uses `YYYY-MM-DD` format.
   - [ ] `draft: false` is set when ready to publish.
   - [ ] Body headings start at `##` (`<h2>`) with no `#` (`<h1>`) in the MDX body.
2. **Language & Tag Consistency**:
   - [ ] `postType` matches the actual body language (`0` = Vietnamese, `1` = English).
   - [ ] `tags` reuse established topic tags matching the post's content and language.
3. **Images, Links & Privacy**:
   - [ ] Image files exist in `public/static/images/` and are referenced as `/static/images/...`.
   - [ ] `images` frontmatter includes the hero image when a social preview image is intended.
   - [ ] Every image has accurate, descriptive `alt` text.
   - [ ] Internal and external links are valid.
   - [ ] No private location or current employer details are disclosed.
4. **Build & Lint Verification**:
   - [ ] Run `yarn lint` to verify code/lint rules.
   - [ ] Run `yarn build` (`EXPORT=true next build`) to regenerate Contentlayer documents, tag JSON files (`app/tag-data*.json`), search index (`public/search.json`), and static pages.

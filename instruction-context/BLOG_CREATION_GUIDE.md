# Blog Creation Guide

This guide provides step-by-step instructions for creating blog posts in your Tailwind Next.js blog based on the existing content patterns and structure.

## 📁 File Structure

Blog posts should be placed in the following directory structure:

```
data/
├── blog/
│   ├── your-post-title.mdx                    # Standard blog post
│   └── nested-category/
│       └── your-nested-post.mdx               # Nested/categorized post
└── authors/
    ├── default.mdx                            # Default author
    └── other-authors.mdx                      # Additional authors
```

## 📝 Blog Post Template

### Basic Blog Post Template

```mdx
---
title: 'Your Blog Post Title'
date: '2025-08-30'
tags: ['tag1', 'tag2', 'tag3']
draft: false
summary: 'A brief summary of your blog post content (recommended 150-200 characters)'
images: []
postType: 0
---

Your blog content starts here...

## Main Section

Your content with proper markdown formatting.

### Subsection

More detailed content.

## Conclusion

Wrap up your thoughts.
```

## 🎯 Frontmatter Fields Reference

### Required Fields

- **title**: String - The title of your blog post
- **date**: String (YYYY-MM-DD format) - Publication date
- **tags**: Array of strings - Categorization tags
- **draft**: Boolean - Set to `false` to publish, `true` to keep as draft
- **summary**: String - Brief description for SEO and listing pages

### Optional Fields

- **postType**: Number - Language identifier (`0` = Vietnamese, `1` = English)
- **lastmod**: String (YYYY-MM-DD format) - Last modification date
- **images**: Array - Featured images (first image used as social banner)
- **authors**: Array of strings - Author references (defaults to 'default')
- **layout**: String - Layout component name (see Layout Options)
- **bibliography**: String - Bibliography file reference for citations
- **canonicalUrl**: String - Canonical URL if content exists elsewhere

## 🌐 Language System & Tags

### Post Language Types

Your blog supports bilingual content with automatic tag separation:

- **Vietnamese Posts**: `postType: 0`
  - Use Vietnamese tags: `['cau-chuyen', 'bai-hoc-cuoc-song']`
  - Content written in Vietnamese
- **English Posts**: `postType: 1`
  - Use English tags: `['story', 'life-lessons']`
  - Content written in English

### Tag System Architecture

Tags are automatically separated by language:

- Vietnamese tags → `app/tag-data-vietnamese.json`
- English tags → `app/tag-data-english.json`
- Combined tags → `app/tag-data.json`

**Important**: After creating new posts, run `yarn build` to regenerate tag files.

## 🎨 Layout Options

Choose from these available layouts by adding `layout: 'LayoutName'` to frontmatter:

1. **PostLayout** (default) - Standard blog post layout
2. **PostSimple** - Simplified layout without sidebar
3. **PostBanner** - Large banner image layout (requires featured image)

Example:

```yaml
layout: PostBanner
images: ['/static/images/your-banner.jpg']
```

## 🏷️ Tagging Strategy

### Current Tag Categories

#### Vietnamese Tags (`postType: 0`)

- `'cau-chuyen'` - Personal stories
- `'bai-hoc-cuoc-song'` - Life lessons
- `'cam-hung'` - Inspiration
- `'phat-trien-ban-than'` - Personal development
- `'tu-hoc'` - Self-learning
- `'hanh-trinh-hoc'` - Learning journey

#### English Tags (`postType: 1`)

- `'story'` - Personal stories
- `'life-lessons'` - Life lessons
- `'career-change'` - Career transitions
- `'learning-journey'` - Learning experiences
- `'personal-growth'` - Personal development
- `'tech-career'` - Technology career topics

### Content Type Tags (Both Languages)

- `'blogging'`, `'daily-life'`, `'reflection'`, `'writings'`

### Technology Tags (Both Languages)

- `'next-js'`, `'tailwind'`, `'markdown'`, `'github'`, `'ai-tools'`

### Best Practices

- **Match language**: Use Vietnamese tags for Vietnamese posts, English tags for English posts
- **Be consistent**: Stick to established tag patterns
- **After changes**: Always run `yarn build` to update tag system

## 📸 Images and Media

### Image Storage

Store images in: `/public/static/images/[category]/filename.jpg`

### Image Usage in Posts

#### Single Image

```markdown
![Alt text](/static/images/category/image.jpg)
```

#### Featured Image (Social Media)

```yaml
images: ['/static/images/category/featured-image.jpg']
```

#### Image Gallery (using Tailwind classes)

```jsx
<div className="-mx-2 flex flex-wrap overflow-hidden xl:-mx-2">
  <div className="my-1 w-full overflow-hidden px-2 xl:my-1 xl:w-1/2 xl:px-2">
    ![Image 1](/static/images/category/image1.jpg)
  </div>
  <div className="my-1 w-full overflow-hidden px-2 xl:my-1 xl:w-1/2 xl:px-2">
    ![Image 2](/static/images/category/image2.jpg)
  </div>
</div>
```

## ⚙️ Advanced Features

### Table of Contents

```jsx
<TOCInline toc={props.toc} exclude="Introduction" toHeading={2} />
```

Options:

- `exclude`: String or array - Headings to exclude
- `toHeading`: Number - Maximum heading level to include
- `fromHeading`: Number - Minimum heading level to include
- `asDisclosure`: Boolean - Render as expandable element

### Code Blocks with Features

#### Basic Code Block

````markdown
```javascript
const example = 'Hello World'
console.log(example)
```
````

#### With Line Numbers and Highlighting

````markdown
```js {1,3-4} showLineNumbers
var num1, num2, sum
num1 = prompt('Enter first number')
num2 = prompt('Enter second number')
sum = parseInt(num1) + parseInt(num2)
```
````

#### With Filename

````markdown
```js:filename.js
// Your code here
```
````

### Math Equations (KaTeX)

#### Inline Math

```markdown
This is inline math: $E = mc^2$
```

#### Block Math

```markdown
$$
\mathbf{Y} = \left[\begin{array}
  {c}
  y_1 \\
  y_2 \\
  \vdots \\
  y_n
\end{array}\right]
$$
```

### Citations and Bibliography

Add to frontmatter:

```yaml
bibliography: references-data.bib
```

In content:

```markdown
Standard citation [@Nash1950]
In-text citations e.g. @Nash1951
Multiple citations [see @Nash1950; @Nash1951, page 50]
```

### Newsletter Component

```jsx
<BlogNewsletterForm title="Subscribe to my newsletter" />
```

### Footnotes

```markdown
This is a statement with a footnote[^1].

[^1]: This is the footnote content.
```

## 🗂️ Nested Posts (Categories)

For categorized content, create subdirectories:

```
data/blog/
├── tutorials/
│   └── advanced-nextjs.mdx
├── reviews/
│   └── book-review.mdx
└── personal/
    └── daily-thoughts.mdx
```

## 👥 Multiple Authors

### Create Author File

In `data/authors/author-name.mdx`:

```mdx
---
name: Author Name
avatar: /static/images/authors/author.jpg
occupation: Your Occupation
company: Your Company
email: author@email.com
twitter: https://twitter.com/username
linkedin: https://linkedin.com/in/username
github: https://github.com/username
---

Author bio and description...
```

### Reference in Blog Post

```yaml
authors: ['default', 'author-name']
```

## 🚀 Publishing Checklist

Before publishing your blog post:

### Content Review

- [ ] Title is clear and descriptive
- [ ] Summary is compelling and SEO-friendly
- [ ] Tags are relevant and consistent with existing taxonomy
- [ ] Images are optimized and properly referenced
- [ ] All links work correctly
- [ ] Code blocks are properly formatted

### Technical Check

- [ ] Date is in correct format (YYYY-MM-DD)
- [ ] `draft: false` to publish
- [ ] File is saved as `.mdx` extension
- [ ] File location is correct (`data/blog/` or subdirectory)
- [ ] No syntax errors in frontmatter
- [ ] **postType matches content language** (`0` = Vietnamese, `1` = English)
- [ ] **Tags match post language** (Vietnamese tags for Vietnamese posts, English for English)
- [ ] Run `yarn build` after creating new posts to update tag system

### SEO & Social

- [ ] Featured image added if using PostBanner layout
- [ ] Summary is between 150-200 characters
- [ ] Title is under 60 characters for SEO
- [ ] Tags help with discoverability

## 📋 Quick Templates

### Inspirational/Life Lesson Post (Your Style)

```mdx
---
title: '[Inspirational Title] – [Subtitle about impact]'
date: '2025-08-30'
tags: ['cau-chuyen', 'bai-hoc-cuoc-song']
draft: false
summary: 'Câu chuyện về [topic] và cách nó thay đổi góc nhìn của tôi về [aspect]'
images: ['/static/images/featured-image.png']
postType: 0
---

> **"[Inspiring Quote]"**  
> — _[Author]_

![Description](/static/images/featured-image.png)
_Caption describing the image._

## 🌱 [Opening section with emoji]

[Your opening story/context...]

## 🔍 [Main insight section]

- **"[Key point 1]"** — [Explanation]
- **"[Key point 2]"** — [Explanation]

[Your personal reflection...]

## 💡 [Personal application section]

Tôi đã từng:

- [Experience 1]
- [Experience 2]
- [Experience 3]

Nhưng giờ, tôi nhìn lại và thấy: **[Key insight]**

## 📣 [Closing message section]

Tôi viết để nhắc nhở chính mình, và cũng để gửi đến bạn...

> [Key message for readers]

---

**Cảm ơn bạn đã đọc.**  
[Personal closing message]  
**— Phúc**
```

### Personal Journey Post

```mdx
---
title: '[Journey Title] – [What you learned]'
date: '2025-08-30'
tags: ['cau-chuyen', 'tu-hoc']
draft: false
summary: 'Hành trình [describe journey] và những bài học tôi rút ra được'
images: []
postType: 0
---

Chào bạn, mình là **Phúc** — [brief intro context]

## ✨ [Why section]

- **[Reason 1]**: [Explanation]
- **[Reason 2]**: [Explanation]
- **[Reason 3]**: [Explanation]

## 🎯 [Goals/Lessons section]

[Your main content...]

---

[Personal closing message]

Cảm ơn bạn đã đọc đến đây 🙌  
**— Phúc**
```

### Technical Tutorial

```mdx
---
title: 'How to [Do Something] with [Technology]'
date: '2025-08-30'
tags: ['story', 'learning-journey']
draft: false
summary: 'Step-by-step guide to accomplish [goal] using [technology]'
layout: PostLayout
postType: 1
---

In this tutorial, we'll learn how to...

## Prerequisites

## Step 1: Setup

## Step 2: Implementation

## Conclusion
```

### English Personal Story

```mdx
---
title: 'Personal Story Title'
date: '2025-08-30'
tags: ['story', 'life-lessons']
draft: false
summary: 'A brief summary of your personal story and its impact'
images: []
postType: 1
---

Hello, I'm **Phuc** — [brief intro]

## The Story

[Your story content...]

## What I Learned

[Key insights...]

---

**Thanks for reading!**  
**— Phuc**
```

## 🔧 File Naming Convention

Use kebab-case for file names:

- ✅ `my-blog-post.mdx`
- ✅ `advanced-react-patterns.mdx`
- ❌ `My Blog Post.mdx`
- ❌ `advanced_react_patterns.mdx`

This guide should help you create consistent, well-formatted blog posts that integrate seamlessly with your existing blog structure and features.

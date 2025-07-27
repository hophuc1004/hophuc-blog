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
date: '2025-01-26'
tags: ['tag1', 'tag2', 'tag3']
draft: false
summary: 'A brief summary of your blog post content (recommended 150-200 characters)'
images: []
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

- **lastmod**: String (YYYY-MM-DD format) - Last modification date
- **images**: Array - Featured images (first image used as social banner)
- **authors**: Array of strings - Author references (defaults to 'default')
- **layout**: String - Layout component name (see Layout Options)
- **bibliography**: String - Bibliography file reference for citations
- **canonicalUrl**: String - Canonical URL if content exists elsewhere

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

Based on existing tags in your blog:

### Content Type Tags

- `blogging`, `daily-life`, `reflection`, `writings`

### Technology Tags

- `next-js`, `tailwind`, `markdown`, `github`, `ai-tools`

### Language/Tool Tags

- `marktext`, `code`, `math`, `features`

### Language Tags

- `viết-lách` (Vietnamese writing)
- `blog-cá-nhân` (Personal blog)

### Personal Development Tags

- `self-taught`, `career-change`, `learning-journey`, `life-lessons`, `tech-career`, `english-learning`, `personal-growth`, `startup`

### Topic Tags

- `guide`, `holiday`, `canada`, `images`, `ols`

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

### SEO & Social

- [ ] Featured image added if using PostBanner layout
- [ ] Summary is between 150-200 characters
- [ ] Title is under 60 characters for SEO
- [ ] Tags help with discoverability

## 📋 Quick Templates

### Personal Blog Post

```mdx
---
title: 'My Thoughts on [Topic]'
date: '2025-01-26'
tags: ['daily-life', 'reflection', 'personal']
draft: false
summary: 'Personal reflections on [topic] and what I learned'
images: []
---

Today I want to share my thoughts on...

## Background

## Key Insights

## Conclusion
```

### Technical Tutorial

```mdx
---
title: 'How to [Do Something] with [Technology]'
date: '2025-01-26'
tags: ['tutorial', 'technology-name', 'guide']
draft: false
summary: 'Step-by-step guide to accomplish [goal] using [technology]'
layout: PostLayout
---

In this tutorial, we'll learn how to...

## Prerequisites

## Step 1: Setup

## Step 2: Implementation

## Conclusion
```

### Photo Gallery Post

```mdx
---
title: 'Photo Gallery: [Event/Location]'
date: '2025-01-26'
tags: ['photography', 'travel', 'images']
draft: false
summary: 'A visual journey through [location/event] with stunning photographs'
layout: PostBanner
images: ['/static/images/gallery/featured.jpg']
---

A collection of photos from...

## Gallery

<div className="-mx-2 flex flex-wrap overflow-hidden xl:-mx-2">
  <!-- Image gallery code -->
</div>
```

## 🔧 File Naming Convention

Use kebab-case for file names:

- ✅ `my-blog-post.mdx`
- ✅ `advanced-react-patterns.mdx`
- ❌ `My Blog Post.mdx`
- ❌ `advanced_react_patterns.mdx`

This guide should help you create consistent, well-formatted blog posts that integrate seamlessly with your existing blog structure and features.

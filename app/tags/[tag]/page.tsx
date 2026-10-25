import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { getCategoryDisplayLabel } from '@/components/Tag'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

const POSTS_PER_PAGE = 5

const EQUIVALENT_TAG_GROUPS: Record<string, string[]> = {
  'cau-chuyen': ['cau-chuyen', 'story'],
  story: ['cau-chuyen', 'story'],
  'bai-hoc-cuoc-song': ['bai-hoc-cuoc-song', 'life-lessons'],
  'life-lessons': ['bai-hoc-cuoc-song', 'life-lessons'],
}

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const displayTitle = getCategoryDisplayLabel(tag)
  return genPageMetadata({
    title: displayTitle,
    description: `${siteMetadata.title} ${displayTitle} articles`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  return tagKeys.map((tag) => ({
    tag: encodeURI(tag),
  }))
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const title = getCategoryDisplayLabel(tag)
  const matchingSlugs = EQUIVALENT_TAG_GROUPS[tag] || [tag]
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter(
        (post) =>
          post.draft !== true && post.tags && post.tags.some((t) => matchingSlugs.includes(slug(t)))
      )
    )
  )
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}

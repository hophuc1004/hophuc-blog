import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { getCategoryDisplayLabel } from '@/components/Tag'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

const EQUIVALENT_TAG_GROUPS: Record<string, string[]> = {
  'cau-chuyen': ['cau-chuyen', 'story'],
  story: ['cau-chuyen', 'story'],
  'bai-hoc-cuoc-song': ['bai-hoc-cuoc-song', 'life-lessons'],
  'life-lessons': ['bai-hoc-cuoc-song', 'life-lessons'],
}

export async function generateMetadata(props: {
  params: Promise<{ tag: string; page: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const displayTitle = getCategoryDisplayLabel(tag)
  return genPageMetadata({
    title: `${displayTitle} - Page ${params.page}`,
    description: `${siteMetadata.title} ${displayTitle} articles - Page ${params.page}`,
  })
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  return Object.keys(tagCounts).flatMap((tag) => {
    const matchingSlugs = EQUIVALENT_TAG_GROUPS[tag] || [tag]
    const postCount = allBlogs.filter(
      (post) =>
        post.draft !== true && post.tags && post.tags.some((t) => matchingSlugs.includes(slug(t)))
    ).length
    const totalPages = Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE))
    return Array.from({ length: totalPages }, (_, i) => ({
      tag: encodeURI(tag),
      page: (i + 1).toString(),
    }))
  })
}

export default async function TagPage(props: { params: Promise<{ tag: string; page: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const title = getCategoryDisplayLabel(tag)
  const pageNumber = parseInt(params.page)
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

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
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

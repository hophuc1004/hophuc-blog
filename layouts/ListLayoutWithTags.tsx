'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import { allBlogs } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data-english.json'
import vietnameseTagData from 'app/tag-data-vietnamese.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+\/?$/, '') // Remove any trailing /page
    .replace(/\/$/, '') // Remove trailing slash
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()

  // Get tag counts for both languages
  const englishTagCounts = tagData as Record<string, number>
  const vietnameseTagCounts = vietnameseTagData as Record<string, number>

  // Filter posts by language
  const allVietnamesePosts = allBlogs.filter((post) => post.postType === 0)
  const allEnglishPosts = allBlogs.filter((post) => post.postType === 1)

  // Get unique tags for each language
  const englishTags = [...new Set(allEnglishPosts.flatMap((post) => post.tags || []))].sort(
    (a, b) => {
      const slugA = slug(a)
      const slugB = slug(b)
      return (englishTagCounts[slugB] || 0) - (englishTagCounts[slugA] || 0)
    }
  )

  const vietnameseTags = [...new Set(allVietnamesePosts.flatMap((post) => post.tags || []))].sort(
    (a, b) => {
      const slugA = slug(a)
      const slugB = slug(b)
      return (vietnameseTagCounts[slugB] || 0) - (vietnameseTagCounts[slugA] || 0)
    }
  )

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div>
        <div className="pt-6 pb-6">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded-sm bg-gray-50 pt-5 shadow-md sm:flex dark:bg-gray-900/70 dark:shadow-gray-800/40">
            <div className="px-6 py-4">
              {pathname.startsWith('/blog') ? (
                <div className="bg-primary-100 dark:bg-primary-800 border-primary-500 mb-4 rounded-md border-l-4 px-3 py-2">
                  <h3 className="text-primary-700 dark:text-primary-200 font-bold uppercase">
                    All Posts
                  </h3>
                </div>
              ) : (
                <Link
                  href={`/blog`}
                  className="hover:text-primary-500 dark:hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 mb-4 block rounded-md px-3 py-2 font-bold text-gray-700 uppercase transition-colors duration-200 dark:text-gray-300"
                >
                  All Posts
                </Link>
              )}

              {/* English Tags Section */}
              {englishTags.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-primary-600 dark:text-primary-400 mb-2 text-sm font-semibold uppercase">
                    English
                  </h4>
                  <ul>
                    {englishTags.map((t) => {
                      return (
                        <li key={t} className="my-3">
                          {pathname.includes(`/tags/${slug(t)}`) ? (
                            <div className="bg-primary-100 dark:bg-primary-800 border-primary-500 rounded-md border-l-4 px-3 py-2">
                              <h3 className="text-primary-700 dark:text-primary-200 text-sm font-bold uppercase">
                                {`${t} (${englishTagCounts[slug(t)] || 0})`}
                              </h3>
                            </div>
                          ) : (
                            <Link
                              href={`/tags/${slug(t)}`}
                              className="hover:text-primary-500 dark:hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 block rounded-md px-3 py-2 text-sm font-medium text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300"
                              aria-label={`View posts tagged ${t}`}
                            >
                              {`${t} (${englishTagCounts[slug(t)] || 0})`}
                            </Link>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {/* Vietnamese Tags Section */}
              {vietnameseTags.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-primary-600 dark:text-primary-400 mb-2 text-sm font-semibold uppercase">
                    Tiếng Việt
                  </h4>
                  <ul>
                    {vietnameseTags.map((t) => {
                      return (
                        <li key={t} className="my-3">
                          {pathname.includes(`/tags/${slug(t)}`) ? (
                            <div className="bg-primary-100 dark:bg-primary-800 border-primary-500 rounded-md border-l-4 px-3 py-2">
                              <h3 className="text-primary-700 dark:text-primary-200 text-sm font-bold uppercase">
                                {`${t} (${vietnameseTagCounts[slug(t)] || 0})`}
                              </h3>
                            </div>
                          ) : (
                            <Link
                              href={`/tags/${slug(t)}`}
                              className="hover:text-primary-500 dark:hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 block rounded-md px-3 py-2 text-sm font-medium text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300"
                              aria-label={`View posts tagged ${t}`}
                            >
                              {`${t} (${vietnameseTagCounts[slug(t)] || 0})`}
                            </Link>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div>
            <ul>
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags } = post
                return (
                  <li key={path} className="py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, siteMetadata.locale)}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { allCoreContent, sortPosts, CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import { allBlogs } from 'contentlayer/generated'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'

const POSTS_PER_PAGE = 5

type LanguageFilter = 'all' | 'en' | 'vi'

/**
 * Use postType as the single source of truth for language:
 * 0 = Vietnamese ('vi'), 1 = English ('en')
 */
function getPostLanguage(post: CoreContent<Blog> | Blog): 'en' | 'vi' | null {
  if (post.postType === 1) return 'en'
  if (post.postType === 0) return 'vi'
  return null
}

const TAG_DISPLAY_LABELS: Record<string, string> = {
  'cau-chuyen': 'Personal Stories',
  story: 'Personal Stories',
  'bai-hoc-cuoc-song': 'Life Lessons',
  'life-lessons': 'Life Lessons',
}

const EQUIVALENT_TAG_GROUPS: Record<string, string[]> = {
  'cau-chuyen': ['cau-chuyen', 'story'],
  story: ['cau-chuyen', 'story'],
  'bai-hoc-cuoc-song': ['bai-hoc-cuoc-song', 'life-lessons'],
  'life-lessons': ['bai-hoc-cuoc-song', 'life-lessons'],
}

function getCanonicalCategoryKey(tag: string): string {
  const formatted = slug(tag)
  if (formatted === 'story') return 'cau-chuyen'
  if (formatted === 'life-lessons') return 'bai-hoc-cuoc-song'
  return formatted
}

function getCategoryDisplayLabel(tag: string): string {
  const formatted = slug(tag)
  if (TAG_DISPLAY_LABELS[formatted]) {
    return TAG_DISPLAY_LABELS[formatted]
  }
  return formatted
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function postMatchesCategory(post: CoreContent<Blog> | Blog, categoryKey: string): boolean {
  const matchingSlugs = EQUIVALENT_TAG_GROUPS[categoryKey] || [categoryKey]
  return Boolean(post.tags?.some((t) => matchingSlugs.includes(slug(t))))
}

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange?: (page: number) => void
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+\/?$/, '') // Remove any trailing /page
    .replace(/\/$/, '') // Remove trailing slash
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  if (onPageChange) {
    return (
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <nav className="flex justify-between">
          <button
            type="button"
            onClick={() => prevPage && onPageChange(currentPage - 1)}
            disabled={!prevPage}
            className={
              prevPage
                ? 'text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer font-medium'
                : 'cursor-auto disabled:opacity-50'
            }
          >
            Previous
          </button>
          <span>
            {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => nextPage && onPageChange(currentPage + 1)}
            disabled={!nextPage}
            className={
              nextPage
                ? 'text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer font-medium'
                : 'cursor-auto disabled:opacity-50'
            }
          >
            Next
          </button>
        </nav>
      </div>
    )
  }

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

  // Extract initial tag if currently on a /tags/[tag] route
  const rawRouteTag = pathname.startsWith('/tags/')
    ? decodeURI(pathname.split('/')[2] || '') || null
    : null
  const activeRouteCategory = rawRouteTag ? getCanonicalCategoryKey(rawRouteTag) : null

  const [selectedLang, setSelectedLang] = useState<LanguageFilter>('all')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(activeRouteCategory)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [clientPage, setClientPage] = useState(1)

  useEffect(() => {
    setSelectedCategory(activeRouteCategory)
    setHasUserInteracted(false)
    setClientPage(1)
  }, [activeRouteCategory])

  const allPublishedPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.draft !== true))
  )

  const handleResetAll = () => {
    setSelectedLang('all')
    setSelectedCategory(null)
    setHasUserInteracted(true)
    setClientPage(1)
  }

  const handleSelectLang = (lang: LanguageFilter) => {
    setSelectedLang(lang)
    setHasUserInteracted(true)
    setClientPage(1)
  }

  const handleSelectCategory = (categoryKey: string | null) => {
    setSelectedCategory(categoryKey)
    setHasUserInteracted(true)
    setClientPage(1)
  }

  // Global language counts derived from the complete published-post dataset
  const langCounts = {
    all: allPublishedPosts.filter((post) => getPostLanguage(post) !== null).length,
    en: allPublishedPosts.filter((post) => getPostLanguage(post) === 'en').length,
    vi: allPublishedPosts.filter((post) => getPostLanguage(post) === 'vi').length,
  }

  // Discover unique canonical category keys across all published posts
  const allCategories = [
    ...new Set(
      allPublishedPosts.flatMap((post) => (post.tags || []).map((t) => getCanonicalCategoryKey(t)))
    ),
  ]

  // Global category counts derived from the complete published-post dataset
  const categoryCounts: Record<string, number> = {}
  allCategories.forEach((catKey) => {
    categoryCounts[catKey] = allPublishedPosts.filter((post) =>
      postMatchesCategory(post, catKey)
    ).length
  })

  const sortedCategories = [...allCategories].sort(
    (a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0)
  )

  const allCategoriesCount = allPublishedPosts.filter((post) =>
    Boolean(post.tags && post.tags.length > 0)
  ).length

  // Use interactive filtering once the user selects a filter or changes away from route defaults
  const useClientFilter =
    hasUserInteracted || selectedLang !== 'all' || selectedCategory !== activeRouteCategory

  const filteredPosts = allPublishedPosts.filter((post) => {
    const postLang = getPostLanguage(post)
    const matchesLang = selectedLang === 'all' ? postLang !== null : postLang === selectedLang
    const matchesCategory = !selectedCategory || postMatchesCategory(post, selectedCategory)
    return matchesLang && matchesCategory
  })

  const displayPosts = useClientFilter
    ? filteredPosts.slice((clientPage - 1) * POSTS_PER_PAGE, clientPage * POSTS_PER_PAGE)
    : initialDisplayPosts.length > 0
      ? initialDisplayPosts
      : posts

  const activePagination = useClientFilter
    ? {
        currentPage: clientPage,
        totalPages: Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
        onPageChange: setClientPage,
      }
    : pagination

  const isAllPostsActive = selectedLang === 'all' && !selectedCategory
  const isOnBlogRoot = pathname === '/blog' || pathname === '/blog/'

  const languageOptions: { value: LanguageFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All Languages', count: langCounts.all },
    { value: 'en', label: 'English', count: langCounts.en },
    { value: 'vi', label: 'Tiếng Việt', count: langCounts.vi },
  ]

  const categoryOptions: { value: string | null; label: string; count: number }[] = [
    { value: null, label: 'All Categories', count: allCategoriesCount },
    ...sortedCategories.map((catKey) => ({
      value: catKey,
      label: getCategoryDisplayLabel(catKey),
      count: categoryCounts[catKey] || 0,
    })),
  ]

  return (
    <>
      <div>
        <div className="pt-6 pb-6">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
        </div>

        {/* Mobile Filter Controls */}
        <div className="mb-6 space-y-4 rounded-sm bg-gray-50 p-4 shadow-xs sm:hidden dark:bg-gray-900/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Filter Articles
            </span>
            {!isAllPostsActive &&
              (isOnBlogRoot ? (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer text-xs font-semibold"
                >
                  All Posts
                </button>
              ) : (
                <Link
                  href="/blog"
                  onClick={handleResetAll}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-xs font-semibold"
                >
                  All Posts
                </Link>
              ))}
          </div>

          <div>
            <h2 className="text-primary-600 dark:text-primary-400 mb-2 text-xs font-semibold tracking-wider uppercase">
              Language
            </h2>
            <div className="flex flex-wrap gap-2">
              {languageOptions.map((opt) => {
                const active = selectedLang === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectLang(opt.value)}
                    aria-pressed={active}
                    className={
                      active
                        ? 'bg-primary-100 dark:bg-primary-800 border-primary-500 text-primary-700 dark:text-primary-200 cursor-pointer rounded-md border px-2.5 py-1 text-xs font-bold'
                        : 'hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }
                  >
                    {`${opt.label} (${opt.count})`}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <h2 className="text-primary-600 dark:text-primary-400 mb-2 text-xs font-semibold tracking-wider uppercase">
              Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((opt) => {
                const active = selectedCategory === opt.value
                return (
                  <button
                    key={opt.value ?? 'all-categories'}
                    type="button"
                    onClick={() => handleSelectCategory(opt.value)}
                    aria-pressed={active}
                    className={
                      active
                        ? 'bg-primary-100 dark:bg-primary-800 border-primary-500 text-primary-700 dark:text-primary-200 cursor-pointer rounded-md border px-2.5 py-1 text-xs font-bold'
                        : 'hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }
                  >
                    {`${opt.label} (${opt.count})`}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex sm:space-x-24">
          {/* Desktop Sidebar */}
          <div className="hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded-sm bg-gray-50 pt-5 shadow-md sm:flex dark:bg-gray-900/70 dark:shadow-gray-800/40">
            <div className="w-full px-6 py-4">
              {isAllPostsActive && isOnBlogRoot ? (
                <div className="bg-primary-100 dark:bg-primary-800 border-primary-500 mb-4 rounded-md border-l-4 px-3 py-2">
                  <span className="text-primary-700 dark:text-primary-200 block font-bold uppercase">
                    {`All Posts (${allPublishedPosts.length})`}
                  </span>
                </div>
              ) : isOnBlogRoot ? (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="hover:text-primary-500 dark:hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 mb-4 block w-full cursor-pointer rounded-md px-3 py-2 text-left font-bold text-gray-700 uppercase transition-colors duration-200 dark:text-gray-300"
                >
                  {`All Posts (${allPublishedPosts.length})`}
                </button>
              ) : (
                <Link
                  href="/blog"
                  onClick={handleResetAll}
                  className="hover:text-primary-500 dark:hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 mb-4 block rounded-md px-3 py-2 font-bold text-gray-700 uppercase transition-colors duration-200 dark:text-gray-300"
                >
                  {`All Posts (${allPublishedPosts.length})`}
                </Link>
              )}

              {/* Language Filter Group */}
              <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <h2 className="text-primary-600 dark:text-primary-400 mb-2 text-xs font-bold tracking-wider uppercase">
                  Language
                </h2>
                <ul>
                  {languageOptions.map((opt) => {
                    const active = selectedLang === opt.value
                    return (
                      <li key={opt.value} className="my-1.5">
                        <button
                          type="button"
                          onClick={() => handleSelectLang(opt.value)}
                          aria-pressed={active}
                          className={
                            active
                              ? 'bg-primary-100 dark:bg-primary-800 border-primary-500 text-primary-700 dark:text-primary-200 block w-full cursor-pointer rounded-md border-l-4 px-3 py-2 text-left text-sm font-bold'
                              : 'hover:text-primary-500 dark:hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 block w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300'
                          }
                        >
                          {`${opt.label} (${opt.count})`}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Categories Filter Group */}
              {sortedCategories.length > 0 && (
                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <h2 className="text-primary-600 dark:text-primary-400 mb-2 text-xs font-bold tracking-wider uppercase">
                    Categories
                  </h2>
                  <ul>
                    {categoryOptions.map((opt) => {
                      const active = selectedCategory === opt.value
                      return (
                        <li key={opt.value ?? 'all-categories'} className="my-1.5">
                          <button
                            type="button"
                            onClick={() => handleSelectCategory(opt.value)}
                            aria-pressed={active}
                            aria-label={`Filter by category ${opt.label}`}
                            className={
                              active
                                ? 'bg-primary-100 dark:bg-primary-800 border-primary-500 text-primary-700 dark:text-primary-200 block w-full cursor-pointer rounded-md border-l-4 px-3 py-2 text-left text-sm font-bold'
                                : 'hover:text-primary-500 dark:hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 block w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300'
                            }
                          >
                            {`${opt.label} (${opt.count})`}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Article Listing */}
          <div className="w-full min-w-0 flex-1">
            {displayPosts.length === 0 ? (
              <div className="rounded-md border border-gray-200 bg-gray-50/50 px-6 py-12 text-center dark:border-gray-800 dark:bg-gray-900/40">
                <p className="text-base font-medium text-gray-600 dark:text-gray-300">
                  No articles match the selected filters.
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try selecting a different language or category, or view all posts.
                </p>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mt-4 inline-flex cursor-pointer items-center text-sm font-semibold"
                >
                  Reset filters &rarr;
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayPosts.map((post) => {
                  const { path, date, title, summary, tags } = post
                  const postLang = getPostLanguage(post)
                  const langBadgeLabel =
                    postLang === 'en'
                      ? 'EN · English'
                      : postLang === 'vi'
                        ? 'VI · Tiếng Việt'
                        : null

                  return (
                    <li key={path} className="py-6">
                      <article className="flex flex-col space-y-2.5">
                        <dl>
                          <dt className="sr-only">Published on</dt>
                          <dd className="flex flex-wrap items-center gap-2.5 text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                            <time dateTime={date} suppressHydrationWarning>
                              {formatDate(date, siteMetadata.locale)}
                            </time>
                            {langBadgeLabel && (
                              <span
                                aria-label={`Article language: ${langBadgeLabel}`}
                                className="inline-flex items-center rounded border border-gray-200 bg-gray-100/80 px-2 py-0.5 text-xs font-medium text-gray-600 dark:border-gray-700/80 dark:bg-gray-800/80 dark:text-gray-300"
                              >
                                {langBadgeLabel}
                              </span>
                            )}
                          </dd>
                        </dl>
                        <div className="space-y-3">
                          <div>
                            <h2 className="text-2xl leading-8 font-bold tracking-tight break-words">
                              <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                                {title}
                              </Link>
                            </h2>
                            {tags && tags.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                                {tags.map((tag) => {
                                  const tagSlug = slug(tag)
                                  const displayCategory = getCategoryDisplayLabel(tag)
                                  return (
                                    <Link
                                      key={tag}
                                      href={`/tags/${tagSlug}`}
                                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium"
                                    >
                                      {displayCategory}
                                    </Link>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                          <div className="prose max-w-none text-gray-600 dark:text-gray-300">
                            {summary}
                          </div>
                        </div>
                      </article>
                    </li>
                  )
                })}
              </ul>
            )}
            {activePagination && activePagination.totalPages > 1 && (
              <Pagination
                currentPage={activePagination.currentPage}
                totalPages={activePagination.totalPages}
                onPageChange={activePagination.onPageChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

import Link from '@/components/Link'
import Tag, { getCanonicalCategoryKey, getCategoryDisplayLabel } from '@/components/Tag'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const rawTagCounts = tagData as Record<string, number>
  const groupedCounts: Record<string, number> = {}
  Object.entries(rawTagCounts).forEach(([tag, count]) => {
    const canonicalKey = getCanonicalCategoryKey(tag)
    groupedCounts[canonicalKey] = (groupedCounts[canonicalKey] || 0) + count
  })
  const tagKeys = Object.keys(groupedCounts)
  const sortedTags = tagKeys.sort((a, b) => groupedCounts[b] - groupedCounts[a])
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0 dark:divide-gray-700">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
            Tags
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {tagKeys.length === 0 && 'No tags found.'}
          {sortedTags.map((t) => {
            const displayLabel = getCategoryDisplayLabel(t)
            return (
              <div key={t} className="mt-2 mr-5 mb-2">
                <Tag text={t} />
                <Link
                  href={`/tags/${slug(t)}`}
                  className="-ml-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
                  aria-label={`View posts in category ${displayLabel}`}
                >
                  {` (${groupedCounts[t]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

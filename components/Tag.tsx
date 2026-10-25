import Link from 'next/link'
import { slug } from 'github-slugger'

const TAG_DISPLAY_LABELS: Record<string, string> = {
  'cau-chuyen': 'Personal Stories',
  story: 'Personal Stories',
  'bai-hoc-cuoc-song': 'Life Lessons',
  'life-lessons': 'Life Lessons',
}

export function getCanonicalCategoryKey(tag: string): string {
  const formatted = slug(tag)
  if (formatted === 'story') return 'cau-chuyen'
  if (formatted === 'life-lessons') return 'bai-hoc-cuoc-song'
  return formatted
}

export function getCategoryDisplayLabel(tag: string): string {
  const formatted = slug(tag)
  if (TAG_DISPLAY_LABELS[formatted]) {
    return TAG_DISPLAY_LABELS[formatted]
  }
  return formatted
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  const tagSlug = slug(text)
  const displayLabel = getCategoryDisplayLabel(text)
  return (
    <Link
      href={`/tags/${tagSlug}`}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium"
    >
      {displayLabel}
    </Link>
  )
}

export default Tag

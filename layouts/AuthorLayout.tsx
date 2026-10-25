import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, linkedin, github } = content

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-4 pb-5 md:pt-6 md:pb-6">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-12 dark:text-gray-100">
            My Profile
          </h1>
        </div>
        <div className="items-start space-y-4 lg:grid lg:grid-cols-12 lg:gap-x-10 lg:space-y-0">
          <div className="flex flex-col items-center pt-6 pb-2 text-center lg:sticky lg:top-8 lg:col-span-3 lg:py-6">
            {avatar && (
              <Image
                src={avatar}
                alt={name}
                width={176}
                height={176}
                className="h-40 w-40 rounded-full object-cover sm:h-44 sm:w-44"
              />
            )}
            <h2 className="pt-3 pb-1 text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {name}
            </h2>
            {occupation && (
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {occupation}
              </div>
            )}
            {company && (
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{company}</div>
            )}
            <div className="flex items-center space-x-3 pt-4">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none py-5 lg:col-span-9 [&_h2]:mt-5 [&_h2]:mb-2 [&_h2:first-child]:mt-0 [&_hr]:my-4 [&_li]:my-0.5 [&_p]:my-2 [&_ul]:my-1.5 [&.prose]:leading-[1.65]">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

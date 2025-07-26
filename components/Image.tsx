import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH || ''

const Image = ({ src, ...rest }: ImageProps) => {
  // Handle both relative and absolute paths
  const imageSrc =
    typeof src === 'string'
      ? src.startsWith('http') || src.startsWith('data:')
        ? src
        : `${basePath}${src}`
      : src

  return <NextImage src={imageSrc} {...rest} />
}

export default Image

import Image from "next/image"

export function ImagePreview({ src }: { src: string }) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt="Game preview"
        width={400}
        height={400}
        quality={100}
        className="object-cover rounded-xl"
        priority={true}
      />
    </div>
  )
} 
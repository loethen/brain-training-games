import Image from "next/image"

export function ImagePreview({ src }: { src: string }) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt="Game preview"
        fill
        className="object-cover"
      />
    </div>
  )
} 
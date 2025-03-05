import Image from "next/image"

export function ImagePreview({ src }: { src: string }) {
  return (
    <div className="relative w-full aspect-[4/3]">
      <Image
        src={src}
        alt="Game preview"
        fill
        className="object-contain"
        quality={100}
      />
    </div>
  )
} 
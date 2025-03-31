import Image from "next/image"

export function ImagePreview({ src }: { src: string }) {
  return (
    <div className="relative w-full aspect-[4/3]">
      <Image
        src={src}
        alt="Game preview"
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={100}
      />
    </div>
  )
} 
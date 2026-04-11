import Image from "next/image";
import { cn } from "@/lib/utils";

type ImagePreviewProps = {
  src: string;
  alt?: string;
  fit?: "cover" | "contain";
  className?: string;
  aspectClassName?: string;
  imageClassName?: string;
  sizes?: string;
};

export function ImagePreview({
  src,
  alt = "Game preview",
  fit = "cover",
  className,
  aspectClassName = "aspect-4/3",
  imageClassName,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: ImagePreviewProps) {
  return (
    <div className={cn("relative w-full", aspectClassName, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(fit === "contain" ? "object-contain" : "object-cover", imageClassName)}
        sizes={sizes}
        quality={100}
      />
    </div>
  );
}

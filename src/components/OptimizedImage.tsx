"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Image, ImageProps } from "antd";

type OptimizedImageProps = Omit<ImageProps, "src"> & {
  src: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  lazy?: boolean;
};

function getVariantUrls(src: string) {
  if (!src.endsWith(".webp")) {
    return { srcSm: "", srcSet: "" };
  }
  const base = src.replace(/\.webp$/, "");
  const srcSm = `${base}_sm.webp`;
  const srcMd = `${base}_md.webp`;
  const srcSet = `${srcMd} 800w, ${srcSm} 400w`;
  return { srcSm, srcSet };
}

function isLocalPath(src: string) {
  return src.startsWith("/uploads/");
}

export default function OptimizedImage({
  src,
  width,
  height,
  className,
  sizes,
  alt,
  preview,
  style,
  lazy = true,
  ...rest
}: OptimizedImageProps) {
  const [visible, setVisible] = useState(() => !lazy);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const isLocal = isLocalPath(src);
  const { srcSm, srcSet } = isLocal
    ? getVariantUrls(src)
    : { srcSm: "", srcSet: "" };

  const finalSrc = error ? "/mock2.jpg" : src;
  const finalSrcSet = isLocal && srcSet ? srcSet : undefined;

  useEffect(() => {
    if (visible || !lazy) return;

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, lazy]);

  const wrapperStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    ...(width !== undefined && {
      width: typeof width === "number" ? `${width}px` : width,
    }),
    ...(height !== undefined && {
      height: typeof height === "number" ? `${height}px` : height,
    }),
    ...style,
  };

  const showPlaceholder = !loaded && !error && srcSm;

  return (
    <div ref={sentinelRef} style={wrapperStyle} className={className}>
      {showPlaceholder && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${srcSm})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(20px)",
            transform: "scale(1.1)",
            opacity: loaded ? 0 : 1,
            transition: "opacity 0.3s ease-out",
            pointerEvents: "none",
          }}
        />
      )}
      {visible && (
        <Image
          src={finalSrc}
          srcSet={finalSrcSet}
          sizes={sizes}
          alt={alt}
          preview={preview}
          width={width}
          height={height}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease-out",
            display: "block",
            ...style,
          }}
          {...rest}
        />
      )}
    </div>
  );
}

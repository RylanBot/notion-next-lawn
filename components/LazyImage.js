// import { siteConfig } from '@/lib/config'
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

/**
 * 图片懒加载
 * @param {*} param0
 * @returns
 */
export default function LazyImage({
  priority,
  id,
  src,
  alt,
  placeholderSrc,
  className,
  width,
  height,
  title,
  onLoad,
  style
}) {
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const generatePlaceholderURL = (text, width, height) => {
    const minDimension = Math.min(width || 440, height || 320);
    const characterWidth = 0.5;
    const totalCharacterWidth = text.length * characterWidth;
    const fontSize = Math.floor(minDimension / totalCharacterWidth);

    const placeholderText = encodeURIComponent(text);
    const sizeParam = (width && height) ? `${width}x${height}` : (width || (height ? `${height}x${height}` : '440x320'));

    return `https://fakeimg.pl/${sizeParam}/?text=${placeholderText}&font=lobster&font_size=${fontSize}`;
  };

  if (!placeholderSrc) {
    // placeholderSrc = siteConfig('IMG_LAZY_LOAD_PLACEHOLDER');
    placeholderSrc = generatePlaceholderURL("Rylan's Blog", width, height);
  }

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (typeof onLoad === 'function') {
      onLoad();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = src;
            observer.unobserve(lazyImage);
          }
        });
      },
      { rootMargin: '300px 0px' }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [src]);

  const imgProps = {
    ref: imageRef,
    src: imageLoaded ? src : placeholderSrc,
    alt: alt,
    onLoad: handleImageLoad,
    className: imageLoaded ? 'transition-opacity' : 'animate-pulse'
  };

  if (id) {
    imgProps.id = id;
  }

  if (title) {
    imgProps.title = title;
  }

  if (width && width !== 'auto') {
    imgProps.width = width;
  }

  if (height && height !== 'auto') {
    imgProps.height = height;
  }

  if (className) {
    imgProps.className = `${imgProps.className} ${className}`;
  }

  if (style) {
    imgProps.style = style;
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...imgProps} />
      {priority && (
        <Head>
          <link rel='prefetch' as='image' href={src} />
        </Head>
      )}
    </>
  );
}

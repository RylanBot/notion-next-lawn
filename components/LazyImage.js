import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';

import { siteConfig } from '@/lib/config';

/**
 * 图片懒加载
 */
const LazyImage = React.forwardRef(
  ({ priority, id, src, alt, placeholderSrc, className, width, height, title, onLoad, style }, ref) => {
    const maxWidth = siteConfig('IMAGE_COMPRESS_WIDTH');
    const imageRef = ref || useRef(null);

    const [imageLoaded, setImageLoaded] = useState(false);
    const [adjustedSrc, setAdjustedSrc] = useState(placeholderSrc || '');

    if (!placeholderSrc) {
      placeholderSrc = generatePlaceholder(width, height);
    }

    const handleImageLoad = (event) => {
      setImageLoaded(true);
      if (typeof onLoad === 'function') {
        onLoad();
      }
    };

    useEffect(() => {
      const adjustedImageSrc = adjustImgSize(src, maxWidth);
      setAdjustedSrc(adjustedImageSrc);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const lazyImage = entry.target;
              lazyImage.src = adjustedImageSrc;
              // 监听原图加载而不是占位图
              lazyImage.onload = handleImageLoad;
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
      src: imageLoaded ? adjustedSrc : placeholderSrc,
      alt: alt,
      className: imageLoaded ? '' : 'animate-pulse'
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
            <link rel="prefetch" as="image" href={adjustedSrc} />
          </Head>
        )}
      </>
    );
  }
);

/**
 * 根据窗口尺寸决定压缩图片宽度
 * @param {*} src
 * @param {*} maxWidth
 * @returns
 */
const adjustImgSize = (src, maxWidth) => {
  if (!src) {
    return siteConfig('IMG_LAZY_LOAD_PLACEHOLDER');
  }
  const screenWidth = window.screen.width;

  // 屏幕尺寸大于默认图片尺寸，没必要再压缩
  if (screenWidth > maxWidth) {
    return src;
  }

  // 匹配 URL 中的 width 参数
  const widthRegex = /width=\d+/;
  // 匹配 URL 中的 w 参数
  const wRegex = /w=\d+/;

  // 替换 width/w 参数
  return src.replace(widthRegex, `width=${screenWidth}`).replace(wRegex, `w=${screenWidth}`);
};

/**
 * 生成自定义的占位图片
 */
const generatePlaceholder = (width, height) => {
  const text = `${siteConfig('AUTHOR')}'s Blog`;
  const placeholderText = encodeURIComponent(text);

  const minDimension = Math.min(width || 440, height || 320);
  const characterWidth = 0.5;
  const totalCharWidth = text.length * characterWidth;
  const fontSize = Math.floor(minDimension / totalCharWidth);
  const sizeParam = width && height ? `${width}x${height}` : width || (height ? `${height}x${height}` : '440x320');
  return `https://fakeimg.pl/${sizeParam}/?text=${placeholderText}&font=lobster&font_size=${fontSize}`;
};

export default LazyImage;

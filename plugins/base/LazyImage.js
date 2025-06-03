import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';

import { siteConfig } from '@/libs/common/config';

/**
 * 图片懒加载
 */
const LazyImage = React.forwardRef(
  ({ priority, src, placeholderSrc, className, width, height, onLoad, ...props }, ref) => {
    const COMPRESS_WIDTH = siteConfig('IMAGE_COMPRESS_WIDTH');
    const imageRef = ref || useRef(null);

    const [imageLoaded, setImageLoaded] = useState(false);
    const [adjustedSrc, setAdjustedSrc] = useState(placeholderSrc || '');

    if (!placeholderSrc) {
      placeholderSrc = generatePlaceholder(width, height);
    }

    const handleImageLoad = () => {
      setImageLoaded(true);
      if (typeof onLoad === 'function') {
        onLoad();
      }
    };

    const handleImageError = () => {
      if (imageRef.current) {
        imageRef.current.src = placeholderSrc;
      }
    };

    useEffect(() => {
      const adjustedImageSrc = adjustImgSize(src || imageRef.current.src, COMPRESS_WIDTH);
      setAdjustedSrc(adjustedImageSrc);
    
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const lazyImage = new Image();
              lazyImage.src = adjustedImageSrc;
    
              if (lazyImage.complete) {
                handleImageLoad();
              } else {
                lazyImage.onload = () => handleImageLoad();
              }
    
              lazyImage.onerror = handleImageError;
    
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '50px 0px' }
      );
    
      if (imageRef.current) {
        observer.observe(imageRef.current);
      }
    
      // 强制检查图片是否已经加载
      if (imageRef.current && imageRef.current.complete) {
        handleImageLoad();
      }

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && imageRef.current?.complete) {
          handleImageLoad();
        }
      };
    
      document.addEventListener('visibilitychange', handleVisibilityChange);
    
      return () => {
        if (imageRef.current) {
          observer.unobserve(imageRef.current);
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, [src, adjustedSrc]);    

    const imgProps = {
      ref: imageRef,
      src: imageLoaded ? adjustedSrc : placeholderSrc,
      className: imageLoaded ? '' : 'animate-pulse',
      ...props
    };

    if (className) {
      imgProps.className = `${className} ${imgProps.className}`;
    }

    if (width && width !== 'auto') {
      imgProps.width = width;
    }
    if (height && height !== 'auto') {
      imgProps.height = height;
    }

    return (
      <>
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
 */
const adjustImgSize = (src, maxWidth) => {
  if (!src) {
    return generatePlaceholder();
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
const generatePlaceholder = (width = 400, height = 320) => {
  const text = `${siteConfig('AUTHOR')}'s Blog`;
  const placeholderText = encodeURIComponent(text);

  const minDimension = Math.min(width || 400, height || 320);
  const characterWidth = 0.5;
  const totalCharWidth = text.length * characterWidth;
  const fontSize = Math.floor(minDimension / totalCharWidth);
  const sizeParam = width && height ? `${width}x${height}` : width || (height ? `${height}x${height}` : '440x320');
  return `https://fakeimg.ryd.tools/${sizeParam}/?text=${placeholderText}&font=lobster&font_size=${fontSize}`;
};

export default LazyImage;

import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';

import { siteConfig } from '@/libs/common/config';

/**
 * 图片懒加载
 */
const LazyImage = React.forwardRef(
  ({ priority, src, placeholderSrc, className, width, height, onLoad, ...props }, ref) => {
    const COMPRESS_WIDTH = siteConfig('IMAGE_COMPRESS_WIDTH');
    const PLACEHOLDER_TEXT = `${siteConfig('AUTHOR')}'s Blog`;

    const imageRef = ref || useRef(null);

    const [imageLoaded, setImageLoaded] = useState(false);
    const [adjustedSrc, setAdjustedSrc] = useState(placeholderSrc || '');

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

    if (!placeholderSrc) {
      placeholderSrc = generatePlaceholder(PLACEHOLDER_TEXT, width, height);
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
        { rootMargin: '500px 0px' }
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

const generatePlaceholder = (text, width = 400, height = 320) => {
  const BG_COLOR = '#e0e0e0';
  const TEXT_COLOR = '#999999';
  const FONT_FAMILY = 'Times New Roman';
  const CHAR_WIDTH = 0.45;

  const totalCharWidth = text.length * CHAR_WIDTH;
  const minDimension = Math.min(width, height);
  const fontSize = Math.max(14, Math.floor((minDimension / totalCharWidth) * 0.8));

  const escapeXml = (str) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${BG_COLOR}"/>
      <text
        x="50%"
        y="50%"
        font-style="italic"
        font-family="${FONT_FAMILY}"
        font-size="${fontSize}"
        fill="${TEXT_COLOR}"
        text-anchor="middle"
        dominant-baseline="central"
        letter-spacing="2"
      >
        ${escapeXml(text)}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export default LazyImage;

import Head from 'next/head';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { siteConfig } from '@/libs/common/config';

/**
 * 图片懒加载
 * - 真实 src 直接写到 img 上，方便浏览器解析 HTML / 命中缓存
 * - 首屏 / priority 用 eager + preload；其余走原生 loading="lazy"
 * - 已缓存图片在挂载时立刻结束占位态
 */
const LazyImage = React.forwardRef(
  (
    {
      priority,
      src,
      placeholderSrc,
      className,
      width,
      height,
      onLoad,
      fill,
      sizes,
      style,
      blurDataURL,
      loading: loadingProp,
      fetchPriority: fetchPriorityProp,
      // react-notion-x 按 next/image 接口传入，原生 img 用不上，解构掉避免落到 DOM 上
      placeholder: _placeholder,
      unoptimized: _unoptimized,
      ...props
    },
    forwardedRef
  ) => {
    const PLACEHOLDER_TEXT = `${siteConfig('AUTHOR')}'s Blog`;
    const fallbackPlaceholder =
      placeholderSrc || blurDataURL || (fill ? '' : generatePlaceholder(PLACEHOLDER_TEXT, width, height));

    const innerRef = useRef(null);
    const loadedRef = useRef(false);
    const onLoadRef = useRef(onLoad);
    onLoadRef.current = onLoad;

    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    const eager = Boolean(priority) || loadingProp === 'eager';
    const displaySrc = src || fallbackPlaceholder;
    const showPulse = Boolean(src) && !loaded && !failed;

    const setRefs = useCallback(
      (node) => {
        innerRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );

    const markLoaded = useCallback((event) => {
      if (loadedRef.current) return;
      loadedRef.current = true;
      setLoaded(true);
      const handler = onLoadRef.current;
      if (typeof handler === 'function') {
        handler(event || { target: innerRef.current });
      }
    }, []);

    const handleError = () => {
      setFailed(true);
      if (innerRef.current && fallbackPlaceholder) {
        innerRef.current.src = fallbackPlaceholder;
      }
    };

    useEffect(() => {
      loadedRef.current = false;
      setLoaded(false);
      setFailed(false);

      const img = innerRef.current;
      if (img && img.complete && img.naturalWidth > 0) {
        markLoaded({ target: img });
      }
    }, [src, markLoaded]);

    const imgProps = {
      ...props,
      ref: setRefs,
      src: failed ? fallbackPlaceholder || displaySrc : displaySrc,
      className: [className, showPulse ? 'animate-pulse' : ''].filter(Boolean).join(' '),
      decoding: 'async',
      loading: eager ? 'eager' : loadingProp || 'lazy',
      fetchPriority: priority ? 'high' : fetchPriorityProp || 'auto',
      onLoad: markLoaded,
      onError: handleError
    };

    if (fill) {
      imgProps.style = { objectFit: 'cover', width: '100%', height: '100%', ...style };
    } else {
      if (style) {
        imgProps.style = style;
      }
      if (width && width !== 'auto') {
        imgProps.width = width;
      }
      if (height && height !== 'auto') {
        imgProps.height = height;
      }
    }

    if (sizes) {
      imgProps.sizes = sizes;
    }

    return (
      <>
        {priority && isPreloadableSrc(src) && (
          <Head>
            <link rel="preload" as="image" href={src} />
          </Head>
        )}
        <img {...imgProps} />
      </>
    );
  }
);

const isPreloadableSrc = (value) => typeof value === 'string' && value.length > 0 && !value.startsWith('data:');

/**
 * 生成自定义的占位图片
 */
const generatePlaceholder = (text, width = 400, height = 320) => {
  const BG_COLOR = '#e0e0e0';
  const TEXT_COLOR = '#999999';
  const FONT_FAMILY = 'Times New Roman';
  const CHAR_WIDTH = 0.45;

  const totalCharWidth = text?.length * CHAR_WIDTH || 0;
  const minDimension = Math.min(width, height);
  const fontSize = Math.max(14, Math.floor((minDimension / totalCharWidth) * 0.8));

  const escapeXml = (str) =>
    str
      ?.replace(/&/g, '&amp;')
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

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

LazyImage.displayName = 'LazyImage';

export default LazyImage;

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { NotionRenderer } from 'react-notion-x';

import mediumZoom from '@fisch0920/medium-zoom';
import 'katex/dist/katex.min.css';

import { siteConfig } from '@/lib/config';
import { compressImage, mapImgUrl } from '@/lib/notion/mapImage';
import { isBrowser } from '@/lib/utils';

const Code = dynamic(
  () =>
    import('react-notion-x/build/third-party/code').then(async (m) => {
      return m.Code;
    }),
  { ssr: false }
);

const Equation = dynamic(
  () =>
    import('@/components/Equation').then(async (m) => {
      // 化学方程式
      await import('@/lib/mhchem');
      return m.Equation;
    }),
  { ssr: false }
);

const Pdf = dynamic(() => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf), {
  ssr: false
});

const PrismMac = dynamic(() => import('@/components/PrismMac'), {
  ssr: false
});

const TweetEmbed = dynamic(() => import('react-tweet-embed'), {
  ssr: false
});

const Collection = dynamic(() => import('react-notion-x/build/third-party/collection').then((m) => m.Collection), {
  ssr: true
});

const Modal = dynamic(() => import('react-notion-x/build/third-party/modal').then((m) => m.Modal), { ssr: false });

const Tweet = ({ id }) => {
  return <TweetEmbed tweetId={id} />;
};

const NotionPage = ({ post, className }) => {
  const POST_DISABLE_GALLERY_CLICK = siteConfig('POST_DISABLE_GALLERY_CLICK');
  const POST_DISABLE_DATABASE_CLICK = siteConfig('POST_DISABLE_DATABASE_CLICK');

  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    autoScrollToTarget();
  }, []);

  useEffect(() => {
    // 相册视图点击禁止跳转，只能放大查看图片
    if (POST_DISABLE_GALLERY_CLICK) {
      // 针对页面中的gallery视图，点击后是放大图片还是跳转到gallery的内部页面
      processGalleryImg(zoomRef?.current);
    }

    // 页内数据库点击禁止跳转，只能查看
    if (POST_DISABLE_DATABASE_CLICK) {
      processDisableDatabaseUrl();
    }

    /**
     * 放大查看图片时替换成高清图像
     */
    const observer = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (mutation.target.classList.contains('medium-zoom-image--opened')) {
            // 等待动画完成后替换为更高清的图像
            setTimeout(() => {
              // 获取该元素的 src 属性
              const src = mutation?.target?.getAttribute('src');
              //   替换为更高清的图像
              mutation?.target?.setAttribute('src', compressImage(src, siteConfig('IMAGE_ZOOM_IN_WIDTH', 1200)));
            }, 800);
          }
        }
      });
    });

    // 监视页面元素和属性变化
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    });

    return () => {
      observer.disconnect();
    };
  }, [post]);

  const zoom =
    isBrowser &&
    mediumZoom({
      container: '.notion-viewport',
      background: 'rgba(0, 0, 0, 0.2)',
      margin: getMediumZoomMargin()
    });
  const zoomRef = useRef(zoom ? zoom.clone() : null);

  useEffect(() => {
    // 将相册gallery下的图片加入放大功能
    if (siteConfig('POST_DISABLE_GALLERY_CLICK')) {
      setTimeout(() => {
        if (isBrowser) {
          const imgList = document?.querySelectorAll('.notion-collection-card-cover img');
          if (imgList && zoomRef.current) {
            for (let i = 0; i < imgList.length; i++) {
              zoomRef.current.attach(imgList[i]);
            }
          }

          const cards = document.getElementsByClassName('notion-collection-card');
          for (const e of cards) {
            e.removeAttribute('href');
          }
        }
      }, 800);
    }

    /**
     * 处理页面内连接跳转
     * 如果链接就是当前网站，则不打开新窗口访问
     */
    if (isBrowser) {
      const currentURL = window.location.origin + window.location.pathname;
      const allAnchorTags = document.getElementsByTagName('a'); // 或者使用 document.querySelectorAll('a') 获取 NodeList
      for (const anchorTag of allAnchorTags) {
        if (anchorTag?.target === '_blank') {
          const hrefWithoutQueryHash = anchorTag.href.split('?')[0].split('#')[0];
          const hrefWithRelativeHash = currentURL.split('#')[0] + anchorTag.href.split('#')[1];

          if (currentURL === hrefWithoutQueryHash || currentURL === hrefWithRelativeHash) {
            anchorTag.target = '_self';
          }
        }
      }
    }
  }, []);

  if (!post || !post.blockMap) {
    return <>{post?.summary || ''}</>;
  }

  return (
    <div
      id="notion-article"
      className={`mx-auto overflow-hidden transition duration-100 ease-in-out ${
        !showCode ? 'opacity-0' : 'opacity-100'
      } ${className || ''}`}
    >
      <NotionRenderer
        recordMap={post.blockMap}
        mapPageUrl={mapPageUrl}
        mapImageUrl={mapImgUrl}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          Tweet
        }}
      />

      <PrismMac onLoad={() => setShowCode(true)} />
    </div>
  );
};

/**
 * 页面的数据库链接禁止跳转，只能查看
 */
const processDisableDatabaseUrl = () => {
  if (isBrowser) {
    const links = document.querySelectorAll('.notion-table .notion-page-link');
    links.forEach((link) => link.removeAttribute('href'));
  }
};

/**
 * gallery视图，点击后是放大图片还是跳转到gallery的内部页面
 */
const processGalleryImg = (zoom) => {
  setTimeout(() => {
    if (isBrowser) {
      const imgList = document?.querySelectorAll('.notion-collection-card-cover img');
      if (imgList && zoom) {
        for (let i = 0; i < imgList.length; i++) {
          zoom.attach(imgList[i]);
        }
      }

      const cards = document.getElementsByClassName('notion-collection-card');
      for (const e of cards) {
        e.removeAttribute('href');
      }
    }
  }, 800);
};

/**
 * 根据url参数自动滚动到指定区域
 */
const autoScrollToTarget = () => {
  setTimeout(() => {
    // 跳转到指定标题
    const needToJumpToTitle = window.location.hash;
    if (needToJumpToTitle) {
      const tocNode = document.getElementById(window.location.hash.substring(1));
      if (tocNode && tocNode?.className?.indexOf('notion') > -1) {
        tocNode.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }
  }, 180);
};

/**
 * 将id映射成博文内部链接。
 */
const mapPageUrl = (id) => {
  // return 'https://www.notion.so/' + id.replace(/-/g, '')
  return '/' + id.replace(/-/g, '');
};

/**
 * 缩放
 * @returns
 */
function getMediumZoomMargin() {
  const width = window.innerWidth;
  if (width < 500) {
    return 8;
  } else if (width < 800) {
    return 20;
  } else if (width < 1280) {
    return 30;
  } else if (width < 1600) {
    return 40;
  } else if (width < 1920) {
    return 48;
  } else {
    return 72;
  }
}
export default NotionPage;

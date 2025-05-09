import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { isBrowser, NotionRenderer } from 'react-notion-x';

import mediumZoom from '@fisch0920/medium-zoom';
import 'katex/dist/katex.min.css';

import usePrism from '@/hooks/usePrism';

import { siteConfig } from '@/libs/common/config';
import { compressImage, mapImgUrl } from '@/libs/notion/image';
import { mapPageUrl } from '@/libs/notion/page';

const Code = dynamic(
  () =>
    import('react-notion-x/build/third-party/code').then(async (m) => {
      return m.Code;
    }),
  { ssr: false }
);

const Equation = dynamic(() => import('react-notion-x/build/third-party/equation').then((m) => m.Equation), {
  ssr: false
});

const Pdf = dynamic(() => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf), {
  ssr: false
});

const Collection = dynamic(() => import('react-notion-x/build/third-party/collection').then((m) => m.Collection), {
  ssr: true
});

const Modal = dynamic(() => import('react-notion-x/build/third-party/modal').then((m) => m.Modal), { ssr: false });

const NotionPage = ({ post, className }) => {
  const POST_DISABLE_GALLERY_CLICK = siteConfig('POST_DISABLE_GALLERY_CLICK');
  const POST_DISABLE_DATABASE_CLICK = siteConfig('POST_DISABLE_DATABASE_CLICK');

  const zoom =
    isBrowser &&
    mediumZoom({
      container: '.notion-viewport',
      background: 'rgba(0, 0, 0, 0.2)',
      margin: getMediumZoomMargin()
    });
  const zoomRef = useRef(zoom ? zoom.clone() : null);

  useEffect(() => {
    autoScrollToTarget();
  }, []);

  useEffect(() => {
    if (POST_DISABLE_GALLERY_CLICK) {
      disableGalleryImg(zoomRef?.current);
    }

    if (POST_DISABLE_DATABASE_CLICK) {
      disableDatabaseUrl();
    }
  }, [post]);

  useEffect(() => {
    // 放大查看图片时替换成高清图像
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (mutation.target.classList.contains('medium-zoom-image--opened')) {
            setTimeout(() => {
              const src = mutation?.target?.getAttribute('src');
              mutation?.target?.setAttribute('src', compressImage(src, siteConfig('IMAGE_ZOOM_IN_WIDTH', 1200)));
            }, 800);
          }
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    });

    return () => {
      observer.disconnect();
    };
  }, [post]);

  useEffect(() => {
    // 如果链接就是当前网站，则不打开新窗口访问
    if (isBrowser) {
      const currentURL = window.location.origin + window.location.pathname;
      const allAnchorTags = document.getElementsByTagName('a');
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

  usePrism();

  if (!post?.blockMap) return <>{post?.summary || ''}</>;

  return (
    <>
      <div
        id="notion-article"
        className={`mx-auto overflow-hidden transition duration-100 ease-in-out ${className || ''}`}
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
            Pdf
          }}
        />
      </div>
    </>
  );
};

export default NotionPage;

/**
 * 数据库视图，禁止跳转到内部页面
 */
const disableDatabaseUrl = () => {
  setTimeout(() => {
    if (isBrowser) {
      const links = document.querySelectorAll('.notion-table .notion-page-link');
      links.forEach((link) => link.removeAttribute('href'));
    }
  }, 800);
};

/**
 * Gallery 视图，禁用跳转到内部页面，点击后放大图片
 */
const disableGalleryImg = (zoom) => {
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
 * 根据 url 参数自动滚动到指定区域
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
 * 缩放
 */
const getMediumZoomMargin = () => {
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
};

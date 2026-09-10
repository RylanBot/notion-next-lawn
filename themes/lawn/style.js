/**
 * 主题定制化 css
 * 这里的样式只对当前主题生效
 */
export const Style = () => {
  return (
    <style jsx global>
      {`
        * {
          scrollbar-width: thin;
          scrollbar-color: #2fb596 transparent;
        }

        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background-color: #5ae9c7;
        }

        :root {
          --lawn-bg: #fafaf9;
          --lawn-header: #e7e5e4;
          --lawn-grid-line: rgba(24, 24, 27, 0.08);
          /* 封面饱和度普遍偏高，统一压到站点的低饱和调性 */
          --lawn-cover-filter: saturate(0.62) brightness(1.07) contrast(0.94);
          --lawn-wash-filter: blur(48px) saturate(0.7) brightness(1.12);
        }

        .dark {
          --lawn-bg: #18181b;
          --lawn-header: #09090b;
          --lawn-grid-line: rgba(255, 255, 255, 0.07);
          --lawn-cover-filter: saturate(0.62) brightness(0.8) contrast(0.98);
          /* 压暗时彩度会被压掉，适度补回来才不会变成深灰 */
          --lawn-wash-filter: blur(48px) saturate(1.25) brightness(0.56);
        }

        body {
          background-color: var(--lawn-bg);
        }

        .lawn-header-cover {
          -webkit-mask-image: linear-gradient(to bottom, #000 45%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 45%, transparent 100%);
        }

        .lawn-header-fade {
          background: linear-gradient(to bottom, transparent, var(--lawn-bg));
        }

        .lawn-card-wash-img {
          transform: scale(1.25);
          -webkit-filter: var(--lawn-wash-filter);
          filter: var(--lawn-wash-filter);
        }

        .lawn-card-wash::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            color-mix(in srgb, var(--lawn-bg) 8%, transparent) 0%,
            color-mix(in srgb, var(--lawn-bg) 14%, transparent) 20%,
            color-mix(in srgb, var(--lawn-bg) 24%, transparent) 34%,
            color-mix(in srgb, var(--lawn-bg) 34%, transparent) 48%,
            color-mix(in srgb, var(--lawn-bg) 42%, transparent) 64%,
            color-mix(in srgb, var(--lawn-bg) 47%, transparent) 82%,
            color-mix(in srgb, var(--lawn-bg) 50%, transparent) 100%
          );
        }

        /* 暗色下底色保持均匀，过渡只交给封面淡出，避免两条渐变叠出色带 */
        .dark .lawn-card-wash::after {
          background: linear-gradient(
            to bottom,
            color-mix(in srgb, var(--lawn-bg) 8%, transparent) 0%,
            color-mix(in srgb, var(--lawn-bg) 12%, transparent) 55%,
            color-mix(in srgb, var(--lawn-bg) 18%, transparent) 100%
          );
        }

        /* 只虚化下沿，曲线用两端斜率为零的 smoothstep，避免首尾留下折点 */
        .lawn-card-cover-img {
          -webkit-filter: var(--lawn-cover-filter);
          filter: var(--lawn-cover-filter);
          -webkit-mask-image: linear-gradient(
            to bottom,
            #000 62%,
            rgba(0, 0, 0, 0.972) 65.6%,
            rgba(0, 0, 0, 0.896) 69.2%,
            rgba(0, 0, 0, 0.784) 72.8%,
            rgba(0, 0, 0, 0.648) 76.4%,
            rgba(0, 0, 0, 0.5) 80%,
            rgba(0, 0, 0, 0.352) 83.6%,
            rgba(0, 0, 0, 0.216) 87.2%,
            rgba(0, 0, 0, 0.104) 90.8%,
            rgba(0, 0, 0, 0.028) 94.4%,
            transparent 98%
          );
          mask-image: linear-gradient(
            to bottom,
            #000 62%,
            rgba(0, 0, 0, 0.972) 65.6%,
            rgba(0, 0, 0, 0.896) 69.2%,
            rgba(0, 0, 0, 0.784) 72.8%,
            rgba(0, 0, 0, 0.648) 76.4%,
            rgba(0, 0, 0, 0.5) 80%,
            rgba(0, 0, 0, 0.352) 83.6%,
            rgba(0, 0, 0, 0.216) 87.2%,
            rgba(0, 0, 0, 0.104) 90.8%,
            rgba(0, 0, 0, 0.028) 94.4%,
            transparent 98%
          );
        }

        .lawn-article-page {
          position: relative;
          background-color: var(--lawn-bg);
          background-image:
            linear-gradient(var(--lawn-grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--lawn-grid-line) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .lawn-article-page::before {
          content: '';
          position: absolute;
          inset: 0 0 auto;
          height: 12rem;
          background: linear-gradient(to bottom, var(--lawn-bg) 15%, transparent);
          pointer-events: none;
          z-index: 1;
        }

        .lawn-article-page > * {
          position: relative;
          z-index: 2;
        }

        #theme-lawn .menu-title {
          font-weight: 500;
        }

        #home-living-index {
          --notion-red_background: color-mix(in srgb, var(--notion-red) 22%, #f5f5f4);
          --notion-pink_background: color-mix(in srgb, var(--notion-pink) 22%, #f5f5f4);
          --notion-blue_background: color-mix(in srgb, var(--notion-blue) 22%, #f5f5f4);
          --notion-purple_background: color-mix(in srgb, var(--notion-purple) 22%, #f5f5f4);
          --notion-teal_background: color-mix(in srgb, var(--notion-teal) 22%, #f5f5f4);
          --notion-yellow_background: color-mix(in srgb, var(--notion-yellow) 22%, #f5f5f4);
          --notion-orange_background: color-mix(in srgb, var(--notion-orange) 22%, #f5f5f4);
          --notion-brown_background: color-mix(in srgb, var(--notion-brown) 22%, #f5f5f4);
          --notion-gray_background: color-mix(in srgb, var(--notion-gray) 18%, #f5f5f4);
          --notion-green_background: color-mix(in srgb, var(--notion-green) 22%, #f5f5f4);
          --notion-default_background: color-mix(in srgb, var(--notion-gray) 16%, #f5f5f4);
        }

        #home-living-index [class*='notion-'][class*='_background'] {
          border-color: #134e4a !important;
        }

        #lawn-article-wrapper .notion-header-anchor {
          top: -88px;
        }

        .lawn-archive-rail {
          height: 1px;
          color: #134e4a;
          background-image: repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 12px);
          background-size: 24px 1px;
          background-repeat: repeat-x;
          opacity: 0.55;
          animation: lawn-archive-dash 1.1s linear infinite;
        }

        .dark .lawn-archive-rail {
          color: #2dd4bf;
        }

        @keyframes lawn-archive-dash {
          to {
            background-position: 24px 0;
          }
        }

        .lawn-tag-field {
          animation: lawn-tag-field-breath 8s ease-in-out infinite;
        }

        .lawn-tag-chip {
          animation: lawn-tag-drift ease-in-out infinite;
          transition:
            transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.35s;
        }

        .lawn-tag-chip:nth-child(8n + 1) {
          animation-duration: 7s;
        }
        .lawn-tag-chip:nth-child(8n + 2) {
          animation-duration: 9s;
        }
        .lawn-tag-chip:nth-child(8n + 3) {
          animation-duration: 6s;
        }
        .lawn-tag-chip:nth-child(8n + 4) {
          animation-duration: 10s;
        }
        .lawn-tag-chip:nth-child(8n + 5) {
          animation-duration: 8s;
        }
        .lawn-tag-chip:nth-child(8n + 6) {
          animation-duration: 11s;
        }
        .lawn-tag-chip:nth-child(8n + 7) {
          animation-duration: 7.5s;
        }
        .lawn-tag-chip:nth-child(8n + 8) {
          animation-duration: 9.5s;
        }

        @keyframes lawn-tag-drift {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(2px, -4px) rotate(0.4deg);
          }
          50% {
            transform: translate(-3px, -7px) rotate(-0.5deg);
          }
          75% {
            transform: translate(3px, -3px) rotate(0.3deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }

        @keyframes lawn-tag-field-breath {
          0%,
          100% {
            filter: drop-shadow(0 0 8px rgba(15, 118, 110, 0.08));
          }
          50% {
            filter: drop-shadow(0 0 18px rgba(15, 118, 110, 0.18));
          }
        }

        .lawn-card-dot,
        .lawn-card-blob {
          animation: lawn-card-dot-drift ease-in-out infinite;
          will-change: transform;
        }

        .lawn-card-dot:nth-child(1),
        .lawn-card-blob:nth-child(1) {
          animation-duration: 7s;
        }
        .lawn-card-dot:nth-child(2),
        .lawn-card-blob:nth-child(2) {
          animation-duration: 9.5s;
        }
        .lawn-card-dot:nth-child(3),
        .lawn-card-blob:nth-child(3) {
          animation-duration: 6.5s;
        }
        .lawn-card-dot:nth-child(4),
        .lawn-card-blob:nth-child(4) {
          animation-duration: 10s;
        }
        .lawn-card-dot:nth-child(5),
        .lawn-card-blob:nth-child(5) {
          animation-duration: 8s;
        }
        .lawn-card-dot:nth-child(6),
        .lawn-card-blob:nth-child(6) {
          animation-duration: 11s;
        }

        .lawn-card-blob {
          animation-name: lawn-card-blob-drift;
        }

        @keyframes lawn-card-dot-drift {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(3px, -5px) scale(1.08);
          }
          50% {
            transform: translate(-4px, -8px) scale(0.94);
          }
          75% {
            transform: translate(5px, -3px) scale(1.04);
          }
        }

        @keyframes lawn-card-blob-drift {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(10px, -12px) scale(1.06);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lawn-archive-rail,
          .lawn-tag-chip,
          .lawn-tag-field,
          .lawn-card-dot,
          .lawn-card-blob {
            animation: none;
          }
        }
      `}
    </style>
  );
};

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
        }

        .dark {
          --lawn-bg: #18181b;
          --lawn-header: #09090b;
          --lawn-grid-line: rgba(255, 255, 255, 0.07);
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

        .lawn-orbit-ring-base {
          stroke: currentColor;
          stroke-width: 0.28;
          opacity: 0.16;
        }

        .lawn-orbit-ring-core {
          opacity: 0.22;
        }

        .lawn-orbit-ring-path {
          stroke: currentColor;
          stroke-width: 0.32;
          opacity: 0.38;
          stroke-dasharray: 1.6 2.2 0.6 2.8;
          animation: lawn-orbit-dash 22s linear infinite;
        }

        .lawn-orbit-ring-path-inner {
          opacity: 0.32;
          animation-duration: 28s;
          animation-direction: reverse;
        }

        .lawn-orbit-comet {
          stroke: #0f766e;
          stroke-width: 0.95;
          stroke-linecap: round;
          opacity: 0.8;
          stroke-dasharray: 16 210;
          animation: lawn-orbit-dash 9s linear infinite;
        }

        .lawn-orbit-comet-inner {
          stroke-dasharray: 11 165;
          animation-duration: 12s;
          animation-direction: reverse;
        }

        .dark .lawn-orbit-comet {
          stroke: #5eead4;
        }

        .lawn-orbit-tick {
          stroke: currentColor;
          stroke-width: 0.28;
          opacity: 0.28;
        }

        .lawn-orbit-tick-major {
          stroke-width: 0.4;
          opacity: 0.45;
        }

        .lawn-orbit-axis {
          stroke: currentColor;
          stroke-width: 0.32;
          stroke-linecap: round;
          opacity: 0.28;
        }

        @keyframes lawn-orbit-dash {
          to {
            stroke-dashoffset: -226;
          }
        }

        .lawn-orbit-sat,
        .lawn-orbit-dot {
          position: absolute;
          top: 0;
          left: 0;
          offset-anchor: center;
          offset-rotate: 0deg;
          offset-distance: var(--orbit-start, 0%);
        }

        .lawn-orbit-sat {
          z-index: 2;
          width: max-content;
        }

        .lawn-orbit-sat:hover {
          z-index: 5;
        }

        .lawn-orbit-sat-outer,
        .lawn-orbit-dot-outer {
          offset-path: ellipse(44% 32% at 50% 50%);
        }

        .lawn-orbit-sat-inner,
        .lawn-orbit-dot-inner {
          offset-path: ellipse(30% 22% at 50% 50%);
        }

        .lawn-orbit-dot-core {
          offset-path: ellipse(16% 11.6% at 50% 50%);
        }

        .lawn-orbit-dot {
          z-index: 1;
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: currentColor;
          opacity: 0.55;
          pointer-events: none;
        }

        .lawn-orbit-dot-hollow {
          width: 7px;
          height: 7px;
          background: transparent;
          box-shadow: inset 0 0 0 1.4px currentColor;
          opacity: 0.6;
        }

        .lawn-orbit-dot-planet {
          width: 8px;
          height: 8px;
          background: #0f766e;
          opacity: 0.9;
          box-shadow: 0 0 0 3px rgb(15 118 110 / 0.14);
        }

        .dark .lawn-orbit-dot-planet {
          background: #5eead4;
          box-shadow: 0 0 0 3px rgb(94 234 212 / 0.16);
        }

        .lawn-orbit-dot-outer {
          animation: lawn-orbit-travel 20s linear infinite;
        }

        .lawn-orbit-dot-inner {
          animation: lawn-orbit-travel-reverse 15s linear infinite;
        }

        .lawn-orbit-dot-core {
          animation: lawn-orbit-travel 11s linear infinite;
        }

        @keyframes lawn-orbit-travel {
          from {
            offset-distance: var(--orbit-start, 0%);
          }
          to {
            offset-distance: calc(var(--orbit-start, 0%) + 100%);
          }
        }

        @keyframes lawn-orbit-travel-reverse {
          from {
            offset-distance: var(--orbit-start, 0%);
          }
          to {
            offset-distance: calc(var(--orbit-start, 0%) - 100%);
          }
        }

        .lawn-orbit:hover .lawn-orbit-dot,
        .lawn-orbit:hover .lawn-orbit-ring-path,
        .lawn-orbit:hover .lawn-orbit-comet {
          animation-play-state: paused;
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
          .lawn-orbit-sat,
          .lawn-orbit-dot,
          .lawn-orbit-ring-path,
          .lawn-orbit-comet,
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

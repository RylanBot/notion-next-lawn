'use client';

import { isBrowser } from 'react-notion-x';

/**
 * 自定义外部 script
 * 传入参数将转为 <script>标签
 */
const ExternalScript = (props) => {
  const { src } = props;
  if (!isBrowser || !src) return null;

  const element = document.querySelector(`script[src="${src}"]`);
  if (element) return null;

  const script = document.createElement('script');
  Object.entries(props).forEach(([key, value]) => {
    script.setAttribute(key, value);
  });
  document.head.appendChild(script);
  console.log('加载外部脚本', props, script);
  return null;
};

export default ExternalScript;

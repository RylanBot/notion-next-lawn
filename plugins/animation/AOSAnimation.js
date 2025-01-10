import AOS from 'aos';
import { isBrowser } from 'react-notion-x';

/**
 * 加载滚动动画
 * @see https://michalsnik.github.io/aos/
 */
const AOSAnimation = () => {
  if (isBrowser) {
    AOS.init();
  }
};

export default AOSAnimation;

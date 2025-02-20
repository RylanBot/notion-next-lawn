import useGlobal from '@/hooks/useGlobal';
import { useRouter } from 'next/router';

/**
 * 随机跳转到一个文章
 */
export default function ButtonRandomPost(props) {
  const { allNavPages } = props;
  const router = useRouter();
  const { locale } = useGlobal();

  function handleWalkAround() {
    const slugs = allNavPages.map((page) => page.slug);
    const randomIndex = Math.floor(Math.random() * slugs.length);
    router.push(`/${slugs[randomIndex]}`);
  }

  return (
    <div className="group right-float-tooltip-parent">
      <i onClick={handleWalkAround} className="fa-solid fa-podcast text-xs"></i>
      <span className="right-float-tooltip -left-4">{locale.MENU.WALK_AROUND}</span>
    </div>
  );
}

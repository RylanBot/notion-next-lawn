import { useRouter } from 'next/router';
import useGlobal from '@/hooks/useGlobal';

export default function FloatRandomPostButton(props) {
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
      <i className="fa-solid fa-podcast text-xs" onClick={handleWalkAround}></i>
      <span className="right-float-tooltip -left-4">{locale.MENU.WALK_AROUND}</span>
    </div>
  );
}

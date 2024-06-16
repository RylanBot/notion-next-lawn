import { useGlobal } from '@/hooks/useGlobal';

/**
 * 随机跳转到一个文章
 */
export default function ButtonRandomPost(props) {
  const { allNavPages } = props
  const { locale } = useGlobal()

  function handleWalkAround() {
    const slugs = allNavPages.map(page => page.slug)
    const randomIndex = Math.floor(Math.random() * slugs.length)
    window.location.href = `/${slugs[randomIndex]}`;
  }

  return (
    <div className='group right-float-tooltip-parent'
      onClick={handleWalkAround}
    >
      <i className='fa-solid fa-podcast text-xs'></i>
      <span className='right-float-tooltip -left-4'>
        {locale.MENU.WALK_AROUND}
      </span>
    </div>
  )
}

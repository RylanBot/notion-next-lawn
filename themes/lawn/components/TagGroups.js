import { useRouter } from 'next/router';

import { useGlobal } from '@/hooks/useGlobal';
import Card from './Card';
import TagItemMini from './TagItemMini';

/**
 * 标签组
 */
const TagGroups = () => {
  const { tagOptions, locale } = useGlobal();

  const router = useRouter();
  const currentTag = router.query.tag;

  if (!tagOptions) return;

  return (
    <Card className="my-4">
      <div id="tags-group" className="dark:border-gray-600 space-y-2">
        <div className="ml-2 mb-1 ">
          <i className="fas fa-tag" /> {locale.COMMON.TAGS}
        </div>
        <div className="px-4">
          {tagOptions.map((tag) => {
            const selected = currentTag === tag.name;
            return <TagItemMini key={tag.name} tag={tag} selected={selected} />;
          })}
        </div>
      </div>
    </Card>
  );
};

export default TagGroups;

import { useRouter } from 'next/router';

import useGlobal from '@/hooks/useGlobal';
import { formatNameToSlug } from '@/libs/common/util';

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
      <div className="dark:border-gray-600 space-y-2">
        <div className="ml-2 mb-1 ">
          <i className="fas fa-tag" /> {locale.COMMON.TAGS}
        </div>
        <div className="px-4">
          {tagOptions.map((tag) => {
            return <TagItemMini key={tag.name} tag={tag} selected={currentTag === formatNameToSlug(tag.name)} />;
          })}
        </div>
      </div>
    </Card>
  );
};

export default TagGroups;

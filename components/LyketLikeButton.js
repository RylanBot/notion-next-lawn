import { siteConfig } from '@/lib/config';
import { LikeButton, Provider as LyketProvider } from '@lyket/react';

const LyketLikeButton = ({ id }) => {
  const LYKET_LIKE_BUTTON = siteConfig('LYKET_LIKE_BUTTON')
  const LYKET_LIKE_ID = siteConfig('LYKET_LIKE_ID')

  if (!LYKET_LIKE_BUTTON && !LYKET_LIKE_ID) return null;

  return (
    <LyketProvider
      apiKey={siteConfig('LYKET_LIKE_ID')}
      theme={{
        colors: {
          background: '#f5f2f9',
          primary: '#d6f4d6'
        }
      }}
    >
      <div className="flex justify-center my-4 font-sans">
        <LikeButton
          id={id}
          namespace="post"
          hideCounterIfLessThan={1}
        />
      </div>
    </LyketProvider>
  );
};

export default LyketLikeButton;

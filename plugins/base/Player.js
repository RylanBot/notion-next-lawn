import { useEffect, useRef, useState } from 'react';

import { siteConfig } from '@/libs/common/config';
import { loadExternalResource } from '@/libs/common/util';

/**
 * 音乐播放器
 */
const Player = () => {
  const [player, setPlayer] = useState();
  const ref = useRef(null);

  const MUSIC_PLAYER_LRC_TYPE = JSON.parse(siteConfig('MUSIC_PLAYER_LRC_TYPE'));
  const MUSIC_PLAYER_VISIBLE = JSON.parse(siteConfig('MUSIC_PLAYER_VISIBLE'));
  const MUSIC_PLAYER_AUTO_PLAY = JSON.parse(siteConfig('MUSIC_PLAYER_AUTO_PLAY'));
  const MUSIC_PLAYER_METING = JSON.parse(siteConfig('MUSIC_PLAYER_METING'));
  const MUSIC_PLAYER_ORDER = siteConfig('MUSIC_PLAYER_ORDER');
  const MUSIC_PLAYER_AUDIO_LIST = siteConfig('MUSIC_PLAYER_AUDIO_LIST');
  const MUSIC_PLAYER = siteConfig('MUSIC_PLAYER');
  const MUSIC_PLAYER_CDN = siteConfig('MUSIC_PLAYER_CDN_URL');

  const METING_ENABLE = siteConfig('MUSIC_PLAYER_METING');
  const METING_ID = siteConfig('MUSIC_PLAYER_METING_ID');
  const METING_CDN = siteConfig( 'MUSIC_PLAYER_METING_CDN_URL', 'https://cdnjs.cloudflare.com/ajax/libs/meting/2.0.1/Meting.min.js');
  const METING_LRC_TYPE = siteConfig('MUSIC_PLAYER_METING_LRC_TYPE');
  const METING_SERVER = siteConfig('MUSIC_PLAYER_METING_SERVER');

  const initMusicPlayer = async () => {
    if (!MUSIC_PLAYER) {
      return;
    }
    try {
      await loadExternalResource(MUSIC_PLAYER_CDN, 'js');
    } catch (error) {
      console.error('音乐组件异常', error);
    }

    if (METING_ENABLE) {
      await loadExternalResource(METING_CDN, 'js');
    }

    if (!MUSIC_PLAYER_METING && window.APlayer) {
      setPlayer(
        new window.APlayer({
          container: ref.current,
          fixed: true,
          lrcType: MUSIC_PLAYER_LRC_TYPE,
          autoplay: MUSIC_PLAYER_AUTO_PLAY,
          order: MUSIC_PLAYER_ORDER,
          audio: MUSIC_PLAYER_AUDIO_LIST
        })
      );
    }
  };

  useEffect(() => {
    initMusicPlayer();
    return () => {
      setPlayer(undefined);
    };
  }, []);

  return (
    <div className={MUSIC_PLAYER_VISIBLE ? 'visible' : 'invisible'}>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/aplayer/1.10.1/APlayer.min.css"
      />
      {MUSIC_PLAYER_METING ? (
        <meting-js
          fixed="true"
          type="playlist"
          prefetch="auto"
          lrc-type={METING_LRC_TYPE}
          autoplay={MUSIC_PLAYER_AUTO_PLAY}
          order={MUSIC_PLAYER_ORDER}
          server={METING_SERVER}
          id={METING_ID}
        />
      ) : (
        <div ref={ref} data-player={player} />
      )}
    </div>
  );
};

export default Player;

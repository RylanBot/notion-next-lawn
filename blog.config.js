// 注: process.env.XX是Vercel的环境变量，配置方式见：https://docs.tangly1024.com/article/how-to-config-notion-next#c4768010ae7d44609b744e79e2f9959a
const BLOG = {
  // Important page_id！！！Duplicate Template from  https://www.notion.so/tanghh/02ab3b8678004aa69e9e415905ef32a5
  NOTION_PAGE_ID:
        process.env.NOTION_PAGE_ID || '02ab3b8678004aa69e9e415905ef32a5',
  PSEUDO_STATIC: process.env.NEXT_PUBLIC_PSEUDO_STATIC || false, // 伪静态路径，开启后所有文章URL都以 .html 结尾。
  NEXT_REVALIDATE_SECOND: process.env.NEXT_PUBLIC_REVALIDATE_SECOND || 5, // 更新内容缓存间隔 单位(秒)；即每个页面有5秒的纯静态期、此期间无论多少次访问都不会抓取notion数据；调大该值有助于节省Vercel资源、同时提升访问速率，但也会使文章更新有延迟。
  THEME: process.env.NEXT_PUBLIC_THEME || 'lawn', // 当前主题，在themes文件夹下可找到所有支持的主题；主题名称就是文件夹名，例如 example,fukasawa,gitbook,heo,lawn,landing,matery,medium,next,nobelium,plog,simple
  THEME_SWITCH: process.env.NEXT_PUBLIC_THEME_SWITCH || false, // 是否显示切换主题按钮
  LANG: process.env.NEXT_PUBLIC_LANG || 'zh-CN', // e.g 'zh-CN','en-US'  see /lib/lang.js for more.
  SINCE: process.env.NEXT_SINCE || 2021, // e.g if leave this empty, current year will be used.

  // 3.14.1版本后，欢迎语在此配置，英文逗号隔开 ,  即可支持多个欢迎语打字效果。
  GREETING_WORDS: process.env.NEXT_PUBLIC_GREETING_WORDS || 'Hi，我是一个程序员, Hi，我是一个打工人,Hi，我是一个干饭人,欢迎来到我的博客🎉',

  CUSTOM_MENU: process.env.NEXT_PUBLIC_CUSTOM_MENU || false, // 支持Menu 类型，从3.12.0版本起，各主题将逐步支持灵活的二级菜单配置，替代了原来的Page类型，此配置是试验功能、默认关闭。

  AUTHOR: process.env.NEXT_PUBLIC_AUTHOR || 'NotionNext', // 您的昵称 例如 tangly1024
  BIO: process.env.NEXT_PUBLIC_BIO || '一个普通的干饭人🍚', // 作者简介
  LINK: process.env.NEXT_PUBLIC_LINK || 'https://tangly1024.com', // 网站地址
  KEYWORDS: process.env.NEXT_PUBLIC_KEYWORD || 'Notion, 博客', // 网站关键词 英文逗号隔开

  // 社交链接，不需要可留空白，例如 CONTACT_WEIBO:''
  CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '', // 邮箱地址 例如mail@tangly1024.com
  CONTACT_WEIBO: process.env.NEXT_PUBLIC_CONTACT_WEIBO || '', // 你的微博个人主页
  CONTACT_TWITTER: process.env.NEXT_PUBLIC_CONTACT_TWITTER || '', // 你的twitter个人主页
  CONTACT_GITHUB: process.env.NEXT_PUBLIC_CONTACT_GITHUB || '', // 你的github个人主页 例如 https://github.com/tangly1024
  CONTACT_TELEGRAM: process.env.NEXT_PUBLIC_CONTACT_TELEGRAM || '', // 你的telegram 地址 例如 https://t.me/tangly_1024
  CONTACT_LINKEDIN: process.env.NEXT_PUBLIC_CONTACT_LINKEDIN || '', // 你的linkedIn 首页
  CONTACT_INSTAGRAM: process.env.NEXT_PUBLIC_CONTACT_INSTAGRAM || '', // 您的instagram地址
  CONTACT_BILIBILI: process.env.NEXT_PUBLIC_CONTACT_BILIBILI || '', // B站主页
  CONTACT_YOUTUBE: process.env.NEXT_PUBLIC_CONTACT_YOUTUBE || '', // Youtube主页
  CONTACT_STEAM: process.env.NEXT_PUBLIC_CONTACT_STEAM || '', // Steam 主页

  NOTION_HOST: process.env.NEXT_PUBLIC_NOTION_HOST || 'https://www.notion.so', // Notion域名，您可以选择用自己的域名进行反向代理，如果不懂得什么是反向代理，请勿修改此项

  BLOG_FAVICON: process.env.NEXT_PUBLIC_FAVICON || '/favicon.svg', // blog favicon 配置, 默认使用 /public/favicon.ico，支持在线图片，如 https://img.imesong.com/favicon.png

  IMAGE_COMPRESS_WIDTH: process.env.NEXT_PUBLIC_IMAGE_COMPRESS_WIDTH || 800, // 图片压缩宽度默认值，作用于博客封面和文章内容 越小加载图片越快
  IMAGE_ZOOM_IN_WIDTH: process.env.NEXT_PUBLIC_IMAGE_ZOOM_IN_WIDTH || 1200, // 文章图片点击放大后的画质宽度，不代表在网页中的实际展示宽度

  RANDOM_IMAGE_URL: process.env.NEXT_PUBLIC_RANDOM_IMAGE_URL || '', // 随机图片API,如果未配置下面的关键字，主页封面，头像，文章封面图都会被替换为随机图片
  RANDOM_IMAGE_REPLACE_TEXT: process.env.NEXT_PUBLIC_RANDOM_IMAGE_NOT_REPLACE_TEXT || 'images.unsplash.com', // 触发替换图片的 url 关键字(多个支持用英文逗号分开)，只有图片地址中包含此关键字才会替换为上方随机图片url
  // eg: images.unsplash.com(notion图床的所有图片都会替换),如果你在 notion 里已经添加了一个随机图片 url，恰巧那个服务跑路或者挂掉，想一键切换所有配图可以将该 url 配置在这里
  // 默认下会将你上传到 notion的主页封面图和头像也给替换，建议将主页封面图和头像放在其他图床，在 notion 里配置 link 即可。

  // START ************网站字体*****************

  FONT_STYLE: process.env.NEXT_PUBLIC_FONT_STYLE || 'font-serif', // ['font-serif','font-sans'] 两种可选，分别是衬线和无衬线: 参考 https://www.jianshu.com/p/55e410bd2115
  // 字体 CSS
  FONT_URL: [
    'https://npm.elemecdn.com/lxgw-wenkai-webfont@1.6.0/style.css',
    // 'https://fonts.googleapis.com/css?family=Bitter&display=swap',
    // 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300&display=swap',
    // 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC&display=swap'
  ],
  // 无衬线字体
  FONT_SANS: [
    '"PingFang SC"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Hiragino Sans GB"',
    '"Microsoft YaHei"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Segoe UI"',
    '"Noto Sans SC"',
    'HarmonyOS_Regular',
    '"Helvetica Neue"',
    'Helvetica',
    '"Source Han Sans SC"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"'
  ],
  // 衬线字体 例如'"LXGW WenKai"'
  FONT_SERIF: [
    '"LXGW WenKai"',
    'Bitter',
    '"Noto Serif SC"',
    '"LXGW WenKai"',
    '"Times New Roman"',
    'SimSun',
    'Times',
    'serif',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Apple Color Emoji"'
  ],
  FONT_AWESOME: process.env.NEXT_PUBLIC_FONT_AWESOME_PATH || 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', // font-awesome 字体图标地址; 可选 /css/all.min.css ， https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/font-awesome/6.0.0/css/all.min.css

  // END ************网站字体*****************
  CAN_COPY: process.env.NEXT_PUBLIC_CAN_COPY || true, // 是否允许复制页面内容 默认允许，如果设置为false、则全栈禁止复制内容。
  CUSTOM_RIGHT_CLICK_CONTEXT_MENU: process.env.NEXT_PUBLIC_CUSTOM_RIGHT_CLICK_CONTEXT_MENU || true, // 自定义右键菜单，覆盖系统菜单
  CUSTOM_RIGHT_CLICK_CONTEXT_MENU_THEME_SWITCH: process.env.NEXT_PUBLIC_CUSTOM_RIGHT_CLICK_CONTEXT_MENU_THEME_SWITCH || true,

  // 自定义外部脚本，外部样式
  CUSTOM_EXTERNAL_JS: [''], // e.g. ['http://xx.com/script.js','http://xx.com/script.js']
  CUSTOM_EXTERNAL_CSS: [''], // e.g. ['http://xx.com/style.css','http://xx.com/style.css']

  // 侧栏布局 是否反转(左变右,右变左) 已支持主题: lawn next medium fukasawa example
  LAYOUT_SIDEBAR_REVERSE: process.env.NEXT_PUBLIC_LAYOUT_SIDEBAR_REVERSE || false,

  // 一个小插件展示你的facebook fan page~ @see https://tw.andys.pro/article/add-facebook-fanpage-notionnext
  FACEBOOK_PAGE_TITLE: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_TITLE || null, // 邊欄 Facebook Page widget 的標題欄，填''則無標題欄 e.g FACEBOOK 粉絲團'
  FACEBOOK_PAGE: process.env.NEXT_PUBLIC_FACEBOOK_PAGE || null, // Facebook Page 的連結 e.g https://www.facebook.com/tw.andys.pro
  FACEBOOK_PAGE_ID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || '', // Facebook Page ID 來啟用 messenger 聊天功能
  FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '', // Facebook App ID 來啟用 messenger 聊天功能 获取: https://developers.facebook.com/

  BEI_AN: process.env.NEXT_PUBLIC_BEI_AN || '', // 备案号 闽ICP备XXXXXXX

  // START********代码相关********
  // PrismJs 代码相关
  PRISM_JS_PATH: 'https://npm.elemecdn.com/prismjs@1.29.0/components/',
  PRISM_JS_AUTO_LOADER: 'https://npm.elemecdn.com/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js',

  // 代码主题 @see https://github.com/PrismJS/prism-themes
  PRISM_THEME_PREFIX_PATH: process.env.NEXT_PUBLIC_PRISM_THEME_PREFIX_PATH || 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-okaidia.css', // 代码块默认主题
  PRISM_THEME_SWITCH: process.env.NEXT_PUBLIC_PRISM_THEME_SWITCH || true, // 是否开启浅色/深色模式代码主题切换； 开启后将显示以下两个主题
  PRISM_THEME_LIGHT_PATH: process.env.NEXT_PUBLIC_PRISM_THEME_LIGHT_PATH || 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-solarizedlight.css', // 浅色模式主题
  PRISM_THEME_DARK_PATH: process.env.NEXT_PUBLIC_PRISM_THEME_DARK_PATH || 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-okaidia.min.css', // 深色模式主题

  CODE_MAC_BAR: process.env.NEXT_PUBLIC_CODE_MAC_BAR || true, // 代码左上角显示mac的红黄绿图标
  CODE_LINE_NUMBERS: process.env.NEXT_PUBLIC_CODE_LINE_NUMBERS || false, // 是否显示行号
  CODE_COLLAPSE: process.env.NEXT_PUBLIC_CODE_COLLAPSE || true, // 是否支持折叠代码框
  CODE_COLLAPSE_EXPAND_DEFAULT: process.env.NEXT_PUBLIC_CODE_COLLAPSE_EXPAND_DEFAULT || true, // 折叠代码默认是展开状态

  // END********代码相关********

  // Mermaid 图表CDN
  MERMAID_CDN: process.env.NEXT_PUBLIC_MERMAID_CDN || 'https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.2.4/mermaid.min.js', // CDN
  // QRCodeCDN
  QR_CODE_CDN: process.env.NEXT_PUBLIC_QR_CODE_CDN || 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',

  BACKGROUND_LIGHT: '#eeeeee', // use hex value, don't forget '#' e.g #fffefc
  BACKGROUND_DARK: '#000000', // use hex value, don't forget '#'
  SUB_PATH: '', // leave this empty unless you want to deploy in a folder

  POST_SHARE_BAR_ENABLE: process.env.NEXT_PUBLIC_POST_SHARE_BAR || 'true', // 文章分享功能 ，将在底部显示一个分享条
  POSTS_SHARE_SERVICES: process.env.NEXT_PUBLIC_POST_SHARE_SERVICES || 'link,wechat,qq,weibo,email,facebook,twitter,telegram,messenger,line,reddit,whatsapp,linkedin', // 分享的服務，按顺序显示,逗号隔开
  // 所有支持的分享服务：link(复制链接),wechat(微信),qq,weibo(微博),email(邮件),facebook,twitter,telegram,messenger,line,reddit,whatsapp,linkedin,vkshare,okshare,tumblr,livejournal,mailru,viber,workplace,pocket,instapaper,hatena

  POST_URL_PREFIX: process.env.NEXT_PUBLIC_POST_URL_PREFIX || 'article',
  // POST类型文章的默认路径前缀，例如默认POST类型的路径是  /article/[slug]
  // 如果此项配置为 '' 空， 则文章将没有前缀路径，使用场景： 希望文章前缀路径为 /post 的情况 支持多级
  // 支援類似 WP 可自訂文章連結格式的功能：https://wordpress.org/documentation/article/customize-permalinks/，目前只先實作 %year%/%month%/%day%
  // 例：如想連結改成前綴 article + 時間戳記，可變更為： 'article/%year%/%month%/%day%'

  POST_LIST_STYLE: process.env.NEXT_PUBLIC_POST_LIST_STYLE || 'page', // ['page','scroll] 文章列表样式:页码分页、单页滚动加载
  POST_LIST_PREVIEW: process.env.NEXT_PUBLIC_POST_PREVIEW || 'false', //  是否在列表加载文章预览
  POST_PREVIEW_LINES: process.env.NEXT_PUBLIC_POST_POST_PREVIEW_LINES || 12, // 文章预览行数
  POST_RECOMMEND_COUNT: process.env.NEXT_PUBLIC_POST_RECOMMEND_COUNT || 6, // 推荐文章数
  POSTS_PER_PAGE: process.env.NEXT_PUBLIC_POST_PER_PAGE || 12, // 每页文章数
  POSTS_SORT_BY: process.env.NEXT_PUBLIC_POST_SORT_BY || 'notion', // 排序方式 'date'按时间,'notion'由notion控制
  POST_WAITING_TIME_FOR_404: process.env.NEXT_PUBLIC_POST_WAITING_TIME_FOR_404 || 8, // 文章加载超时时间，单位秒；超时后跳转到404页面

  ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || null, // 在这里查看 https://dashboard.algolia.com/account/api-keys/
  ALGOLIA_ADMIN_APP_KEY: process.env.ALGOLIA_ADMIN_APP_KEY || null, // 管理后台的KEY，不要暴露在代码中，在这里查看 https://dashboard.algolia.com/account/api-keys/
  ALGOLIA_SEARCH_ONLY_APP_KEY: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_APP_KEY || null, // 客户端搜索用的KEY
  ALGOLIA_INDEX: process.env.NEXT_PUBLIC_ALGOLIA_INDEX || null, // 在Algolia中创建一个index用作数据库
  //   ALGOLIA_RECREATE_DATA: process.env.ALGOLIA_RECREATE_DATA || process.env.npm_lifecycle_event === 'build', // 为true时重新构建索引数据; 默认在build时会构建

  PREVIEW_CATEGORY_COUNT: 16, // 首页最多展示的分类数量，0为不限制
  PREVIEW_TAG_COUNT: 16, // 首页最多展示的标签数量，0为不限制

  POST_DISABLE_GALLERY_CLICK: process.env.NEXT_PUBLIC_POST_DISABLE_GALLERY_CLICK || true, // 画册视图禁止点击，方便在友链页面的画册插入链接
  POST_DISABLE_DATABASE_CLICK: process.env.NEXT_PUBLIC_POST_DISABLE_DATABASE_CLICK || true, // 数据库禁止点击
  
  //   ********动态特效相关********
  // 鼠标点击烟花特效
  FIREWORKS: process.env.NEXT_PUBLIC_FIREWORKS || false, // 开关
  // 烟花色彩，感谢 https://github.com/Vixcity 提交的色彩
  FIREWORKS_COLOR: [
    '255, 20, 97',
    '24, 255, 146',
    '90, 135, 255',
    '251, 243, 140'
  ],

  // 漂浮线段特效
  NEST: process.env.NEXT_PUBLIC_NEST || false, // 开关
  // 动态彩带特效
  FLUTTERINGRIBBON: process.env.NEXT_PUBLIC_FLUTTERINGRIBBON || false, // 开关
  // 静态彩带特效
  RIBBON: process.env.NEXT_PUBLIC_RIBBON || false, // 开关
  // 星空雨特效 黑夜模式才会生效
  STARRY_SKY: process.env.NEXT_PUBLIC_STARRY_SKY || false, // 开关

  //   ********挂件组件相关********
  DIFY_CHATBOT_BASE_URL: process.env.NEXT_PUBLIC_DIFY_CHATBOT_BASE_URL || '',
  DIFY_CHATBOT_TOKEN: process.env.NEXT_PUBLIC_DIFY_CHATBOT_TOKEN || '',
  // 悬浮挂件
  WIDGET_PET: process.env.NEXT_PUBLIC_WIDGET_PET || true, // 是否显示宠物挂件
  WIDGET_PET_LINK:
        process.env.NEXT_PUBLIC_WIDGET_PET_LINK ||
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json', // 挂件模型地址 @see https://github.com/xiazeyu/live2d-widget-models
  WIDGET_PET_SWITCH_THEME: process.env.NEXT_PUBLIC_WIDGET_PET_SWITCH_THEME || true, // 点击宠物挂件切换博客主题

  // 音乐播放插件
  MUSIC_PLAYER: process.env.NEXT_PUBLIC_MUSIC_PLAYER || false, // 是否使用音乐播放插件
  MUSIC_PLAYER_VISIBLE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_VISIBLE || true, // 是否在左下角显示播放和切换，如果使用播放器，打开自动播放再隐藏，就会以类似背景音乐的方式播放，无法取消和暂停
  MUSIC_PLAYER_AUTO_PLAY:
        process.env.NEXT_PUBLIC_MUSIC_PLAYER_AUTO_PLAY || true, // 是否自动播放，不过自动播放时常不生效（移动设备不支持自动播放）
  MUSIC_PLAYER_LRC_TYPE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_LRC_TYPE || '0', // 歌词显示类型，可选值： 3 | 1 | 0（0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）（前提是有配置歌词路径，对 meting 无效）
  MUSIC_PLAYER_CDN_URL:
        process.env.NEXT_PUBLIC_MUSIC_PLAYER_CDN_URL ||
        'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/aplayer/1.10.1/APlayer.min.js',
  MUSIC_PLAYER_ORDER: process.env.NEXT_PUBLIC_MUSIC_PLAYER_ORDER || 'list', // 默认播放方式，顺序 list，随机 random
  MUSIC_PLAYER_AUDIO_LIST: [
    // 示例音乐列表。除了以下配置外，还可配置歌词，具体配置项看此文档 https://aplayer.js.org/#/zh-Hans/
    {
      name: '风を共に舞う気持ち',
      artist: 'Falcom Sound Team jdk',
      url: 'https://music.163.com/song/media/outer/url?id=731419.mp3',
      cover:
            'https://p2.music.126.net/kn6ugISTonvqJh3LHLaPtQ==/599233837187278.jpg'
    },
    {
      name: '王都グランセル',
      artist: 'Falcom Sound Team jdk',
      url: 'https://music.163.com/song/media/outer/url?id=731355.mp3',
      cover:
            'https://p1.music.126.net/kn6ugISTonvqJh3LHLaPtQ==/599233837187278.jpg'
    }
  ],
  MUSIC_PLAYER_METING: process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING || false, // 是否要开启 MetingJS，从平台获取歌单。会覆盖自定义的 MUSIC_PLAYER_AUDIO_LIST，更多配置信息：https://github.com/metowolf/MetingJS
  MUSIC_PLAYER_METING_SERVER:
        process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_SERVER || 'netease', // 音乐平台，[netease, tencent, kugou, xiami, baidu]
  MUSIC_PLAYER_METING_ID:
        process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_ID || '60198', // 对应歌单的 id
  MUSIC_PLAYER_METING_LRC_TYPE:
        process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_LRC_TYPE || '1', // 可选值： 3 | 1 | 0（0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）

  //   ********挂件组件相关********
  COMMENT_HIDE_SINGLE_TAB: process.env.NEXT_PUBLIC_COMMENT_HIDE_SINGLE_TAB || false,

  COMMENT_WALINE_SERVER_URL: process.env.NEXT_PUBLIC_WALINE_SERVER_URL || '', // 请配置完整的Waline评论地址 例如 hhttps://preview-waline.tangly1024.com @see https://waline.js.org/guide/get-started.html
  COMMENT_WALINE_RECENT: process.env.NEXT_PUBLIC_WALINE_RECENT || false, // 最新评论

  // <---- 评论插件

  // ----> 站点统计
  ANALYTICS_VERCEL: process.env.NEXT_PUBLIC_ANALYTICS_VERCEL || false, // vercel自带的统计 https://vercel.com/docs/concepts/analytics/quickstart https://github.com/tangly1024/NotionNext/issues/897
  ANALYTICS_BUSUANZI_ENABLE: process.env.NEXT_PUBLIC_ANALYTICS_BUSUANZI_ENABLE || true, // 展示网站阅读量、访问数 see http://busuanzi.ibruce.info/
  ANALYTICS_CNZZ_ID: process.env.NEXT_PUBLIC_ANALYTICS_CNZZ_ID || '', // 只需要填写站长统计的id, [cnzz_id] -> https://s9.cnzz.com/z_stat.php?id=[cnzz_id]&web_id=[cnzz_id]
  ANALYTICS_GOOGLE_ID: process.env.NEXT_PUBLIC_ANALYTICS_GOOGLE_ID || '', // 谷歌Analytics的id e.g: G-XXXXXXXXXX

  // 51la 站点统计 https://www.51.la/
  ANALYTICS_51LA_ID: process.env.NEXT_PUBLIC_ANALYTICS_51LA_ID || '', // id，在51la后台获取 参阅 https://docs.tangly1024.com/article/notion-next-51-la
  ANALYTICS_51LA_CK: process.env.NEXT_PUBLIC_ANALYTICS_51LA_CK || '', // ck，在51la后台获取

  // Matomo 网站统计
  MATOMO_HOST_URL: process.env.NEXT_PUBLIC_MATOMO_HOST_URL || '', // Matomo服务器地址，不带斜杠
  MATOMO_SITE_ID: process.env.NEXT_PUBLIC_MATOMO_SITE_ID || '', // Matomo网站ID
  // ACKEE网站访客统计工具
  ANALYTICS_ACKEE_TRACKER: process.env.NEXT_PUBLIC_ANALYTICS_ACKEE_TRACKER || '', // e.g 'https://ackee.tangly1024.com/tracker.js'
  ANALYTICS_ACKEE_DATA_SERVER: process.env.NEXT_PUBLIC_ANALYTICS_ACKEE_DATA_SERVER || '', // e.g https://ackee.tangly1024.com , don't end with a slash
  ANALYTICS_ACKEE_DOMAIN_ID: process.env.NEXT_PUBLIC_ANALYTICS_ACKEE_DOMAIN_ID || '', // e.g '82e51db6-dec2-423a-b7c9-b4ff7ebb3302'

  SEO_GOOGLE_SITE_VERIFICATION:
        process.env.NEXT_PUBLIC_SEO_GOOGLE_SITE_VERIFICATION || '', // Remove the value or replace it with your own google site verification code

  SEO_BAIDU_SITE_VERIFICATION:
        process.env.NEXT_PUBLIC_SEO_BAIDU_SITE_VERIFICATION || '', // Remove the value or replace it with your own google site verification code

  // 微软 Clarity 站点分析
  CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID || null, // 只需要复制Clarity脚本中的ID部分，ID是一个十位的英文数字组合

  // <---- 站点统计

  // START---->营收相关

  // 谷歌广告
  ADSENSE_GOOGLE_ID: process.env.NEXT_PUBLIC_ADSENSE_GOOGLE_ID || '', // 谷歌广告ID e.g ca-pub-xxxxxxxxxxxxxxxx
  ADSENSE_GOOGLE_TEST: process.env.NEXT_PUBLIC_ADSENSE_GOOGLE_TEST || false, // 谷歌广告ID测试模式，这种模式获取假的测试广告，用于开发 https://www.tangly1024.com/article/local-dev-google-adsense
  ADSENSE_GOOGLE_SLOT_IN_ARTICLE: process.env.NEXT_PUBLIC_ADSENSE_GOOGLE_SLOT_IN_ARTICLE || '3806269138', // Google AdScene>广告>按单元广告>新建文章内嵌广告 粘贴html代码中的data-ad-slot值
  ADSENSE_GOOGLE_SLOT_FLOW: process.env.NEXT_PUBLIC_ADSENSE_GOOGLE_SLOT_FLOW || '1510444138', // Google AdScene>广告>按单元广告>新建信息流广告
  ADSENSE_GOOGLE_SLOT_NATIVE: process.env.NEXT_PUBLIC_ADSENSE_GOOGLE_SLOT_NATIVE || '4980048999', // Google AdScene>广告>按单元广告>新建原生广告
  ADSENSE_GOOGLE_SLOT_AUTO: process.env.NEXT_PUBLIC_ADSENSE_GOOGLE_SLOT_AUTO || '8807314373', // Google AdScene>广告>按单元广告>新建展示广告 （自动广告）

  // END<----营收相关

  // 友链接力
  TRAVELLING_LINK: process.env.NEXT_PUBLIC_TRAVELLING_LINK || true,

  // 自定义配置notion数据库字段名
  NOTION_PROPERTY_NAME: {
    password: process.env.NEXT_PUBLIC_NOTION_PROPERTY_PASSWORD || 'password',
    type: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE || 'type', // 文章类型，
    type_post: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_POST || 'Post', // 当type文章类型与此值相同时，为博文。
    type_page: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_PAGE || 'Page', // 当type文章类型与此值相同时，为单页。
    type_notice:
          process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_NOTICE || 'Notice', // 当type文章类型与此值相同时，为公告。
    type_menu: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_MENU || 'Menu', // 当type文章类型与此值相同时，为菜单。
    type_sub_menu:
          process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_SUB_MENU || 'SubMenu', // 当type文章类型与此值相同时，为子菜单。
    title: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TITLE || 'title', // 文章标题
    status: process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS || 'status',
    status_publish:
          process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS_PUBLISH || 'Published', // 当status状态值与此相同时为发布，可以为中文
    status_invisible:
          process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS_INVISIBLE || 'Invisible', // 当status状态值与此相同时为隐藏发布，可以为中文 ， 除此之外其他页面状态不会显示在博客上
    summary: process.env.NEXT_PUBLIC_NOTION_PROPERTY_SUMMARY || 'summary',
    slug: process.env.NEXT_PUBLIC_NOTION_PROPERTY_SLUG || 'slug',
    category: process.env.NEXT_PUBLIC_NOTION_PROPERTY_CATEGORY || 'category',
    date: process.env.NEXT_PUBLIC_NOTION_PROPERTY_DATE || 'date',
    tags: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TAGS || 'tags',
    icon: process.env.NEXT_PUBLIC_NOTION_PROPERTY_ICON || 'icon',
    finished_date: process.env.NEXT_PUBLIC_NOTION_PROPERTY_FINISHED_DATE || 'finished_date' // 文章最后更新时间
  },

  // RSS订阅
  ENABLE_RSS: process.env.NEXT_PUBLIC_ENABLE_RSS || true, // 是否开启RSS订阅功能
  MAILCHIMP_LIST_ID: process.env.MAILCHIMP_LIST_ID || null, // 开启mailichimp邮件订阅 客户列表ID ，具体使用方法参阅文档
  MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY || null, // 开启mailichimp邮件订阅 APIkey

  // 作废配置
  AVATAR: process.env.NEXT_PUBLIC_AVATAR || '/avatar.png', // 作者头像，被notion中的ICON覆盖。若无ICON则取public目录下的avatar.png
  TITLE: process.env.NEXT_PUBLIC_TITLE || 'NotionNext BLOG', // 站点标题 ，被notion中的页面标题覆盖；此处请勿留空白，否则服务器无法编译
  HOME_BANNER_IMAGE:
        process.env.NEXT_PUBLIC_HOME_BANNER_IMAGE || '/bg_image.jpg', // 首页背景大图, 会被notion中的封面图覆盖，若无封面图则会使用代码中的 /public/bg_image.jpg 文件
  DESCRIPTION:
        process.env.NEXT_PUBLIC_DESCRIPTION || '这是一个由NotionNext生成的站点', // 站点描述，被notion中的页面描述覆盖

  // 网站图片
  IMG_LAZY_LOAD_PLACEHOLDER: process.env.NEXT_PUBLIC_IMG_LAZY_LOAD_PLACEHOLDER || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', // 懒加载占位图片地址，支持base64或url
  IMG_URL_TYPE: process.env.NEXT_PUBLIC_IMG_TYPE || 'Notion', // 此配置已失效，请勿使用；AMAZON方案不再支持，仅支持Notion方案。 ['Notion','AMAZON'] 站点图片前缀 默认 Notion:(https://notion.so/images/xx) ， AMAZON(https://s3.us-west-2.amazonaws.com/xxx)
  IMG_COMPRESS_WIDTH: process.env.NEXT_PUBLIC_IMG_COMPRESS_WIDTH || 800, // Notion图片压缩宽度

  // 开发相关
  NOTION_ACCESS_TOKEN: process.env.NOTION_ACCESS_TOKEN || '', // Useful if you prefer not to make your database public
  DEBUG: process.env.NEXT_PUBLIC_DEBUG || false, // 是否显示调试按钮
  ENABLE_CACHE: process.env.ENABLE_CACHE || process.env.npm_lifecycle_event === 'build', // 缓存在开发调试和打包过程中选择性开启，正式部署开启此功能意义不大。
  isProd: process.env.VERCEL_ENV === 'production', // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)  isProd: process.env.VERCEL_ENV === 'production' // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  BUNDLE_ANALYZER: process.env.ANALYZE === 'true' || false, // 是否展示编译依赖内容与大小
  VERSION: process.env.NEXT_PUBLIC_VERSION // 版本号
}

module.exports = BLOG

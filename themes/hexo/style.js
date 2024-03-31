/* eslint-disable react/no-unknown-property */

/**
 * 主题定制化 css
 * 这里的样式只对当前主题生效
 */
export const Style = () => {
  return (
  <style jsx global>{`
    * {
        scrollbar-width: thin;
        scrollbar-color: #2fb596 transparent
    }

    // 自定义滚动条
    ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #5ae9c7;
    }

    // 底色
    body{
        background-color: #f5f5f5
    }
    .dark body{
        background-color: black;
    }
  
    // 菜单下划线动画
    // #theme-hexo .menu-link {
    //     text-decoration: none;
    //     background-image: linear-gradient(#928CEE, #928CEE);
    //     background-repeat: no-repeat;
    //     background-position: bottom center;
    //     background-size: 0 2px;
    //     transition: background-size 100ms ease-in-out;
    // }

    // 自定义菜单
    #theme-hexo .menu-title {
        font-weight: bolder;
    }

    #theme-hexo .menu-title:hover {
        background-size: 100% 2px;
        color: #2dd4bf;
    }

    #theme-hexo .header-text-shadow .menu-title:hover {
        background-size: 100% 2px;
        color: #68f2cd;
    }
  `}</style>);
};

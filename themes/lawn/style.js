/**
 * 主题定制化 css
 * 这里的样式只对当前主题生效
 */
export const Style = () => {
  return (
    <style jsx global>
      {`
        * {
          scrollbar-width: thin;
          scrollbar-color: #2fb596 transparent;
        }

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

        body {
          background-color: #f5f5f5;
        }
        .dark body {
          background-color: black;
        }

        #theme-lawn .menu-title {
          font-weight: bolder;
        }

        #theme-lawn .menu-title:hover {
          background-size: 100% 2px;
          color: #66ecda;
        }
      `}
    </style>
  );
};

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

        #lawn-main-wrapper::before {
          content: '';
          position: fixed;
          top: 50vh;
          right: -50vw;
          width: 100vw;
          height: 100vw;
          z-index: 1;
          filter: blur(50px);
          background: radial-gradient(
            circle,
            rgba(20, 184, 166, 0.18) 0%,
            rgba(20, 184, 166, 0.08) 35%,
            transparent 70%
          );
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

import useDarkMode from '@/hooks/useDarkMode';

const SunIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path
          id="fill1"
          d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
          fill="transparent"
        />
        <path
          id="stroke1"
          d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
          strokeWidth="2"
          stroke="currentColor"
        />
        <path
          id="stroke2"
          d="M12 21V22M12 2V3M3 12H2M22 12H21M5.63603 18.3635L4.92892 19.0706M19.0711 4.92848L18.364 5.63559M5.63601 5.63563L4.9289 4.92852M19.071 19.0707L18.3639 18.3636"
          strokeLinecap="square"
          strokeWidth="2"
          stroke="currentColor"
        />
      </g>
    </svg>
  );
};

const MoonIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path
          id="fill1"
          d="M20.5387 14.8522C20.0408 14.9492 19.5263 15 19 15C14.5817 15 11 11.4183 11 7C11 5.54296 11.3194 4.17663 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C15.9737 21 19.3459 18.4248 20.5387 14.8522Z"
          fill="transparent"
        />
        <path
          id="stroke1"
          d="M20.5387 14.8522C20.0408 14.9492 19.5263 15 19 15C14.5817 15 11 11.4183 11 7C11 5.54296 11.3194 4.17663 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C15.9737 21 19.3459 18.4248 20.5387 14.8522Z"
          strokeWidth="2"
          stroke="currentColor"
        />
      </g>
    </svg>
  );
};

const DarkModeButton = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative h-10 w-10 rounded-full cursor-pointer text-gray-700 dark:text-gray-200 transition-colors`}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all ${
          isDarkMode ? 'scale-50 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      >
        <SunIcon />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all ${
          isDarkMode ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0'
        }`}
      >
        <MoonIcon />
      </span>
    </button>
  );
};

export default DarkModeButton;

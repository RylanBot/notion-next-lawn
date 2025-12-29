(function () {
  const storageKey = 'darkMode';
  const classDark = 'dark';
  const classLight = 'light';

  // 切换主题
  const toggleTheme = (isDark) => {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.remove(classLight);
      htmlElement.classList.add(classDark);
    } else {
      htmlElement.classList.remove(classDark);
      htmlElement.classList.add(classLight);
    }
  };

  const preference = localStorage.getItem(storageKey);
  if (preference !== null) {
    // 用户偏好
    toggleTheme(preference === 'true');
  } else {
    // 系统当前值
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    toggleTheme(prefersDark);
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem(storageKey) === null) {
      // 如果没有手动调整过，跟随系统变化
      toggleTheme(e.matches);
    }
  });
})();

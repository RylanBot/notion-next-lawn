(function () {
    const storageKey = 'darkMode';
    const classDark = 'dark';
    const classLight = 'light';

    const setClassOnHtml = (darkMode) => {
        const htmlElement = document.getElementsByTagName('html')[0];
        htmlElement.classList.remove(darkMode ? classLight : classDark);
        htmlElement.classList.add(darkMode ? classDark : classLight);
    };

    const isLocalDark = window.localStorage.getItem(storageKey);
    if (isLocalDark !== null) {
        setClassOnHtml(isLocalDark === 'true');
    } else {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setClassOnHtml(isDarkMode ? classDark : classLight);
        window.localStorage.setItem(storageKey, isDarkMode ? classDark : classLight);
    }
})();

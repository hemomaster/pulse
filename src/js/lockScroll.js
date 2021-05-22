// Включение/отключение прокрутки страницы

window.disabledScroll = () => {
  const srcollBar = window.innerWidth - document.body.clientWidth;
  document.body.dataset.scrollY = window.pageYOffset.toFixed(2);
  document.body.style.cssText = `
    position: fixed;
    top: -${window.pageYOffset.toFixed(2)}px;
    left: 0;
    width: 100%;
    overflow: hidden;
    height: 100vh;
    padding-right: ${srcollBar}px;`;
};

window.enabledScroll = () => {
  document.body.style.cssText = "";
  window.scroll({ top: +document.body.dataset.scrollY });
  document.body.removeAttribute("data-scroll-y");
};

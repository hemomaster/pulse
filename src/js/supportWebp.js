/* 
Изначально
<div style="background-image: url('/images/image.webp')" data-bg="/images/image.jpg"></div>
 */
const canUseWebp = () => {
  // Создаем элемент canvas
  let elem = document.createElement("canvas");
  // Приводим элемент к булеву типу
  if (!!(elem.getContext && elem.getContext("2d"))) {
    // Создаем изображение в формате webp, возвращаем индекс искомого элемента и сразу же проверяем его
    return elem.toDataURL("image/webp").indexOf("data:image/webp") == 0;
  }
  // Иначе Webp не используем
  return false;
};

window.onload = function () {
  const bgImgEls = document.querySelectorAll(["data-bg"]);

  if (canUseWebp()) return;

  bgImgEls.forEach((img) => (img.style.backgroundImage = img.dataset.bg));
};

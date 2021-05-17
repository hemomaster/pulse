"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const telFields = document.querySelectorAll("input[type='tel']");
  const carousel = document.querySelector(".carousel__container");
  const parentTab = document.querySelector(".catalog__tabs");
  const catalogTabAll = document.querySelectorAll(".catalog__tab");
  const catalogContentAll = document.querySelectorAll(".catalog__content");

  const swiper = new Swiper(carousel, {
    slidesPerView: 1,
    // spaceBetween: 50,
    loop: true,
    lazy: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: ".carousel__btn-next",
      prevEl: ".carousel__btn-prev",
    },
  });

  // INPUTMASK
  Inputmask("+380 (99) 999-99-99").mask(telFields);

  // JUSTVALIDATE
  const validateForm = (selector, rules) => {
    new JustValidate(selector, {
      rules,
      submitHandler: function (form) {
        const dataForm = new FormData(form);

        fetch(form.action, {
          method: "post",
          body: dataForm,
        })
          .then((response) => {
            if (response.ok) return response.json();
            else new Error(response);
          })
          .then((data) => {
            console.log("Ответ сервера: ", data);
          })
          .catch((e) => console.warn(`Ошибка: ${e.status}`))
          .finally(() => {
            form.reset();
          });
      },
    });
  };

  validateForm(".feed-form", {
    fio: { required: true },
    email: { required: true, email: true },
    tel: { required: true },
  });

  // CATALOG TABS
  const showTabByIndex = (i) =>
    catalogTabAll[i].classList.add("catalog__tab--active");

  const hiddenTabByIndex = (i) =>
    catalogTabAll[i].classList.remove("catalog__tab--active");

  const showContentByIndex = (i) =>
    catalogContentAll[i].classList.add("catalog__content--active");

  const hiddenContentByIndex = (i) =>
    catalogContentAll[i].classList.remove("catalog__content--active");

  parentTab.addEventListener("click", (e) => {
    const target = e.target.closest(".catalog__tab");

    if (!target) return;

    [...catalogTabAll].forEach((tab, i) => {
      if (tab === target) {
        showTabByIndex(i);
        showContentByIndex(i);
      } else {
        hiddenTabByIndex(i);
        hiddenContentByIndex(i);
      }
    });
  });

  //SHOWING THE FRONT OR BACK OF THE CARD
  const howingFrontOrBack = (el) => {
    const parent = el.closest(".card__wrapper");

    if (!parent) return;

    const content = parent.querySelector(".card__content");
    const descr = parent.querySelector(".card__descr");

    if (content && descr) {
      content.classList.toggle("card__content--active");
      descr.classList.toggle("card__descr--active");
    }
  };

  catalogContentAll.forEach((cat) =>
    cat.addEventListener("click", (e) => {
      const target = e.target;

      if (
        target.classList.contains("card__content-link") ||
        target.classList.contains("card__descr-link")
      ) {
        e.preventDefault();
        howingFrontOrBack(target);
      }
    })
  );

  // end js
});

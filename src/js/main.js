"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const telFields = document.querySelectorAll("input[type='tel']");
  const carousel = document.querySelector(".carousel__container");
  const parentTab = document.querySelector(".catalog__tabs");
  const catalogTabAll = document.querySelectorAll(".catalog__tab");
  const catalogContentAll = document.querySelectorAll(".catalog__content");
  const modalOverlay = document.getElementById("overlay");
  const modalSubtitleOrder = document.querySelector("#order .modal__subtitle");
  const scrollLinkUp = document.getElementById("scroll-up");
  const scrollLinkAll = document.querySelectorAll(
    "a[href^='#']:not(a[href='#'])"
  );
  const consultationBtnAll = document.querySelectorAll(
    "button[data-modal-id=consultation]"
  );

  // FADEOUT, FADEIN
  const fadeOut = (selector, speed = 10) => {
    let opacity = 1;
    const el = document.querySelector(selector);

    if (!el) return;

    const timer = setInterval(function () {
      if (opacity <= 0.1) {
        clearInterval(timer);
        el.style.display = "none";
      }

      el.style.opacity = opacity;

      opacity -= opacity * 0.1;
    }, speed);
  };

  const fadeIn = (selector, speed = 10) => {
    var opacity = 0.01;
    const el = document.querySelector(selector);

    if (!el) return;

    el.style.opacity = opacity;
    el.style.display = "block";

    var timer = setInterval(function () {
      if (opacity >= 1) {
        clearInterval(timer);
      }

      el.style.opacity = opacity;

      opacity += opacity * 0.1;
    }, speed);
  };

  // CAROUSEL
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
          method: "POST",
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

  validateForm(".consultations .feed-form", {
    fio: { required: true },
    email: { required: true, email: true },
    tel: { required: true },
  });

  validateForm("#consultation .feed-form", {
    fio: { required: true },
    email: { required: true, email: true },
    tel: { required: true },
  });

  validateForm("#order .feed-form", {
    fio: { required: true },
    email: { required: true, email: true },
    tel: { required: true },
  });

  // CATALOG TABS
  const showBoxByIndex = (i) => {
    catalogTabAll[i].classList.add("catalog__tab--active");
    catalogContentAll[i].classList.add("catalog__content--active");
  };

  const hiddenBoxByIndex = (i) => {
    catalogTabAll[i].classList.remove("catalog__tab--active");
    catalogContentAll[i].classList.remove("catalog__content--active");
  };

  parentTab.addEventListener("click", (e) => {
    const target = e.target.closest(".catalog__tab");

    if (!target) return;

    catalogTabAll.forEach((tab, i) => {
      if (tab === target) showBoxByIndex(i);
      else hiddenBoxByIndex(i);
    });
  });

  //SHOWING THE FRONT OR BACK OF THE CARD

  const getParentCard = (el) => el.closest(".catalog__content-article.card");

  const howingFrontOrBack = (el) => {
    const parent = getParentCard(el);

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

  // ACTIVATE MODAL CONSULTATION
  const activateModal = (id) => {
    const modal = document.getElementById(id);
    const fieldElems = modal.querySelectorAll("input[data-validate-field]");
    // deactivate error class validation
    fieldElems.forEach((el) => {
      el.classList.remove("js-validate-error-field");
      el.style.border = "";
      el.style.color = "";
    });
    // show
    disableScroll();
    fadeIn("#" + id);
  };

  const deActivateModal = (...modal) => {
    modal.forEach((el) => fadeOut(el));
    fadeOut("#overlay");
    enableScroll();
  };

  // open modal
  consultationBtnAll.forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = btn.dataset.modalId;

      if (!id) return;

      const modal = document.getElementById(id);
      const fieldElems = modal.querySelectorAll("input[data-validate-field]");
      // deactivate error class validation
      fieldElems.forEach((el) => {
        el.classList.remove("js-validate-error-field");
        el.style.border = "";
        el.style.color = "";
      });

      disableScroll();
      fadeIn("#overlay");
      fadeIn("#" + id);
    })
  );

  // close modal
  modalOverlay.addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("modal__close") || !target.closest(".modal"))
      deActivateModal("#consultation", "#order", "#success");
  });

  // ACTIVATE MODAL ORDER
  catalogContentAll.forEach((cat) =>
    cat.addEventListener("click", (e) => {
      const target = e.target;
      if (!target.classList.contains("card__footer-btn")) return;

      fadeIn("#overlay");
      modalSubtitleOrder.textContent = getParentCard(target).querySelector(
        ".card__content-title"
      ).textContent;
      fadeIn("#order");
    })
  );

  // SMOOTH SCROLL
  let isDoneIn = false,
    isDoneOut = false;

  const handlerScrollUp = () => {
    if (window.pageYOffset >= window.innerHeight * 2) {
      if (!isDoneIn) {
        isDoneIn = true;
        isDoneOut = false;
        fadeIn("#scroll-up");
      }
    } else {
      if (!isDoneOut) {
        isDoneOut = true;
        isDoneIn = false;
        fadeOut("#scroll-up");
      }
    }
  };

  window.addEventListener("scroll", handlerScrollUp);
  handlerScrollUp();

  scrollLinkAll.forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = e.target
        .closest(".scroll-link")
        .getAttribute("href")
        .substring(1);

      if (!id) return;

      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
      });
    })
  );

  // end js
});

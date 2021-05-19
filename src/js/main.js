"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const telFields = document.querySelectorAll("input[type='tel']");
  const carousel = document.querySelector(".carousel__container");
  const parentTab = document.querySelector(".catalog__tabs");
  const catalogTabAll = document.querySelectorAll(".catalog__tab");
  const catalogContentAll = document.querySelectorAll(".catalog__content");
  const modalOverlay = document.querySelector(".modal-overlay");
  const modalSubtitleOrder = document.querySelector("#order .modal__subtitle");
  const consultationBtnAll = document.querySelectorAll(
    "button[data-modal-id=consultation]"
  );

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
  const handlerModalOverlay = (par) =>
    (modalOverlay.style.display = par ? "block" : "");

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
    modal.style.display = "block";
  };

  const deActivateModal = (...modal) => {
    modal.forEach((el) => (document.getElementById(el).style.display = ""));
    handlerModalOverlay(false);
  };

  // open modal
  consultationBtnAll.forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = btn.dataset.modalId;

      if (!id) return;

      handlerModalOverlay(true);
      activateModal(id);
    })
  );

  // close modal
  modalOverlay.addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("modal__close") || !target.closest(".modal"))
      deActivateModal("consultation", "order", "success");
  });

  // ACTIVATE MODAL ORDER
  catalogContentAll.forEach((cat) =>
    cat.addEventListener("click", (e) => {
      const target = e.target;
      if (!target.classList.contains("card__footer-btn")) return;

      handlerModalOverlay(true);
      modalSubtitleOrder.textContent = getParentCard(target).querySelector(
        ".card__content-title"
      ).textContent;
      activateModal("order");
    })
  );

  // end js
});

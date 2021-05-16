"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const telFields = document.querySelectorAll("input[type='tel']");
  const carousel = document.querySelector(".carousel__container");
  const forms = document.querySelectorAll("form");

  const swiper = new Swiper(carousel, {
    slidesPerView: 1,
    // spaceBetween: 50,
    loop: true,
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

  // end js
});

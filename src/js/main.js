"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const telFields = document.querySelectorAll("input[type='tel']");
  const forms = document.querySelectorAll("form");

  // INPUTMASK
  Inputmask("+380 (99) 999-99-99").mask(telFields);

  // JUSTVALIDATE
  const validateForm = (formEl, rules) => {
    new JustValidate(formEl, {
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

// validateEmpty the form
// get the form inputs
let formFields = document.querySelectorAll(
  ".card input, .card select, .card textarea"
);

// validation
function validation(fd) {
  validateEmpty(fd);

  // validate email
  if (fd.type == "email") {
    validateEmail(fd);
  }

  // validate phone
  if (fd.type == "tel") {
    validatePhone(fd);
  }
}

// validateEmpty the fields on blur
formFields.forEach(field => {
  if (field.offsetParent !== null) {
    // validate on blur
    field.addEventListener("blur", function() {
      validation(this);
      if (
        field.getAttribute("id") !== "terms-check" &&
        document.querySelector("#terms-check").checked
      ) {
        document.querySelector("#terms-check").checked = false;
      }
    });
    field.addEventListener("change", function() {
      validation(this);
      if (
        field.getAttribute("id") !== "terms-check" &&
        document.querySelector("#terms-check").checked
      ) {
        document.querySelector("#terms-check").checked = false;
      }
    });
  }

  //   save data on reload
  window.addEventListener("beforeunload", function() {
    if (field.getAttribute("type") !== "submit") {
      localStorage.setItem(field.name, field.value);
    }
  });

  window.addEventListener("load", function() {
    if (field.getAttribute("type") !== "submit") {
      // get the value from local storage
      let val = localStorage.getItem(field.name);
      if (val !== null) {
        field.value = val;
      }
    }
  });

  // scroll to show the input on focus in mobile
  if (window.innerWidth <= 768) {
    field.addEventListener("focus", function() {
      document.body.scrollTop = this.offsetTop;
    });
  }
});

// select the form
let regForm = document.querySelector("#regForm");

let sub_form = {};
let fields = Object.keys(sub_form);
regForm.addEventListener("submit", function(e) {
  e.preventDefault();
  //   validateEmpty the fields
  formFields.forEach(field => {
    if (
      field.getAttribute("type") !== "submit" &&
      field.offsetParent !== null
    ) {
      // convert the form value from array into object
      sub_form[field.name] = field.value;
    }
  });

  if (errors.empty) {
    formFields.forEach(field => {
      validateEmpty(field);
    });
  } else {
    console.log(sub_form);
    // the modal
    let modal = document.querySelector("#val-modal");
    // the content of the modal
    let modalContent = modal.querySelector(".modal-content");
    // hide when clicking any where except the modal
    window.onclick = function(e) {
      if (e.target == modal) {
        modal.style.display = "none";
      }
    };
    // show the modal
    modal.style.display = "block";
    // show the loading before every request
    modalContent.querySelectorAll("p").forEach(p => {
      p.style.display = "none";
    });
    modalContent.querySelector("img").style.display = "block";
    // send data to the api
    fetch("https://stark-temple-62549.herokuapp.com/register", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sub_form)
    })
      .then(res => {
        // show success message
        modalContent.querySelector("img").style.display = "none";
        modalContent.querySelector(".success").style.display = "block";
        modalContent.querySelector(".error").style.display = "none";
        // Reset the form on success
        formFields.forEach(field => {
          if (
            field.getAttribute("type") !== "submit" &&
            field.offsetParent !== null
          ) {
            field.value = "";
            field.classList.remove("valid");
            field.classList.remove("invalid");
          }
        });
      })
      .catch(err => {
        modalContent.querySelector("img").style.display = "none";
        modalContent.querySelectorAll(".success").style.display = "none";
        modalContent.querySelectorAll(".error").style.display = "block";
      });
  }
});

function validateEmpty(field) {
  if (field.hasAttribute("required")) {
    if (field.value.length > 0) {
      field.classList.add("valid");
      field.classList.remove("invalid");

      // check if the field have error message or not
      // get the error message
      let errorMessage;
      if (field.parentElement) {
        errorMessage = field.parentElement.lastElementChild;
      }
      if (errorMessage && errorMessage.classList.contains("validate-message")) {
        errorMessage.remove();
      }
    } else {
      if (!field.classList.contains("invalid") && field.offsetParent !== null) {
        field.classList.add("invalid");
        field.classList.remove("valid");

        if (field.parentElement.style.display != "none") {
          // insert error message after the empty field
          message(field, "Please fill this field");
        }
      }
    }
  }
}
let errors = {
  email: true,
  phone: true,
  empty: true
};
// validate the email fields
function validateEmail(field) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!re.test(String(field.value))) {
    if (!field.classList.contains("invalid")) {
      field.classList.add("invalid");
      field.classList.remove("valid");

      errors.email = true;
      message(field, "Add a valid email");
    }
  } else {
    field.classList.add("valid");
    field.classList.remove("invalid");

    errors.email = false;

    // check if the field have error message or not
    // get the error message
    let errorMessage = field.parentElement.lastElementChild;
    if (errorMessage.classList.contains("validate-message")) {
      errorMessage.remove();
    }
  }
}

// validate phone number
function validatePhone(field) {
  let re = /^01\d{9}/;

  if (!re.test(field.value)) {
    if (!field.classList.contains("invalid")) {
      field.classList.add("invalid");
      field.classList.remove("valid");

      errors.phone = true;

      message(field, "Enter a valid phone number");
    }
  } else {
    field.classList.add("valid");
    field.classList.remove("invalid");

    errors.phone = false;

    // check if the field have error message or not
    // get the error message
    let errorMessage = field.parentElement.lastElementChild;
    if (errorMessage.classList.contains("validate-message")) {
      errorMessage.remove();
    }
  }
}

// add custom message on validation
function message(el, msg) {
  el.insertAdjacentHTML("afterend", `<p class="validate-message">${msg}</p>`);
}

// show the corresponding question appear on selecting the option
let committeeSelect = document.querySelector("select#committee");

// remove all other questions
document.querySelectorAll(".question").forEach(item => {
  item.style.display = "none";
});
// handle the change event in the select box
committeeSelect.addEventListener("change", function() {
  // remove all other questions
  document.querySelectorAll(".question").forEach(item => {
    item.style.display = "none";
  });

  // show the corresponding question appear on selecting the option
  document.querySelectorAll(`.${this.value}`).forEach(q => {
    if (q) {
      q.style.display = "block";
    }
  });
  if (document.querySelector(`.${this.value}`)) {
    document.querySelector(`.${this.value}`).style.display = "block";
  }
});

// show the input for 'other' choice appear on selecting the option
let universitySelect = document.querySelector("select#university");

// handle the change event in the select box
universitySelect.addEventListener("change", function() {
  if (this.value == "other") {
    showOtherOption(this);
  } else {
    this.parentElement.nextElementSibling.style.display = "none";
  }
});

// show the input for 'other' choice appear on selecting the option
let facultySelect = document.querySelector("select#faculty");

// handle the change event in the select box
facultySelect.addEventListener("change", function() {
  if (this.value == "other") {
    showOtherOption(this);
  } else {
    this.parentElement.nextElementSibling.style.display = "none";
  }
  // show the "year selectbox"
  document.querySelector(".year").style.display = "block";
  if (this.value == "Engineering") {
    document.querySelector(".eng-dept").style.display = "block";
  } else {
    document.querySelector(".eng-dept").style.display = "none";
  }

  if (this.value == "pharmacyeuticals") {
    yearCount(5);
  } else if (this.value == "applied arts" || this.value == "Engineering") {
    yearCount(4);

    let option = document.createElement("option");
    option.innerHTML = "preparatory year";
    option.value = "preparatory";
    yearSelect.appendChild(option);
  } else if (this.value == "medicine") {
    yearCount(6);
  } else {
    yearCount(4);
  }
});

let yearSelect = document.querySelector("select#year");
// fill the select with the corresponding year count
function yearCount(count) {
  // TODO: remove all children of select before choose
  while (yearSelect.firstElementChild.nextElementSibling) {
    yearSelect.firstElementChild.nextElementSibling.remove();
  }

  for (let i = 1; i <= count; i++) {
    // create an option
    let option = document.createElement("option");

    // fil the content of the option
    if (i === 1) {
      option.innerHTML = i + "st year";
      option.value = i;
    } else if (i === 2) {
      option.innerHTML = i + "nd year";
      option.value = i;
    } else if (i === 3) {
      option.innerHTML = i + "rd year";
      option.value = i;
    } else {
      option.innerHTML = i + "th year";
      option.value = i;
    }

    // append to the select box
    yearSelect.appendChild(option);
  }
}

// show the input for 'other' choice
function showOtherOption(targetSelect) {
  let otherOption = targetSelect.parentElement.nextElementSibling;
  // show the input for 'other' choice appear on selecting the option
  otherOption.style.display = "block";

  // get the input of the other option
  let otherInput = otherOption.querySelector("input");

  // set the option value to input value
  otherInput.addEventListener("change", function() {
    // create an option with value of this input
    let option = document.createElement("option");
    // add the attribute "selected" to it
    option.setAttribute("selected", "selected");
    // set the value of the select box to the value of the input
    targetSelect.value = this.value;
    option.innerHTML = this.value;
    targetSelect.appendChild(option);
  });
}

// prevent scrolling on load
window.addEventListener("load", function() {
  btnHeader.innerHTML = "Click here to apply";

  submitBtn.value = "Register";

  btnHeader.disabled = false;

  // scroll to top on load
  window.scrollTo(0, 0);

  if (!errors.email && !errors.phone && !errors.textArea && !errors.empty) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }

  if (formFields[0].value.length > 0) {
    formFields.forEach(field => {
      validateEmpty(field);
    });
  }
});

// prevent scrolling on load
window.addEventListener("DOMContentLoaded", function() {
  document.body.style.overflow = "hidden";
});

// scroll to form on clicking on the button
let btnHeader = document.querySelector(".btn-header");

btnHeader.addEventListener("click", function() {
  // make the body scrollable back
  document.body.style.overflow = "auto";
  document.body.style.height = 2100 + "px";
  // scroll to form
  window.scrollTo(0, 650);

  setTimeout(() => {
    document.body.style.height = "auto";
  }, 1000);
  // animate the form
  document.querySelector(".card").classList.add("anime-form");
  document.querySelector("main .container").classList.remove("contain");
});

// show the terms and conditions modal
termsBtn = document.querySelector("#terms-click");
termsModal = document.querySelector("#tAc");

termsBtn.addEventListener("click", function(e) {
  e.preventDefault();
  termsModal.style.display = "block";
});
// hide when clicking any where except the modal
window.onclick = function(e) {
  if (e.target == termsModal) {
    termsModal.style.display = "none";
  }
};

// check if the terms is checked
let termsCheck = document.querySelector("#terms-check");

let submitBtn = document.querySelector("#regForm input[type='submit']");
submitBtn.disabled = true;

if (errors.email && errors.phone && errors.textArea && errors.empty) {
  submitBtn.disabled = true;
}
termsCheck.addEventListener("change", function() {
  if (document.querySelectorAll(".validate-message").length > 0) {
    document.querySelectorAll(".validate-message").forEach(item => {
      if (item.offsetParent !== null) {
        errors.empty = true;
      } else {
        errors.empty = false;
      }
    });
  } else {
    errors.empty = false;
  }

  if (this.checked) {
    formFields.forEach(field => {
      validateEmpty(field);

      // validate email
      if (field.type == "email") {
        validateEmail(field);
      }

      // validate phone
      if (field.type == "tel") {
        validatePhone(field);
      }

      // // validate textarea
      if (
        field.tagName.toLowerCase() == "textarea" &&
        field.hasAttribute("required")
      ) {
        validateTextArea(field);
      }
    });

    if (!errors.email && !errors.phone && !errors.textArea && !errors.empty) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  } else {
    submitBtn.disabled = true;
  }
});

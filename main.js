"use strict";
let colorPicker = {
  colors: [],
  selectors: {
    date: ".date",
    month: ".month",
    modal: ".modal",
    popup: "#Popup",
    todo: "#todo",
    currentGroup: "All",
    colorList: ".todo__container__color",
    groupColor: ".todo__container__color__name",
    nameColor: "input#nameColor",
    group: ".todo__navbar >ul > li",
    clearButton: "button#btnClear",
    buttonSave: "button#btnSave",
    copyButton: "button.copyButton",
    searchButton: "button#btnSearch",
    totalColors: ".total-colors",
    searchColor: "input#searchColor",
  },
  currentColorID: null,
  init: function () {
    this.loadColorsFromStorage();
    this.render();
    this.updateDateTime();
    this.registerMainEvents();
  },
  saveColorsToStorage: function () {
    window.localStorage.setItem("colors", JSON.stringify(this.colors));
  },
  loadColorsFromStorage: function () {
    const colorsFromStorage = window.localStorage.getItem("colors");
    if (colorsFromStorage) {
      this.colors = JSON.parse(colorsFromStorage);
    }
  },
  clearColors: function () {
    (this.colors = []), this.render();
    this.saveColorsToStorage();
  },
  render: function () {
    this.renderHTML();
    this.currentColors();
    this.stopMouseMove();
    this.openModal();
    this.getColorWhenMouseMove();
  },
  renderHTML: function () {
    let html = "";
    const filteredColors = this.filterColorsByGroup();
    filteredColors.forEach((color) => {
      const { id, group, name } = color;
      html += `<li class="todo__container__color__name">
                <div class="color">
                    <label class="${
                      group == "Light" ? "Dark" : ""
                    }" for="color">${name} (${group})</label>               
                </div>
                <button id="btnCopy-${id}" type="button" class="btn btn-primary copyButton" data-id="${id}">
                    <i class="fas fa-clipboard"></i>
                </button>
            </li>`;
    });
    const colorListContainer = document.querySelector(this.selectors.colorList);
    if (colorListContainer) {
      colorListContainer.innerHTML = html;
    }
  },
  addColor: function () {
    const nameColor = document
      .querySelector(this.selectors.nameColor)
      .value.trim();
    const select = document.getElementById("categoryColor");
    const value = select.options[select.selectedIndex].value;
    if (nameColor == "") {
      alert("Please enter name of color");
      return;
    }
    const newColor = {
      id: this.colors.length + 1,
      name: nameColor,
      group: value,
    };
    this.colors.push(newColor);
    $("#myModal").modal("hide");
    this.resetLabelInput();
    this.render();
    this.saveColorsToStorage();
  },
  changeGroup: function (event) {
    this.selectors.currentGroup = event.target.id;
    document.querySelectorAll(this.selectors.group).forEach((groupItem) => {
      groupItem.classList.remove("selected");
    });
    event.target.classList.add("selected");
    this.render();
  },
  filterColorsByGroup: function () {
    const result = this.colors.filter((color) => {
      if (this.selectors.currentGroup == "All") return color;
      return color.group === this.selectors.currentGroup;
    });
    return result;
  },
  registerMainEvents: function () {
    document
      .querySelector(this.selectors.buttonSave)
      .addEventListener("click", this.addColor.bind(this));
    document
      .querySelector(this.selectors.clearButton)
      .addEventListener("click", this.clearColors.bind(this));
    document
      .querySelector(this.selectors.searchButton)
      .addEventListener("click", this.searchColor.bind(this));
    document.querySelectorAll(this.selectors.copyButton).forEach((element) => {
      const that = this;
      element.addEventListener("click", function () {
        const currentColor = that.colors.find(
          (color) => color.id == element.getAttribute("data-id")
        );
        navigator.clipboard.writeText(currentColor.name);
      });
    });
    document.querySelectorAll(this.selectors.group).forEach((groupItem) => {
      groupItem.addEventListener("click", this.changeGroup.bind(this));
    });
  },
  getColorWhenMouseMove: function () {
    document.addEventListener(
      "mousemove",
      function (event) {
        const { clientX: x, clientY: y } = event;
        let element = document.elementFromPoint(x, y);
        let colorBackground = window.getComputedStyle(element);
        document.addEventListener("click", function (event) {
          event.stopPropagation();
          const color = colorBackground.backgroundColor;
          document.getElementById("color").innerHTML = "Color: " + color;
        });
      },
      true
    );
  },
  openModal: function () {
    document.addEventListener("click", function (event) {
      event.stopPropagation();
      $("#myModal").modal("show");
    });
  },
  stopMouseMove: function () {
    const modal = document.querySelector(this.selectors.modal);
    const popup = document.querySelector(this.selectors.popup);
    const todo = document.querySelector(this.selectors.todo);
    popup.addEventListener("mousemove", function (event) {
      event.stopPropagation();
    });
    todo.addEventListener("click", function (event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
    });
    modal.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  },
  resetLabelInput: function () {
    document.querySelector(this.selectors.nameColor).value = "";
    document.querySelector(this.selectors.searchColor).value = "";
  },
  currentColors: function () {
    if (this.colors.length > 1) {
      document.querySelector(this.selectors.totalColors).innerHTML =
        this.colors.length + " Colors";
    } else {
      document.querySelector(this.selectors.totalColors).innerHTML =
        this.colors.length + " Color";
    }
  },
  searchColor: function () {
    const searchColor = document.querySelector(
      this.selectors.searchColor
    ).value;
    const result = this.colors.find((color) => color.name === searchColor);
    this.resetLabelInput();
    let html = "";
    html += `<li class="todo__container__color__name">
                        <div class="color">
                            <label class="${
                              result.group == "Light" ? "Dark" : ""
                            }" for="color">${result.name} (${
      result.group
    })</label>               
                        </div>
                        <button id="btnCopy-${
                          result.id
                        }" type="button" class="btn btn-primary copyButton"  data-id="${
      result.id
    }">

                            <i class="fas fa-clipboard"></i>
                        </button>
                    </li>`;
    const colorListContainer = document.querySelector(this.selectors.colorList);
    if (colorListContainer) {
      colorListContainer.innerHTML = html;
    }
  },
  updateDateTime: function () {
    const date = new Date();
    const dayOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let seridalDay =
      date.getDate() === 1
        ? "st"
        : date.getDate() === 2
        ? "nd"
        : date.getDate() === 3
        ? "rd"
        : "th";
    document.querySelector(this.selectors.date).innerHTML =
      dayOfWeek[date.getDay()] + ", " + date.getDate() + seridalDay;
    document.querySelector(this.selectors.month).innerHTML =
      month[date.getMonth()];
  },
};
window.addEventListener("DOMContentLoaded", function () {
  colorPicker.init();
});

import emitter from "component-emitter";
import messagesFilter from "../../stringData";

export default class MessageOptions extends emitter {
  constructor(id) {
    super();
    this.id = id;
  }

  drawMessageOptions(filter) {
    this.optionsContainer = document.createElement("div");
    this.optionsContainer.classList.add("optionsContainer", "hidden");
    console.log('filter',filter)
    if (filter !== messagesFilter.favorites) {
      this.drawButton("toFavorite");
    }

    //Update button is not ready to use
    /*this.drawButton('update')*/
    this.drawButton("toPin");
    this.drawButton("delete");
    return this.optionsContainer;
  }

  drawButton(use) {
    const btn = document.createElement("button");
    btn.classList.add("msgOptionsBtn", "optionBtn");

    switch (use) {
      case "toFavorite":
        btn.classList.add("toFavorite");
        btn.addEventListener("click", () => {
          this.emit("toFavorite");
        });
        break;
      case "update":
        btn.classList.add("update");
        break;
      case "toPin":
        btn.classList.add("toPin");
        btn.addEventListener("click", () => {
          this.emit("setToPin");
        });
        break;
      case "delete":
        btn.classList.add("delete");
        btn.addEventListener("click", () => this.emit("deleteMessage"));
        break;
    }
    this.optionsContainer.appendChild(btn);
  }
}

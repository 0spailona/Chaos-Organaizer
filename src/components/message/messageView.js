import dateFormat from "dateformat";
import MessageOptions from "../messageOptions/messageOptions";
import emitter from "component-emitter";
import {replaceURLWithHTMLLinks} from "../../utils";


export default class MessageView extends emitter {
  constructor(container) {
    super();
    this.container = container;
  }

  static changeDateAndTypeFormat(message) {
    if (message.created) {
      message.created = dateFormat(message.created, "HH:MM");
    }
    const typeSlashPos = message.type.indexOf("/");
    message.fullType = message.type;
    message.type = message.type.slice(0, typeSlashPos);
  }

  drawMessage(data, reverse) {
    this.data = data;
    this.messageContainer = document.createElement("div");
    this.messageContainer.classList.add("messageContainer");

    const messageWrp = document.createElement("div");
    messageWrp.classList.add("messageWrp");

    const msgOptionsBtn = document.createElement("button");
    msgOptionsBtn.classList.add("msgOptionsBtn", "showOptions");
    msgOptionsBtn.addEventListener("click", this.showOptions.bind(this));

    messageWrp.appendChild(msgOptionsBtn);

    const {id, content, created} = this.data;
    this.message = document.createElement("div");
    this.message.classList.add("message");
    this.message.dataset.id = id;

    const textEl = document.createElement("div");

    textEl.innerHTML = replaceURLWithHTMLLinks(content.text.replaceAll("<", "&lt;")).replaceAll("\n", "<br>");
    textEl.classList.add("messageText");
    this.message.appendChild(textEl);

    if (content.id) {
      this.wrpFileContent = document.createElement("div");
      this.wrpFileContent.classList.add("wrpFileContent");
      this.message.classList.add("typeFile");
      this.drawFileMessage();
    } else {
      this.message.classList.add("typeText");
    }
    const timeEl = document.createElement("span");
    timeEl.classList.add("messageTime");
    timeEl.textContent = created;
    this.message.appendChild(timeEl);
    messageWrp.appendChild(this.message);
    this.messageContainer.appendChild(messageWrp);

    if (!reverse) {
      this.container.appendChild(this.messageContainer);
    } else {
      this.container.insertAdjacentElement("afterbegin", this.messageContainer);
    }
    this.drawMessageOptions();
  }

  drawMessageOptions() {
    const msgOptions = new MessageOptions();
    msgOptions.on("toFavorite", () => {
      this.emit("toFavoriteById", this.data.id);
      this.hideOptions();
    });
    msgOptions.on("setToPin", () => {
      this.emit("setToPinData", this.data);
      this.hideOptions();
    });
    msgOptions.on("deleteMessage", () => {
      this.emit("deleteMessageDyId", this.data.id);
      this.hideOptions();
    });
    this.options = msgOptions.drawMessageOptions();
    this.messageContainer.insertAdjacentElement("afterbegin", this.options);
  }

  showOptions() {
    this.options.classList.toggle("hidden");
    if (!this.options.classList.contains("hidden")) {
      this.emit("showOptions", this);
    }
  }

  hideOptions() {
    this.options.classList.add("hidden");
  }

  drawFileMessage() {
    const {type} = this.data;
    switch (type) {
      case "image":
        this.drawImage();
        break;
      case "video":
        this.drawVideo();
        break;
      case "audio":
        this.drawAudio();
        break;
      default:
        this.drawAnonymousFile();
    }
  }

  drawControlsWrp(content) {
    const controls = document.createElement("div");
    controls.classList.add("contentControls");
    this.drawControlBtn("load", controls, content);
    this.wrpFileContent.appendChild(controls);
  }

  drawControlBtn(use, controlsContainer, content) {
    if (use === "load") {
      const controlEl = document.createElement("a");
      controlEl.target = "_blank";
      controlEl.classList.add("contentControlsBtn");
      controlEl.href = content.download;
      controlEl.classList.add("loadBtn");
      controlEl.download = "content_name";
      controlsContainer.appendChild(controlEl);
    }
  }

  drawAnonymousFile() {
    const {content} = this.data;
    this.drawControlsWrp(content);
    const fileImgAndName = document.createElement("div");
    fileImgAndName.classList.add("wrpAnotherType");

    const typeImg = document.createElement("div");
    typeImg.classList.add("anotherFileTypeImg");
    fileImgAndName.appendChild(typeImg);

    const fileName = document.createElement("span");
    fileName.classList.add("anotherFileName");
    fileName.textContent = content.name;
    fileImgAndName.appendChild(fileName);

    this.wrpFileContent.appendChild(fileImgAndName);
    this.message.appendChild(this.wrpFileContent);
  }

  drawVideo() {
    const {content} = this.data;
    this.drawControlsWrp(content);
    const video = document.createElement("video");
    video.classList.add("videoMsg");
    video.src = content.href;
    video.controls = true;
    this.wrpFileContent.appendChild(video);
    this.message.appendChild(this.wrpFileContent);
  }

  drawImage() {
    this.wrpFileContent.querySelector(".brokenImg")?.remove();
    const {content} = this.data;
    this.drawControlsWrp(content);
    const img = document.createElement("img");
    img.classList.add("imgMsg");
    img.src = content.href;
    img.onerror = e => {
      e.target.remove();
      const defaultImg = document.createElement("div");
      defaultImg.classList.add("brokenImg");
      this.wrpFileContent.appendChild(defaultImg);
    };
    img.alt = content.text;
    this.wrpFileContent.appendChild(img);
    this.message.appendChild(this.wrpFileContent);
  }

  drawAudio() {
    const {content, fullType} = this.data;
    this.drawControlsWrp(content);
    const audio = document.createElement("audio");
    audio.classList.add("audioMsg");
    audio.src = content.href;
    audio.type = fullType;
    audio.preload = "auto";
    audio.controls = true;
    this.wrpFileContent.appendChild(audio);
    this.message.appendChild(this.wrpFileContent);
  }

  removeMessage() {
    this.messageContainer.remove();
  }
}

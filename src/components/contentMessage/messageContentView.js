import emitter from "component-emitter";
import {filter} from "core-js/internals/array-iteration";

export default class MessageContentView extends emitter {
  constructor(container, filter) {
    super();
    this.container = container;
    this.filter = filter;
  }

  drawContentMessage(data) {
    this.data = data;
    const {content} = this.data;
    console.log('drawContentMessage data', data)
    this.contentContainer = document.createElement('div');
    this.contentContainer.classList.add('containerContainer');

    this.fileEl = document.createElement('div');
    this.fileEl.classList.add('typeImgAndDescription')
    this.drawTypeImg()

    const description = document.createElement('span')
    description.classList.add('contentMessageDescription')
    description.textContent = content.text

    this.fileEl.appendChild(description)
    this.contentContainer.appendChild(this.fileEl)

    const controlEl = document.createElement('a');
    controlEl.classList.add('contentControlsBtn');
    controlEl.href = content.href;
    controlEl.classList.add('loadBtn');
    controlEl.download = 'content_name'
    this.contentContainer.appendChild(controlEl)

    this.container.appendChild(this.contentContainer)
  }

  drawTypeImg() {
    const typeFileEl = document.createElement('div');
    typeFileEl.classList.add('typeFileImg');

    switch (this.filter) {
      case 'video':
        typeFileEl.classList.add('videoFile')
        break
      case 'audio':
        typeFileEl.classList.add('audioFile')
        break
      case 'img':
        typeFileEl.classList.add('imgFile')
        break
      default:
        typeFileEl.classList.add('anotherFile')
        break;
    }

    this.fileEl.appendChild(typeFileEl)
  }

}

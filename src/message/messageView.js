import dateFormat from "dateformat";

export default class MessageView {
  constructor(container) {
    this.container = container;
  }

  drawMessage(data, reverse) {
    this.data = data
    //console.log('drawMessage', data)
    const {id, content, created} = this.data;
    this.message = document.createElement('div');
    this.message.classList.add('message')
    this.message.dataset.id = id;
    let textEl

    if (content.text.includes('http://') || content.text.includes('https://')) {
      textEl = document.createElement('a');
      textEl.href = content.text;
      textEl.target = '_blank'
    } else {
      textEl = document.createElement('span');
    }
    textEl.classList.add('messageText')
    textEl.textContent = content.text;
    this.message.appendChild(textEl)

    if (content.href) {
      this.wrpFileContent = document.createElement('div');
      this.wrpFileContent.classList.add('wrpFileContent');
      this.message.classList.add('typeFile')
      this.drawFileMessage()
    } else {
      this.message.classList.add('typeText')
    }
    const timeEl = document.createElement('span');
    timeEl.classList.add('messageTime');
    timeEl.textContent = created;
    this.message.appendChild(timeEl)
    if (!reverse) {
      this.container.appendChild(this.message)
    } else{
      this.container.insertAdjacentElement("afterbegin", this.message)
    }

  }

  drawFileMessage() {
    const {type} = this.data;
    switch (type) {
      case 'image':
        this.drawImage()
        break
      case 'video':
        this.drawVideo()
        break
      case 'audio':
        this.drawAudio()
        break
      default:
        this.drawAnonymousFile()
    }
  }

  drawAnonymousFile() {
    const {content} = this.data;
    const fileImgAndName = document.createElement('div');
    fileImgAndName.classList.add('wrpAnotherType');

    const typeImg = document.createElement('div');
    typeImg.classList.add('anotherFileTypeImg');
    fileImgAndName.appendChild(typeImg)

    const fileName = document.createElement('span');
    fileName.classList.add('anotherFileName');
    fileName.textContent = content.name;
    fileImgAndName.appendChild(fileName)

    this.wrpFileContent.appendChild(fileImgAndName)
    this.message.appendChild(this.wrpFileContent)
  }

  drawVideo() {
    const {content} = this.data;
    const video = document.createElement('video');
    video.classList.add('videoMsg');
    video.src = 'http://localhost:7070' + content.href;
    video.controls = true;
    this.wrpFileContent.appendChild(video)
    this.message.appendChild(this.wrpFileContent)
  }

  drawImage() {
    const {content} = this.data;
    const img = document.createElement('img');
    img.classList.add('imgMsg')
    img.src = 'http://localhost:7070' + content.href
    this.wrpFileContent.appendChild(img)
    this.message.appendChild(this.wrpFileContent)
  }

  drawAudio() {
    const {content, fullType} = this.data;
    const audio = document.createElement('audio');
    audio.classList.add('audioMsg');
    audio.src = 'http://localhost:7070' + content.href;
    audio.type = fullType;
    audio.preload = 'auto';
    audio.controls = true;
    this.wrpFileContent.appendChild(audio)
    this.message.appendChild(this.wrpFileContent)
  }

  static changeDateAndTypeFormat(message) {
    if(message.created){
      message.created = dateFormat(message.created, 'HH:MM');
    }
    const typeSlashPos = message.type.indexOf('/');
    message.fullType = message.type;
    message.type = message.type.slice(0, typeSlashPos);
  }


  drawPinMessage() {

  }
}

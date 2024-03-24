export default class MessageView {
  constructor(container) {
    this.container = container;
  }

  drawMessage(data) {
    this.data = data
    console.log('drawMessage', data)
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

    this.container.appendChild(this.message)
  }

  drawFileMessage() {
    const{type} = this.data;
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
  }

  drawVideo() {
    const {content} = this.data;
    const video = document.createElement('video');
    video.classList.add('videoMsg');
    video.src = 'http://localhost:7070' + content.href;
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
    const {content} = this.data;
  }

  drawPinMessage() {

  }
}

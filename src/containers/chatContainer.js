import MessageView from "../message/messageView";
import dateFormat from "dateformat";
export default class ChatContainer {
  constructor(container, eventHandlers) {
    this.container = container;
    this.eventHandlers = eventHandlers
    this.messageContainer = this.container.querySelector('.messageContainer');
    this.dateLastMsg = ''/// after first load list messages;
  }

  async addListeners() {
    const changeFormBtn = this.container.querySelector('.changeFormBtn');
    changeFormBtn.addEventListener('click', this.changeForm.bind(this));

    this.fileInput = this.container.querySelector('.fileInput');
    this.fileInput.addEventListener('input', this.showDataChosenFile.bind(this))

    this.textForm = this.container.querySelector('.sendText');
    this.fileForm = this.container.querySelector('.sendFile');

    this.textForm.addEventListener('submit', this.sendText.bind(this));
    this.fileForm.addEventListener('submit', this.sendFile.bind(this));

    await this.drawFirstDrawListMessages(0)

    this.eventHandlers.scrollDownContainer.call(this,this.messageContainer)
    this.messageContainer.addEventListener('scroll', (e) => this.eventHandlers.scrollContainer.call(this,e.target))
  }

  // load last save messages
  async drawFirstDrawListMessages(sumMsgHeight) {
    let containerHeight;
    const lastMessages = await this.eventHandlers.loadLastMessages.call(this);

    if (lastMessages.length > 0) {
      this.drawMessageList(lastMessages);
      containerHeight = this.messageContainer.clientHeight;
      for (const msg of this.messageContainer.querySelectorAll('.message')) {
        console.log('sumHeight', sumMsgHeight)
        if (sumMsgHeight > containerHeight) {
          break
        } else {
          sumMsgHeight += msg.clientHeight
        }
      }
    }

    if (sumMsgHeight <= containerHeight) {
      await this.drawFirstDrawListMessages(sumMsgHeight)
    }
  }

  drawMessageList(list) {
    //console.log('drawMessageList', list)
    for (const message of list) {
      this.checkLastMsgDate(message)
      MessageView.changeDateAndTypeFormat(message)
      const msgView = new MessageView(this.messageContainer);
      msgView.drawMessage(message, true)
    }
  }


  checkLastMsgDate(msgFullData) {
    const dateMsg = dateFormat(msgFullData.created, 'dd.mm.yy');
    if (this.dateLastMsg < dateMsg) {
      this.dateLastMsg = dateMsg
    }
  }

  // sendTextForm <-> sendFileForm
  changeForm(e) {
    if (this.textForm.classList.contains('visibleForm')) {
      e.target.classList.remove('changeFileFormBtn');
      e.target.classList.add('changeTextFormBtn');
    } else {
      e.target.classList.remove('changeTextFormBtn');
      e.target.classList.add('changeFileFormBtn');
    }

    this.textForm.classList.toggle('visibleForm');
    this.fileForm.classList.toggle('visibleForm');

    this.dataChosenFile = this.container.querySelector('.dataChosenFile');
    this.inputDescribe = this.container.querySelector('.inputDescribe');
    this.chosenFileName = this.container.querySelector('.chosenFileName');
    this.typeEl = this.container.querySelector('.chosenFileType');
  }

  // sendFileForm changing
  showDataChosenFile(e, file) {
    //console.log('showDataChosenFile', e.target.files[0])
    if (!file) {
      file = e.target.files[0];
    }
    this.dataChosenFile.style.display = 'inline-flex';
    this.inputDescribe.style.display = 'block';
    this.chosenFileName.textContent = file.name;
    const typeSlashPos = file.type.indexOf('/');
    const type = file.type.slice(0, typeSlashPos);
    this.toggleChosenFileTypeShowElem(type)
  }

  toggleChosenFileTypeShowElem(type) {
    switch (type) {
      case 'image':
        this.typeEl.classList.toggle('typeImg');
        break
      case 'video':
        this.typeEl.classList.toggle('typeVideo');
        break
      case 'audio':
        this.typeEl.classList.toggle('typeAudio');
        break
      default:
        this.typeEl.classList.toggle('typeAnother')
    }
  }

  hideChosenFileData() {
    this.dataChosenFile.style.display = 'none';
    this.inputDescribe.style.display = 'none';
    this.chosenFileName.textContent = '';
  }

  //send messages
  async sendText(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);
    await this.eventHandlers.sendMessage.call(this, obj.text)
    e.target.reset()
  }

  async sendFile(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);
    const file = this.dropFile ? this.dropFile : obj.file
    file.text = obj.text;
    await this.eventHandlers.sendMessage.call(this, file)
    const typeSlashPos = file.type.indexOf('/');
    this.toggleChosenFileTypeShowElem(file.type.slice(0, typeSlashPos));
    this.hideChosenFileData()
    this.dropFile = undefined;
    e.target.reset()
  }

  async dragAndDrop(e) {
    e.preventDefault();
    this.dropFile = e.dataTransfer.files[0];
    console.log('sendFileByDragAndDrop this.dropFile', this.dropFile);
    this.showDataChosenFile(e, this.dropFile)
  }

  drawNewMessage(fullData){
    this.checkLastMsgDate(fullData)
    MessageView.changeDateAndTypeFormat(fullData)
    const msgView = new MessageView(this.messageContainer);
    msgView.drawMessage(fullData, false)
    this.eventHandlers.scrollDownContainer.call(this,this.messageContainer)
  }

}

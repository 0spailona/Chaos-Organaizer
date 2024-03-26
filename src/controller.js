import MessageView from "./message/messageView";
import dateFormat from "dateformat";

export default class Controller {
  constructor(container, api) {
    this.container = container;
    this.api = api;
    this.dateLastMsg = ''/// after first load list messages;
    this.messageContainer = this.container.querySelector('.messageContainer');
    this.start = 0;
    this.limit = 10;
  }

  init() {
    if (!this.container) {
      console.log('DOM Error');
      return
    }
    this.bindToDOM()

  }

  async bindToDOM() {
    const changeFormBtn = this.container.querySelector('.changeFormBtn');
    changeFormBtn.addEventListener('click', this.changeForm.bind(this));

    this.fileInput = this.container.querySelector('.fileInput');
    this.fileInput.addEventListener('input', this.showDataChosenFile.bind(this))

    this.textForm = this.container.querySelector('.sendText');
    this.fileForm = this.container.querySelector('.sendFile');

    this.textForm.addEventListener('submit', this.sendText.bind(this));
    this.fileForm.addEventListener('submit', this.sendFile.bind(this));

    await this.drawFirstDrawListMessages(0)
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight - this.messageContainer.clientHeight;
    this.messageContainer.addEventListener('scroll', this.onScrollContainer.bind(this))

    //document.addEventListener('dragover', e => e.preventDefault());
    //document.addEventListener('drop', e=> e.preventDefault());
    this.container.addEventListener('dragover', e => e.preventDefault());
    this.container.addEventListener('drop', this.dragAndDrop.bind(this))
  }

  loadSaveData() {
    return this.loadLastMessages();
  }

  async loadLastMessages() {
    const list = await this.api.getLastMessagesList(this.start, this.limit)
    this.start += this.limit;
    return list
  }

  async drawFirstDrawListMessages(sumMsgHeight) {
    let containerHeight;
    const lastMessages = await this.loadSaveData();

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
    console.log('after', sumMsgHeight)
    console.log('after', containerHeight)
    if (sumMsgHeight <= containerHeight) {
      console.log('in if', sumMsgHeight)
      await this.drawFirstDrawListMessages(sumMsgHeight)
    }
  }

  drawMessageList(list) {
    //console.log('drawMessageList', list)
    for (const message of list) {
      this.checkLastMsgData(message)
      this.changeDateAndTypeFormat(message)
      const msgView = new MessageView(this.messageContainer);
      msgView.drawMessage(message, true)
    }
  }

  changeDateAndTypeFormat(message) {
    message.created = dateFormat(message.created, 'HH:MM');
    const typeSlashPos = message.type.indexOf('/');
    message.fullType = message.type;
    message.type = message.type.slice(0, typeSlashPos);
  }

  setPinMessage() {

  }

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

  showDataChosenFile(e,file) {
    //console.log('showDataChosenFile', e.target.files[0])
    if(!file){
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

  async sendText(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);
    const msgFullData = await this.api.createNewTextMsg(obj.text);
    this.checkLastMsgData(msgFullData)
    this.changeDateAndTypeFormat(msgFullData)
    const msgView = new MessageView(this.messageContainer);
    msgView.drawMessage(msgFullData, false)
    e.target.reset()
  }

  async sendFile(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);
    const file = this.dropFile ? this.dropFile : obj.file
    file.text = obj.text;
    const msgFullData = await this.api.createNewFileMsg(file);
    this.dropFile = undefined;
    this.checkLastMsgData(msgFullData)
    this.changeDateAndTypeFormat(msgFullData)
    const msgView = new MessageView(this.messageContainer);
    msgView.drawMessage(msgFullData, false)
    this.toggleChosenFileTypeShowElem(msgFullData.type);
    this.hideChosenFileData()
    e.target.reset()
  }

  async dragAndDrop(e) {
    e.preventDefault();
    this.dropFile = e.dataTransfer.files[0];
    console.log('sendFileByDragAndDrop this.dropFile',this.dropFile);
    this.showDataChosenFile(e,this.dropFile)
  }
  checkLastMsgData(msgFullData) {
    const dateMsg = dateFormat(msgFullData.created, 'dd.mm.yy');
    if (this.dateLastMsg < dateMsg) {
      this.dateLastMsg = dateMsg
    }

  }

  async onScrollContainer(e) {
    //console.log('pos Y', e.target.scrollTop)
    //console.log('height',e.target.clientHeight * 0.2)
    if (e.target.scrollTop === 0) {
      const newList = await this.loadLastMessages();
      console.log('onScrollContainer new list', newList)
      if (newList.length > 0) {
        this.drawMessageList(newList)
      }
    }
  }



  /*submitForm(e) {



    console.log("obj", obj);

    //const name = obj.files[0].name
    //console.log('formdata', data)
   //
    //console.log('name', obj.file.size)
    const file = obj.file;
    console.log('from formData',file)
   const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      console.log('reader', e)
      const img = this.container.querySelector('.img')
      img.src = e.target.result;
      this.container.appendChild(img)
    })

    reader.readAsDataURL(file)
    const newData = this.api.createNewMsg(file)
  }

  getFileFromInput(e) {
    //console.log(e)
    //console.dir(e.target)

    const file = e.target.files[0]
    console.log('from input',file)
    /*const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      console.log('reader', e)
      const img = this.container.querySelector('.img')
      img.src = e.target.result;
      this.container.appendChild(img)
    })

    reader.readAsDataURL(file)
  }*/
}

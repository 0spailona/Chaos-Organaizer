import MessageView from "./message/messageView";
import dateFormat from "dateformat";

export default class Controller {
  constructor(container, api) {
    this.container = container;
    this.api = api;
    this.dateLastMsg = ''/// after first load list messages;
    this.messageContainer = this.container.querySelector('.messageContainer')
  }

  init() {
    if (!this.container) {
      console.log('DOM Error');
      return
    }
    this.bindToDOM()
  }

  bindToDOM() {
    const changeFormBtn = this.container.querySelector('.changeFormBtn');
    changeFormBtn.addEventListener('click', this.changeForm.bind(this));

    const fileInput = this.container.querySelector('.fileInput');
    fileInput.addEventListener('input',this.showDataChosenFile.bind(this))

    this.textForm = this.container.querySelector('.sendText');
    this.fileForm = this.container.querySelector('.sendFile');

    this.textForm.addEventListener('submit', this.sendText.bind(this))
    this.fileForm.addEventListener('submit', this.sendFile.bind(this))
    /*const form = this.container.querySelector('form');
    form.addEventListener('submit', this.submitForm.bind(this));
    const fileInput = form.querySelector('.fileInput');
    fileInput.addEventListener('input', this.getFileFromInput.bind(this))*/
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
  }


  showDataChosenFile(e){
    const file = e.target.files[0];
    console.log('showDataFile',file.type);
    this.container.querySelector('.dataChosenFile').style.display = 'inline-flex';
    this.container.querySelector('.inputDescribe').style.display = 'block';
    this.container.querySelector('.chosenFileName').textContent = file.name;
    const typeEl = this.container.querySelector('.chosenFileType');
    const typeSlashPos = file.type.indexOf('/');
    const type = file.type.slice(0,typeSlashPos)
    switch (type){
      case 'image':
        typeEl.classList.add('typeImg');
        break
      case 'video':
        typeEl.classList.add('typeVideo');
        break
      case 'audio':
        typeEl.classList.add('typeAudio');
        break
      default:
        typeEl.classList.add('typeAnother')
    }
  }

  async sendText(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);
    const msgFullData = await this.api.createNewTextMsg(obj.text);
    console.log('msgFullData', msgFullData.created);
    this.checkLastMsgData(msgFullData)
    msgFullData.created = dateFormat(msgFullData.created, 'HH:MM');
    const msgView = new MessageView(this.messageContainer);
    msgView.drawMessage(msgFullData)
    console.log(this.dateLastMsg)
    e.target.reset()
  }

  async sendFile(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);
    const file = obj.file;
    file.text = obj.text;
    console.log('fullMsg', file)
    const msgFullData = await this.api.createNewFileMsg(obj.file);
    console.log('fullMsg', msgFullData)
    this.checkLastMsgData(msgFullData)
    msgFullData.created = dateFormat(msgFullData.created, 'HH:MM');

    const typeSlashPos = msgFullData.type.indexOf('/');
    msgFullData.type = msgFullData.type.slice(0,typeSlashPos)
    const msgView = new MessageView(this.messageContainer);
    msgView.drawMessage(msgFullData)

    e.target.reset()
  }

  checkLastMsgData(msgFullData){
    const dateMsg = dateFormat(msgFullData.created, 'dd.mm.yy');
    if (this.dateLastMsg < dateMsg) {
      this.dateLastMsg = dateMsg
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

import emitter from "component-emitter";

export default class Form extends emitter{

  constructor(container) {
    super();
    this.container = container;
    this.addListeners()
  }
  addListeners(){
    const changeFormBtn = this.container.querySelector('.changeFormBtn');
    changeFormBtn.addEventListener('click', this.changeForm.bind(this));

    this.fileInput = this.container.querySelector('.fileInput');
    this.fileInput.addEventListener('input', this.showDataChosenFile.bind(this))

    this.textForm = this.container.querySelector('.sendText');
    this.fileForm = this.container.querySelector('.sendFile');

    this.textForm.addEventListener('submit', this.sendText.bind(this));
    this.fileForm.addEventListener('submit', this.sendFile.bind(this));
  }

  // sendTextForm <-> sendFileForm
  changeForm(e) {
    if (this.fileForm.classList.contains('hidden')) {
      e.target.classList.remove('toFileFormBtn');
      e.target.classList.add('toTextFormBtn');
    } else {
      e.target.classList.remove('toTextFormBtn');
      e.target.classList.add('toFileFormBtn');
    }

    this.textForm.classList.toggle('hidden');
    this.fileForm.classList.toggle('hidden');

    this.dataChosenFile = this.container.querySelector('.dataChosenFile');
    this.inputDescribe = this.container.querySelector('.inputDescribe');
    this.chosenFileName = this.container.querySelector('.chosenFileName');
    this.typeEl = this.container.querySelector('.chosenFileType');
  }

  // sendFileForm changing
  showDataChosenFile(e, file) {
    console.log('form showDataChosenFile', file)
    this.dropFile = file ? file : this.dropFile;
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
    this.emit('sendMessage',obj.text)
    e.target.reset()
  }

  async sendFile(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);
    const file = this.dropFile ? this.dropFile : obj.file
    file.text = obj.text;
    this.emit('sendMessage',file)
    const typeSlashPos = file.type.indexOf('/');
    this.toggleChosenFileTypeShowElem(file.type.slice(0, typeSlashPos));
    this.hideChosenFileData()
    this.dropFile = undefined;
    e.target.reset()
  }


}

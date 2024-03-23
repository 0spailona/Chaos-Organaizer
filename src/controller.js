export default class Controller {
  constructor(container, api) {
    this.container = container;
    this.api = api;
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

    this.textForm = this.container.querySelector('.sendText');
    this.fileForm = this.container.querySelector('.sendFile');

    this.textForm.addEventListener('submit',this.sendText.bind(this))
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

  sendText(e){
    e.preventDefault();
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);
    console.log('obj', obj)

    e.target.reset()
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

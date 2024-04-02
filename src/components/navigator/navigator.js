import emitter from "component-emitter";

export default class Navigator extends emitter {
  constructor() {
    super();
    this.navEl = document.querySelector('nav');
    this.contentTypesButtons = this.navEl.querySelector('.contentTypesButtons')

    for (const btn of this.navEl.querySelectorAll('.chooseTypeContent')) {
      btn.addEventListener('click', this.getContentType.bind(this))
    }

    for (const btn of this.navEl.querySelectorAll('.navBtn')) {
      btn.addEventListener('click', this.showContentView.bind(this))
    }

    this.nameSectionEl = document.querySelector('.sectionName')
    this.nameSection = this.nameSectionEl.textContent;
  }

  toggleVisibleNav() {

    this.navEl.classList.toggle('hidden')
    console.log('nav toggle')
  }

  hideNav(){
    if(!this.navEl.classList.contains('hidden')) {
      this.navEl.classList.add('hidden')
      console.log('nav hidden')
    }
  }
  showContentView(e) {
    const nameChosenContent = e.target.textContent
    if(nameChosenContent === this.nameSection) return;
    if (nameChosenContent !== 'Content') this.emit('onMode', nameChosenContent)
    else {
      this.toggleVisibleContentTypeNav()
      return
    }
    this.nameSectionEl.textContent = nameChosenContent;
    this.nameSection = nameChosenContent;
    this.toggleVisibleNav()
    if(!this.contentTypesButtons.classList.contains('hidden')) this.toggleVisibleContentTypeNav()
  }

  toggleVisibleContentTypeNav() {
    this.contentTypesButtons.classList.toggle('hidden')
  }

  getContentType(e) {
    console.log('getContentType', e.target.dataset.type)
   const nameChosenContent = e.target.dataset.type;
    this.emit('onMode', nameChosenContent)
    this.nameSectionEl.textContent = `Content: ${nameChosenContent}`;
    this.nameSection = nameChosenContent;
    this.toggleVisibleNav();
    this.toggleVisibleContentTypeNav()
  }

  hideAnotherContainers() {

  }

}

import emitter from "component-emitter";
import messagesFilter from "../../stringData";
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

  }

  toggleVisibleNav() {

    this.navEl.classList.toggle('hidden')
    console.log('nav toggle')
  }

  hideNav() {
    if (!this.navEl.classList.contains('hidden')) {
      this.navEl.classList.add('hidden')
      console.log('nav hidden')
    }
  }

  showContentView(e) {
    const nameChosenContent = e.target.textContent
    this.emit('getSectionName')
    //console.log('navigator showContentView this.sectionName', this.sectionName)
    if (nameChosenContent === this.sectionName) {
      this.toggleVisibleNav()
      return
    }
    ;
    if (nameChosenContent !== messagesFilter.content) this.emit('onMode', nameChosenContent)
    else {
      this.toggleVisibleContentTypeNav()
      return
    }
    this.emit('changeSectionNameInUI', nameChosenContent)
    //this.nameSectionEl.textContent = nameChosenContent;
    this.sectionName = nameChosenContent;
    this.toggleVisibleNav()
    if (!this.contentTypesButtons.classList.contains('hidden')) this.toggleVisibleContentTypeNav()
  }

  setSectionName(name) {
    this.sectionName = name
  }

  toggleVisibleContentTypeNav() {
    this.contentTypesButtons.classList.toggle('hidden')
  }

  getContentType(e) {
    console.log('getContentType', e.target.dataset.type)
    const nameChosenContent = e.target.dataset.type;
    this.emit('onMode', nameChosenContent)
    this.emit('changeSectionNameInUI', nameChosenContent)
    this.sectionName = nameChosenContent
    this.toggleVisibleNav();
    this.toggleVisibleContentTypeNav()
  }

}

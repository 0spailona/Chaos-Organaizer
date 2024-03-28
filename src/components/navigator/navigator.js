export default class Navigator {
  constructor() {
    this.navEl = document.querySelector('nav');
    this.toggleNavBtn = document.querySelector('#toggleNavBtn');
    this.toggleNavBtn.addEventListener('click', this.toggleVisible.bind(this))

  }

  toggleVisible() {
    console.log('toggle nav')
    this.navEl.classList.toggle('hidden')
  }
}

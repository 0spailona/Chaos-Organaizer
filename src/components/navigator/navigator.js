export default class Navigator {
  constructor() {
    this.navEl = document.querySelector('nav');
    this.toggleNavBtn = document.querySelector('#toggleNavBtn');
    this.toggleNavBtn.addEventListener('click', this.toggleVisible.bind(this));

    this.messageBtn = this.navEl.querySelector('.showMessageBtn');
    this.favoritesBtn = this.navEl.querySelector('.showFavoritesBtn');
    this.contentBtn = this.navEl.querySelector('.showContentBtn');

    for (const btn of this.navEl.querySelectorAll('.navBtn')) {
      btn.addEventListener('click', this.showContentView.bind(this))
    }
  }

  toggleVisible() {
    console.log('toggle nav')
    this.navEl.classList.toggle('hidden')
  }

  showContentView() {
    console.log('showContentView')
  }

  hideAnotherContainers() {

  }

}

import emitter from "component-emitter";

export default class SearchForm extends emitter {
  constructor() {
    super();
    this.formContainer = document.querySelector('.searchFormWrp')
    this.form = document.querySelector('.searchForm')
    this.form.addEventListener('submit',this.submitForm.bind(this))
  }

  toggleVisibleForm() {
    this.formContainer.classList.toggle('hidden')
  }

  hideForm() {
    if (!this.formContainer.classList.contains('hidden')) {
      this.formContainer.classList.add('hidden')
    }
  }

  submitForm(e){
    e.preventDefault()
    const data = new FormData(e.target);
    const obj = Object.fromEntries(data);
    this.emit('search', obj.search)
    e.target.reset()
    this.hideForm()
  }
}

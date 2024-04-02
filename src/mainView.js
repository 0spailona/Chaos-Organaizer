import ContentView from "./components/contentView/contentView";
import SendForm from "./components/forms/sendForm";
import Navigator from "./components/navigator/navigator";
import PinMessage from "./components/pinMMessage/pinMessage";
import SearchForm from "./components/forms/searchForm";
import emitter from "component-emitter";
import {proxyEvent} from "./utils";
import {filter} from "core-js/internals/array-iteration";

export default class MainView extends emitter{
  constructor(container) {
    super();
    this.rootContainer = container;
  }

  async bindToDOM() {
    this.navigator = new Navigator();
    this.toggleNavBtn = document.querySelector('#toggleNavBtn');
    this.toggleNavBtn.addEventListener('click', this.toggleVisibleNav.bind(this));
    //const formsContainer = this.rootContainer.querySelector('.forms');
    this.sendForm = new SendForm(this.rootContainer)

    const contentContainerEl = this.rootContainer.querySelector('.container')
    this.contentView = new ContentView(contentContainerEl);

    proxyEvent(this.contentView, this, 'needMoreMessages');
    //this.contentView.on('needMoreMessages',()=>this.emit('needMoreMessages'))

    proxyEvent(this.sendForm, this, 'sendMessage');
    //this.forms.on('sendMessage',(msg) => this.emit('sendMessage',msg))

    proxyEvent(this.navigator, this, 'onMode');
    //this.navigator.on('onMode',(nameChosenContent)=>this.emit('onMode',nameChosenContent))
    //proxyEvent(this.contentView, this, 'toFavorite');
    this.contentView.on('toFavorite', (id) => this.emit('toFavorite',id))
    this.contentView.on('setToPin', (data) => this.emit('setToPin',data))
    this.contentView.on('deleteMessage',(id) => this.emit('deleteMessage',id))

    this.rootContainer.addEventListener('dragover', e => e.preventDefault());
    this.rootContainer.addEventListener('drop', this.dragAndDrop.bind(this));

    const pinAndAlertContainer = this.rootContainer.querySelector('.pinAndAlertMessages')
    this.pinMessage = new PinMessage(pinAndAlertContainer);
    this.pinMessage.on('deletePin',() => this.emit('deletePin'))

    this.searchForm = new SearchForm();
    const showSearchFormBtn = this.rootContainer.querySelector('#searchBtn')
    showSearchFormBtn.addEventListener('click', this.toggleVisibleSearchForm.bind(this))
    this.searchForm.on('search',(data) => this.emit('search',data))
  }

  toggleVisibleNav(){
    this.navigator.toggleVisibleNav()
    this.searchForm.hideForm()
  }

  toggleVisibleSearchForm(){
    this.searchForm.toggleVisibleForm()
    this.navigator.hideNav()
  }
  dragAndDrop(e) {
    e.preventDefault();
    this.sendForm.showDataChosenFile(e, e.dataTransfer.files[0])
  }

   addMessages(list,filter){
    //console.log('addMessages',list)
     this.contentView.drawMessageList(list,filter)
  }

  addOneMessage(msg){
     this.contentView.drawOneMessage(msg,false)
  }

  cleanContentView(){
    this.contentView.cleanContentContainer()
    this.pinMessage.removePin()
  }

  hideForms(){
    this.sendForm.hideAllForms()

  }

  showForms(){
    this.sendForm.showAllForms()
  }

  setPinMessage(msg){
    this.pinMessage.addMessage(msg)
  }

  removePin(){
    this.pinMessage.removePin()
  }

  removeMessage(id){
    this.contentView.removeMessage(id)
  }

  showTextForm(){
    this.sendForm.changeForm()
  }
}

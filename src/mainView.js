import ContentView from "./components/contentView/contentView";
import Form from "./components/forms/form";
import Navigator from "./components/navigator/navigator";
import PinMessage from "./components/pinMMessage/pinMessage";
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

    //const formsContainer = this.rootContainer.querySelector('.forms');
    this.forms = new Form(this.rootContainer)

    const contentContainerEl = this.rootContainer.querySelector('.container')
    this.contentView = new ContentView(contentContainerEl);

    proxyEvent(this.contentView, this, 'needMoreMessages');
    //this.contentView.on('needMoreMessages',()=>this.emit('needMoreMessages'))

    proxyEvent(this.forms, this, 'sendMessage');
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
  }

  dragAndDrop(e) {
    e.preventDefault();
    this.forms.showDataChosenFile(e, e.dataTransfer.files[0])
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
    this.forms.hideAllForms()

  }

  showForms(){
    this.forms.showAllForms()
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
}

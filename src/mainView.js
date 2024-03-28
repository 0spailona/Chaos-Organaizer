import ContentView from "./components/contentView/contentView";
import Form from "./components/forms/form";
import Navigator from "./components/navigator/navigator";
import emitter from "component-emitter";

export default class MainView extends emitter{
  constructor(container) {
    super();
    this.rootContainer = container;
  }

  async bindToDOM() {
    const navigator = new Navigator();

    const formsContainer = this.rootContainer.querySelector('.forms');
    this.forms = new Form(formsContainer)

    const contentContainerEl = this.rootContainer.querySelector('.container')
    this.contentView = new ContentView(contentContainerEl);

    this.contentView.on('needMoreMessages',()=>this.emit('needMoreMessages'))
    this.forms.on('sendMessage',(msg) => this.emit('sendMessage',msg))

    this.rootContainer.addEventListener('dragover', e => e.preventDefault());
    this.rootContainer.addEventListener('drop', this.dragAndDrop.bind(this));
  }

  dragAndDrop(e) {
    e.preventDefault();
    this.forms.showDataChosenFile(e, e.dataTransfer.files[0])
  }

   addMessages(list){
     this.contentView.drawMessageList(list)
  }

  addOneMessage(msg){
     this.contentView.drawOneMessage(msg,false)
  }

}

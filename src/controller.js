import MessageView from "./message/messageView";
import dateFormat from "dateformat";
import Container from "./components/container";
import Form from "./components/form";

export default class Controller {
  constructor(container, api) {
    this.rootContainer = container;
    this.api = api;
    this.start = 0;
    this.limit = 10;
  }

  init() {
    if (!this.rootContainer) {
      console.log('DOM Error');
      return
    }
    this.bindToDOM()

  }

  async bindToDOM() {
    const formsContainer = this.rootContainer.querySelector('.forms');
    this.forms = new Form(formsContainer,{
      sendMessage: this.sendMessage.bind(this)
    })
    this.forms.addListeners()

    const containerEl = this.rootContainer.querySelector('.container')
    this.contentContainer = new Container(containerEl,{
      scrollContainer: this.onScrollContainer.bind(this),
      scrollDownContainer:this.scrollDown.bind(this),
      loadLastMessages:this.loadLastMessages.bind(this),
      showDataChosenFile: this.forms.showDataChosenFile.bind(this)
    });
    await this.contentContainer.addListeners()

    this.rootContainer.addEventListener('dragover', e => e.preventDefault());
    this.rootContainer.addEventListener('drop', this.contentContainer.dragAndDrop.bind(this))
  }

  async loadLastMessages() {
    const list = await this.api.getLastMessagesList(this.start, this.limit)
    this.start += this.limit;
    return list
  }

  scrollDown(container){
    container.scrollTop = container.scrollHeight - container.clientHeight;
  }
  setPinMessage() {

  }

  async sendMessage(data){
    let msgFullData;
    if(typeof(data)!=='string'){
      console.log('typeOf file',typeof(data))
      msgFullData = await this.api.createNewFileMsg(data);
    } else {
      console.log('typeOf text',data.typeOf)
      msgFullData = await this.api.createNewTextMsg(data);
    }
    this.contentContainer.drawNewMessage(msgFullData)
  }

  async onScrollContainer(container) {
    //console.log('onScrollContainer',container.scrollTop)
    if (container.scrollTop === 0) {
      const newList = await this.loadLastMessages();
      if (newList.length > 0) {
        this.contentContainer.drawMessageList(newList)
      }
    }
  }

}

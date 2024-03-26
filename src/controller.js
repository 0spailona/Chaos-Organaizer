import MessageView from "./message/messageView";
import dateFormat from "dateformat";
import ChatContainer from "./containers/chatContainer";

export default class Controller {
  constructor(container, api) {
    this.container = container;
    this.api = api;
    this.start = 0;
    this.limit = 10;
  }

  init() {
    if (!this.container) {
      console.log('DOM Error');
      return
    }
    this.bindToDOM()

  }

  async bindToDOM() {
    const chatContainerEl = this.container.querySelector('.chat')
    this.chatContainer = new ChatContainer(chatContainerEl,{
      sendMessage: this.sendMessage.bind(this),
      scrollContainer: this.onScrollContainer.bind(this),
      scrollDownContainer:this.scrollDown.bind(this),
      loadLastMessages:this.loadLastMessages.bind(this)
    });
    await this.chatContainer.addListeners()

    this.container.addEventListener('dragover', e => e.preventDefault());
    this.container.addEventListener('drop', this.chatContainer.dragAndDrop.bind(this))
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
    this.chatContainer.drawNewMessage(msgFullData)
  }

  async onScrollContainer(container) {
    //console.log('onScrollContainer',container.scrollTop)
    if (container.scrollTop === 0) {
      const newList = await this.loadLastMessages();
      if (newList.length > 0) {
        this.chatContainer.drawMessageList(newList)
      }
    }
  }

}

import MessageView from "./components/message/messageView";
import dateFormat from "dateformat";
import ContentView from "./components/contentView/contentView";
import Form from "./components/forms/form";
import Navigator from "./components/navigator/navigator";

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
    const navigator = new Navigator();

    const formsContainer = this.rootContainer.querySelector('.forms');
    this.forms = new Form(formsContainer, {
      sendMessage: this.sendMessage.bind(this)
    })
    this.forms.addListeners()

    const contentContainerEl = this.rootContainer.querySelector('.container')
    this.contentContainer = new ContentView(contentContainerEl, {
      scrollContainer: this.onScrollContainer.bind(this),
      needMoreMessages:this.needMoreMessages.bind(this)
    });
    await this.contentContainer.addListeners()


    const lastListMessages = await this.loadLastMessages();
    //console.log(lastListMessages)
    await this.contentContainer.drawMessageList(this.filterMessages(lastListMessages));

    this.rootContainer.addEventListener('dragover', e => e.preventDefault());
    this.rootContainer.addEventListener('drop', this.dragAndDrop.bind(this));
  }

  filterMessages(list){
    for(const msg of list){
      if(msg.content.id){
        msg.content.href = `${this.api.url}/content/${msg.content.id}`;
      }
    }

    return list
  }


  async loadLastMessages() {
    const list = await this.api.getLastMessagesList(this.start, this.limit)
    this.start += this.limit;
    return list
  }

  async needMoreMessages() {
    const newList = await this.loadLastMessages();
    if(newList.length < 0) return null
    return this.filterMessages(newList)
  }

  dragAndDrop(e) {
    e.preventDefault();
    this.forms.showDataChosenFile(e, e.dataTransfer.files[0])
  }

  setPinMessage() {

  }

  async sendMessage(data) {
    //console.log('sendMessage',data)
    let msgFullData;
    if (typeof (data) !== 'string') {
      //console.log('typeOf file',typeof(data))
      msgFullData = await this.api.createNewFileMsg(data);
    } else {
      //console.log('typeOf text',typeof(data))
      msgFullData = await this.api.createNewTextMsg(data);
    }
    //console.log(msgFullData)
    //this.contentContainer.drawNewMessage(msgFullData)
    this.contentContainer.drawOneMessage(msgFullData, false)
  }

  async downloadContent() {
    console.log('download')
  }

  async onScrollContainer() {
    const newList = await this.loadLastMessages();
    if (newList.length > 0) {
      await this.contentContainer.drawMessageList(newList)
    }
  }


}

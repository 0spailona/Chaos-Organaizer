export default class Controller {
  constructor(view, api) {
    this.view = view;
    this.api = api;
    this.start = 0;
    this.limit = 10;

    this.view.on('needMoreMessages', this.needMoreMessages.bind(this))
    this.view.on('sendMessage', this.sendMessage.bind(this))
    this.view.on('onMode', this.mode.bind(this))
    this.init()
  }

  async init() {
    if (!this.view) {
      console.log('DOM Error');
      return
    }
    await this.view.bindToDOM()
    await this.needMoreMessages();
  }


  processMessages(list) {

    if (this.filter) {
      console.log('processMessages', this.filter)
      //return list
    }

    if (list.length === 0) return list
    for (const msg of list) {
      if (msg.content.id) {
        msg.content.href = `${this.api.url}/content/${msg.content.id}`;
      }
    }

    return list
  }

  async needMoreMessages() {
    let newList = await this.api.getLastMessagesList(this.start, this.limit)
    this.start += this.limit;
    console.log('needMoreMessages',newList)
    if (newList.length === 0) {
      this.view.addMessages(newList)
      return

    }
    newList = this.processMessages(newList)
    this.view.addMessages(newList)
  }


  setPinMessage() {

  }

  async sendMessage(data) {
    let msgFullData;
    if (typeof (data) !== 'string') {
      msgFullData = await this.api.createNewFileMsg(data);
    } else {
      msgFullData = await this.api.createNewTextMsg(data);
    }
    this.view.addOneMessage(msgFullData)
  }

  async mode(filter) {
    console.log('mode', filter)
    switch (filter) {
      case 'Messages':

        break
      case 'Favorites':
        this.start = 0;
        this.filter = filter;
        this.view.cleanContentView()
        //await this.needMoreMessages()
        break
      case 'Content':
        break
    }
    //console.log('mode')
  }
}

import messagesFilter from "./stringData";
export default class Controller {
  constructor(view, api) {
    this.view = view;
    this.api = api;
    this.start = 0;
    this.limit = 10;
    this.filter = messagesFilter.messages

    this.view.on('needMoreMessages', this.needMoreMessages.bind(this))
    this.view.on('sendMessage', this.sendMessage.bind(this))
    this.view.on('onMode', this.mode.bind(this))
    this.view.on('toFavorite', this.toFavorite.bind(this))
    this.view.on('setToPin', this.setPinMessage.bind(this))
    this.view.on('deletePin', this.deletePin.bind(this))
    this.view.on('deleteMessage', this.deleteMessage.bind(this))
    this.view.on('search', this.searchMessagesByText.bind(this))
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

  async checkPin() {
    const pin = await this.api.getPin()
    if (pin) this.view.setPinMessage(pin)
  }

  processMessages(list) {
    if (list.length === 0) return list
    for (const msg of list) {
      if (msg.content.id) {
        msg.content.href = `${this.api.url}/content/${msg.content.id}`;
      }
    }

    return list
  }


  async needMoreMessages() {
    const options = {start:this.start, limit:this.limit, filter:this.filter,searchText:null}
    this.start += this.limit;

    const list = await this.getMessagesList(options)
   if(!list) return


    this.view.addMessages(list, this.filter)
    if (this.filter === messagesFilter.messages) {
      await this.checkPin()
    }
  }

  async getMessagesList(options){
    const newList = await this.api.getLastMessagesList(options)

    //console.log('needMoreMessages', newList)
    if (newList.length === 0) {
      return null
    }
    return this.processMessages(newList)
  }


  async searchMessagesByText(data) {
    this.filter = messagesFilter.search
    const options = {start:0, limit:this.limit, filter:this.filter,searchText:data}

    const list = await this.getMessagesList(options)
    if(!list) return

    this.view.cleanContentView()
    this.view.addMessages(list, this.filter)
  }

  async setPinMessage(data) {
    const pin = await this.api.setToPin(data.id)
    //console.log('controller setPinMessage pin', pin);
    this.view.setPinMessage(pin)
  }

  async deletePin() {
    const result = await this.api.deletePinFromServer()
    //console.log(result)
    if (result) this.view.removePin()

  }

  async sendMessage(data) {
    //console.log('controller sendMessage', data)
    let msgFullData;
    if (typeof (data) !== 'string') {
      msgFullData = await this.api.createNewFileMsg(data);
      msgFullData.content.href = `${this.api.url}/content/${msgFullData.content.id}`;
    } else {
      msgFullData = await this.api.createNewTextMsg(data);
    }
    this.view.addOneMessage(msgFullData)
    this.view.showTextForm()
  }



  async toFavorite(id) {
    //console.log('controller toFavorite id', id)
    if (!await this.api.toFavorite(id)) {
      alert('This message was not added to favorite')
    }
  }

  async deleteMessage(id) {
    //console.log('deleteMessage id', id)
    const result = await this.api.deleteMessage(id)
    if (!result) {
      console.log('deleteMessage false', result)
    }
    //console.log('deleteMessage true', result)
    this.view.removeMessage(id)
  }

  async mode(filter) {
    this.filter = filter;
    this.start = 0;
    this.view.cleanContentView();
    if (filter !== messagesFilter.messages) this.view.hideForms()
    else this.view.showForms()
    //console.log('mode', filter)
  }
}

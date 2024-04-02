export default class Controller {
  constructor(view, api) {
    this.view = view;
    this.api = api;
    this.start = 0;
    this.limit = 10;

    this.view.on('needMoreMessages', this.needMoreMessages.bind(this))
    this.view.on('sendMessage', this.sendMessage.bind(this))
    this.view.on('onMode', this.mode.bind(this))
    this.view.on('toFavorite', this.toFavorite.bind(this))
    this.view.on('setToPin', this.setPinMessage.bind(this))
    this.view.on('deletePin', this.deletePin.bind(this))
    this.view.on('deleteMessage',this.deleteMessage.bind(this))
    this.view.on('search',this.searchText.bind(this))
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

  async checkPin(){
    const pin = await this.api.getPin()
    if(pin) this.view.setPinMessage(pin)
  }
  processMessages(list) {

    if (this.filter) {
      //console.log('processMessages', this.filter)
      list = this.filterMessages(list)
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

  filterMessages(list) {
    //console.log('controller filterMessages list before filter', list)
    switch (this.filter) {
      case 'Messages':
        return list
      case 'Favorites':
        return list.filter(msg => msg.isFavorite);
      case 'video':
        return list.filter(msg => msg.type.startsWith('video/'));
      case 'audio':
        return list.filter(msg => msg.type.startsWith('audio/'));
      case 'img':
        return list.filter(msg => msg.type.startsWith('image/'));
      case 'anotherType':
        list.filter(msg => msg.content.id);
        list.filter(msg => !msg.type.startsWith('video/'));
        list.filter(msg => !msg.type.startsWith('audio/'));
        list.filter(msg => !msg.type.startsWith('image/'));
        return list
    }

  }

  async needMoreMessages() {
    let newList = await this.api.getLastMessagesList(this.start, this.limit)
    this.start += this.limit;
    console.log('needMoreMessages', newList)
    if (newList.length === 0) {
      //this.view.addMessages(newList)
      return

    }
    newList = this.processMessages(newList)
    this.view.addMessages(newList, this.filter)
    if(!this.filter || this.filter === 'Messages'){
      await this.checkPin()
    }
  }


  async setPinMessage(data) {
    const pin = await this.api.setToPin(data.id)
    console.log('contoller setPinMessage pin', pin);
    this.view.setPinMessage(pin)
  }

  async deletePin() {
    const result = await this.api.deletePinFromServer()
    console.log(result)
    if(result) this.view.removePin()

  }

  async sendMessage(data) {
    console.log('controller sendMessage', data)
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

  async searchText(data){
    console.log('controller searchText', data)
  }
  async toFavorite(id) {
    console.log('controller toFavorite id', id)
    if (!await this.api.toFavorite(id)) {
      alert('This message was not added to favorite')
    }
  }

  async deleteMessage(id){
    console.log('deleteMessage id',id)
    const result = await this.api.deleteMessage(id)
    if(!result){
      console.log('deleteMessage false',result)
    }
    console.log('deleteMessage true',result)
    this.view.removeMessage(id)
  }

  async mode(filter) {
    this.filter = filter;
    this.start = 0;
    this.view.cleanContentView();
    if (filter !== 'Messages') this.view.hideForms()
    else this.view.showForms()
    console.log('mode', filter)
  }
}

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
    console.log('controller filterMessages list before filter',list)
    switch (this.filter) {
      case 'Messages':
        return list
      case 'Favorites':
        return list.filter(msg => msg.isFavorite);
      case 'Content':

        break
    }
    console.log('list after filter',list)
    return list
  }

  async needMoreMessages() {
    let newList = await this.api.getLastMessagesList(this.start, this.limit)
    this.start += this.limit;
    console.log('needMoreMessages', newList)
    if (newList.length === 0) {
      this.view.addMessages(newList)
      return

    }
    newList = this.processMessages(newList)
    this.view.addMessages(newList)
  }


  async setPinMessage(data) {
    const pin = await this.api.setToPin(data)
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

  async toFavorite(id) {
    console.log('controller toFavorite id', id)
    if (!await this.api.toFavorite(id)) {
      alert('This message was not added to favorite')
    }
  }

  async mode(filter) {
    this.filter = filter;
    this.start = 0;
    this.view.cleanContentView();
    console.log('mode', filter)
    /*switch (this.filter) {
      case 'Messages':

        break
      case 'Favorites':



        //await this.needMoreMessages()
        break
      case 'Content':
        break
    }*/
    //console.log('mode')
  }
}

import MessageView from "../message/messageView";
import dateFormat from "dateformat";
export default class Container {
  constructor(container, eventHandlers) {
    this.container = container;
    this.eventHandlers = eventHandlers
    //this.messageContainer = this.container.querySelector('.messageContainer');
    this.dateLastMsg = ''/// after first load list messages;
  }

  async addListeners() {
    await this.drawFirstDrawListMessages(0)

    this.eventHandlers.scrollDownContainer.call(this,this.container)
    this.container.addEventListener('scroll', (e) => this.eventHandlers.scrollContainer.call(this,e.target))
  }

  // load last save messages
  async drawFirstDrawListMessages(sumMsgHeight) {
    let containerHeight;
    const lastMessages = await this.eventHandlers.loadLastMessages.call(this);

    if (lastMessages.length > 0) {
      this.drawMessageList(lastMessages);
      containerHeight = this.container.clientHeight;
      for (const msg of this.container.querySelectorAll('.message')) {
        console.log('sumHeight', sumMsgHeight)
        if (sumMsgHeight > containerHeight) {
          break
        } else {
          sumMsgHeight += msg.clientHeight
        }
      }
    }

    if (sumMsgHeight <= containerHeight) {
      await this.drawFirstDrawListMessages(sumMsgHeight)
    }
  }

  drawMessageList(list) {
    //console.log('drawMessageList', list)
    for (const message of list) {
      this.checkLastMsgDate(message)
      MessageView.changeDateAndTypeFormat(message)
      const msgView = new MessageView(this.container);
      msgView.drawMessage(message, true)
    }
  }


  checkLastMsgDate(msgFullData) {
    const dateMsg = dateFormat(msgFullData.created, 'dd.mm.yy');
    if (this.dateLastMsg < dateMsg) {
      this.dateLastMsg = dateMsg
    }
  }


  async dragAndDrop(e) {
    e.preventDefault();
    this.dropFile = e.dataTransfer.files[0];
    //console.log('sendFileByDragAndDrop this.dropFile', this.dropFile);
    this.eventHandlers.showDataChosenFile.call(this, this.dropFile)
  }

  drawNewMessage(fullData){
    this.checkLastMsgDate(fullData)
    MessageView.changeDateAndTypeFormat(fullData)
    const msgView = new MessageView(this.container);
    msgView.drawMessage(fullData, false)
    this.eventHandlers.scrollDownContainer.call(this,this.container)
  }

}

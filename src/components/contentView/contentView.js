import MessageView from "../message/messageView";
import dateFormat from "dateformat";
export default class ContentView {
  constructor(container, eventHandlers) {
    this.container = container;
    this.eventHandlers = eventHandlers

  }

  async addListeners() {
    this.scrollDown()
    //console.log('scrollHeight',this.container.scrollHeight)
    this.container.addEventListener('scroll', (e) => {
      if (e.target.scrollTop !== 0) return
      this.eventHandlers.scrollContainer.call(this, e.target)
    })
  }
  scrollDown() {
    this.container.scrollTop = this.container.scrollHeight - this.container.clientHeight;
  }

  async drawMessageList(list) {
    //console.log('drawMessageList', list)
    for (const message of list) {
      ////if(this.checkLastMsgDate(message))///////
      this.drawOneMessage(message,true)
    }
    if(this.container.scrollHeight === 0){
      const newList = await this.eventHandlers.needMoreMessages.call(this);
      if(newList) await this.drawMessageList(newList)
    }
  }

  drawOneMessage(msg, revers) {
    //console.log('drawOneMessage',msg)
    MessageView.changeDateAndTypeFormat(msg)
    const msgView = new MessageView(this.container);
    msgView.drawMessage(msg, revers)
    this.scrollDown(this.container)
  }

  checkLastMsgDate(msgFullData) {
    const dateMsg = dateFormat(msgFullData.created, 'dd.mm.yy');
    if (this.dateLastMsg < dateMsg) {
      this.dateLastMsg = dateMsg;
      return true
    }
    return false;
  }

}

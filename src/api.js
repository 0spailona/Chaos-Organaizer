export default class Api {
  constructor(url) {
    this.url = url;
  }

  async createNewFileMsg(file){
    console.log(file);
    console.log(file.type)
    const url = this.url + `/messages`
    const request = fetch(url,{
      method: "POST",
      headers: {
        'Content-Type':file.type,
        'X-File-Name': file.name
      },
      body: file
    })
    /*const result = await request;
    if(!result.ok){
      console.log('Ticket was not created')
      return
    }
    return await result.json();*/
  }

  async createNewTextMsg(text){
    console.log(text);
    const url = this.url + `/messages`
    const request = fetch(url,{
      method: "POST",
      headers: {
        'Content-Type':file.type,
        'X-File-Name': file.name
      },
      body: file
    })
    /*const result = await request;
    if(!result.ok){
      console.log('Ticket was not created')
      return
    }
    return await result.json();*/
  }

}

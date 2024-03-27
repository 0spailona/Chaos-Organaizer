export default class Api {
  constructor(url) {
    this.url = url;
  }

  async createNewFileMsg(file){
    const url = this.url + `/messages/file`
    const request = fetch(url,{
      method: "POST",
      headers: {
        'Content-Type':file.type,
        'X-File-Name': file.name,
        'X-File-describe': file.text,
      },
      body: file
    })
    const result = await request;
    if(!result.ok){
      console.log(result.json())
      return
    }
    return await result.json();
  }

  async createNewTextMsg(text){
    console.log('api text',text);
    const url = this.url + `/messages/text`
    const request = fetch(url,{
      method: "POST",
      headers: {
        'Content-Type':'text/plain'
      },
      body: text
    })
    const result = await request;
    if(!result.ok){
      console.log(result.json())
      return
    }
    return await result.json();
  }

  async getLastMessagesList(start,limit){
    const url = this.url + `/messages?start=${start}&limit=${limit}`;
    const request = fetch(url,{
      method: "GET"
    })
    const result = await request;
    if(!result.ok){
      console.log(result.json())
      return
    }
    return await result.json();
  }

  getContentHref(id){

  }

}

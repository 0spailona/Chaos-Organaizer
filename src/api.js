import messagesFilter from "./stringData";
import {isCyrillicSymbols} from "./utils";
export default class Api {
  constructor(url) {
    this.url = url;
  }

  async createNewFileMsg(file){
    if(isCyrillicSymbols(file.name)){

    }

    console.log('api is need translit',isCyrillicSymbols(file.name))




    const url = this.url + `/messages/file`
    const request = fetch(url,{
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type':file.type,
        'X-File-Name': encodeURI(file.name),
        'X-File-describe': encodeURI(file.text),
      },
      body: file
    })
    const result = await request;
    if(!result.ok){
      console.log(result.text())
      return
    }
    return await result.json();
  }

  async createNewTextMsg(text){
    //console.log('api text',text);
    const url = this.url + `/messages/text`
    const request = fetch(url,{
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type':'text/plain'
      },
      body: text
    })
    const result = await request;
    if(!result.ok){
      console.log(result.text())
      return
    }
    return await result.json();
  }

  async getLastMessagesList(options){
    const {start,limit,filter,searchText} = options
    let url
    if(searchText) url = this.url + `/messages?start=${start}&limit=${limit}&text=${searchText}`;
    else if(filter && filter!== messagesFilter.messages && filter!== messagesFilter.search){
      if(filter === messagesFilter.favorites) url = this.url + `/messages?start=${start}&limit=${limit}&favorite=${true}`;
     else url = this.url + `/messages?start=${start}&limit=${limit}&type=${filter}`;
    }
    else url = this.url + `/messages?start=${start}&limit=${limit}`;
    const request = fetch(url,{
      method: "GET",
      credentials: 'include'
    })
    const result = await request;
    if(!result.ok){
      console.log(result.text())
      return
    }
    return await result.json();
  }



  async toFavorite(id){
    const url = this.url + `/messages/${id}`
    const request = fetch(url,{
      method: "PATCH",
      credentials: 'include',
      body: true
    })
    const result = await request;
    if(!result.ok){
      console.log(result.text())
      return false
    }
    return true;
  }

  async setToPin(id){
    const url = this.url + `/messages/pin`
    const request = fetch(url,{
      method: "PUT",
      credentials: 'include',
      body: id
    })
    const result = await request;
    if(!result.ok){
      console.log(result.text())
      return
    }
    return await result.json();
  }

  async deletePinFromServer(){
    const url = this.url + `/messages/pin`;
    const request = fetch(url,{
      method: "DELETE",
      credentials: 'include',
    })
    const result = await request;
    if(!result.ok){
      console.log(result.text())
    }
    return result
  }

  async deleteMessage(id){
    const url = this.url + `/messages/${id}`
    const request = fetch(url,{
      method: "DELETE",
      credentials: 'include',
    })
    const result = await request;
    if(!result.ok){
      console.log(result.text())
      return false
    }
    return true;
  }

  async getPin(){
    const url = this.url + `/messages/pin`;
    const request = fetch(url,{
      method: "GET",
      credentials: 'include',
    })
    const result = await request;
    if(result.status === 201){
      console.log('api getPin',result)
      return false
    }
    return await result.json();
  }


}

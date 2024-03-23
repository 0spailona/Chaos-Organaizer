import Controller from "./controller";
import Api from "./api";

const url = 'http://localhost:7070/api'

const api = new Api(url)

const container = document.querySelector('#root')
const controller = new Controller(container,api);
controller.init()

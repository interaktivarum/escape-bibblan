module.exports = class Group {
  constructor(id) {
    this.id = id;
    this.iRoom = -1;
    this.state = "play";
    this.script = null;
    this.clients = [];
  }

  /*addClientID (idClient) {
    idsClient.push(idClient)  
  }

  removeClientID(idClient){
    idsClient = idsClient.filter(id => id !== idClient);
  }*/

};

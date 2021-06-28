var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

var Client = require("./client.js");
var Group = require("./group.js");
var CodeHandler = require("./codeHandler.js");

var clients = [];
//var groups = [];

const PORT = process.env.PORT || 3000;

/*app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});*/

io.on("connection", function(socket) {

  socket.idClient = null;

  console.log("client connected: " + socket.id);

  // Tell self of own id
  socket.emit("id", { id: socket.id });

  // METHODS
  function getClientByID(id) {
    return clients.find(c => c.id === id);
  }

  function getRoomById(id) {
    return socket.adapter.rooms[id]
  }

  function getGroupById(id) {
    let room = getRoomById(id)
    return room ? room.group : null
  }

  /*function getClientIdsInSelfGroup() {
    let group = getSelfRoom()
    if(group){
      return group.sockets.map(s => clients.find(c => c.idSocket === s))
    }
    else{
      return []
    }
  }*/

  function getSelfClient() {
    return getClientByID(socket.idClient);
  }

  function getSelfRoom() {
    let client = getSelfClient()
    return socket.adapter.rooms[client.idGroup]
  }

  function getSelfGroup() {
    let room = getSelfRoom()
    return room ? room.group : null;
  }

  // EMIT METHODS

  /*function emitSelfUpdate() {
    let client = getSelfClient();
    if (client) {
      socket.emit("clients_updated", { client: client });
    }
  }*/

  function emitGroupUpdate(r) {
    let room = r ? r : getSelfRoom();
    if (room) {
      let g = room.group;
      //g.clients = Object.keys(room.sockets).map(s => clients.find(c => c.idSocket === s))
      io.to(room.group.id).emit("group_updated", { group: g });
    }
  }

  /*function emitRoomClientsUpdate(s) {
    let room = r ? r : getSelfRoom();
    if (room) {
      let clients = getClientsByRoom(room);
      io.emit("clients_updated", { clients: clients });
    }
  }*/

  /*function emitToClient(idClient,name,msg) {
    let client = getClientByID(idClient);
    io.to(client.idSocket).emit(name,msg);
  };*/

  function notifySelf(msg, type) {
    socket.emit("notify_client", {
      msg: msg,
      type: type ? type : "info"
    });
  }

  /*function notifyClient(idClient, msg, type) {
    let client = getClientByID(idClient);
    io.to(client.idSocket).emit("notify_client", {
      msg: msg,
      type: type ? type : "info"
    });
  }*/

  function notifyRoom(msg, type) {
    let room = getSelfRoom();
    if (room) {
      io.to(room.group.id).emit("notify_client", {
        msg: msg,
        type: type ? type : "info"
      });
    }
  }

  //CLIENT EVENTS

  socket.on("test_notify", function(data) {

    notifySelf(
      data.msg,
      "positive"
    );

    console.log(
      "Test notify, " + socket.id + ": " + data.msg
    );
    
  });

  socket.on("register_client_id", function(data) {
    let client = getClientByID(data.id);
    if (client) {
      client.idSocket = socket.id;
    } else {
      client = new Client(socket.id);
      clients.push(client);
    }
    socket.idClient = client.id;

    socket.emit("client_id_registered", {
      client: client
    });

    console.log(
      "Socket:" + socket.id + " registered as Client:" + socket.idClient
    );
    
  });

  socket.on("generate_code", function(callback) {
    let code = CodeHandler.generateCode();
    callback({
      code: code
    });
  });

  socket.on("join_group", function(data) {

    console.log(data)

    if (!data.id) {
      notifySelf("Ange gruppnamn", "error");
      return;
    }

    let client = getSelfClient();
    if(client){

      client.idGroup = data.id
      socket.join(data.id);

      var group = getGroupById(data.id);
      if (!group) {
        group = new Group(data.id);
      }

      let room = getSelfRoom();
      room.group = group

      //Add client to group - needs to be stored here too, to handle automatic disconnection
      if(!group.clients.includes(client)){
        group.clients.push(client)
      }

      //Set script
      if(!group.script){
        group.script = data.script
      }
      
      emitGroupUpdate();

      notifySelf(
        "Du har gått med i gruppen " + data.id,
        "positive"
      );
      console.log("join_group: " + data.id);
    }
    else{
      console.log("ERROR: join_group: " + data.id);
      console.log(data);
      console.log(clients);
      console.log(client);
    }
  });

  socket.on("leave_group", function(data) {

    if (!data.id) {
      return;
    }

    let client = getSelfClient();

    let group = getSelfGroup()
    group.clients = group.clients.filter(c => c !== client);

    client.idGroup = null;
    socket.leave(data.id);

    let room = socket.adapter.rooms[data.id]

    emitGroupUpdate(room);
    socket.emit("group_updated", { group: null });

    notifySelf(
      "Du har lämnat gruppen " + data.id,
      "positive"
    );

    console.log("leave_group: " + data.id);
  });

  // Update client ready
  socket.on("set_client_ready", function(data) {
    let client = getSelfClient();
    client.ready = data.ready;
    emitGroupUpdate();
  });

  // Update client state
  socket.on("set_client_state", function(data) {
    let client = getSelfClient();
    client.state = data.state;
    emitGroupUpdate();
  });

  // Update client personal
  socket.on("set_client_personal", function(data) {
    
    let client = getSelfClient();

    client.personal = data.merge ? {...data.personal, ...client.personal} : data.personal;
    
    emitGroupUpdate();

    console.log("setClientName " + JSON.stringify(data));
  });

  // Update client personal
  socket.on("set_group_start", function(data) {
    
    //let group = getGroupById(data.id);
    let group = getSelfGroup()
    
    group.script = data.script;
    group.state = 'play';
    group.iRoom = 0;
    
    emitGroupUpdate();
    io.to(group.id).emit("group_started");

    console.log("set_group_script " + JSON.stringify(data));
  });

  // Next room
  socket.on("set_group_next_room", function(data) {
    
    //let group = getGroupById(data.id);
    let group = getSelfGroup()

    group.iRoom++;
    
    emitGroupUpdate();

    //notifySelf("Du och din grupp befinner er nu i rum " + group.idRoom + "!", "positive");

    console.log("set_next_room " + JSON.stringify(data));
  });

  // Show clue
  socket.on("show_clue", function(data) {
    
    //let group = getGroupById(data.id);
    let group = getSelfGroup()

    group.script.rooms[data.idRoom].clues[data.idClue].show = true;
    group.script.rooms[data.idRoom].clues[data.idClue].used = data.used;
    
    emitGroupUpdate();

  });

   // Add guess
   socket.on("add_guess", function(data) {
    
    let group = getSelfGroup()

    if(!group.script.rooms[data.idRoom].guesses){
      group.script.rooms[data.idRoom].guesses = []
    }
    group.script.rooms[data.idRoom].guesses.push(data.guess)
    
    emitGroupUpdate();

  });

  // Remove self if disconnected
  socket.on("disconnect", function() {
    console.log("client disconnected " + socket.idClient);
  });
});

http.listen(PORT, () => {
  console.log("listening on *:" + PORT);
});

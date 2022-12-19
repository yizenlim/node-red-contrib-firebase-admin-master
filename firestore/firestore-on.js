let msgin;
let unsub;

module.exports = function (RED) {
  function FirebaseAdmin(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    if (config.cred) {
      let c = RED.nodes.getNode(config.cred);
      this.admin = c.admin;
    }

    const setup = (path,msg) => {
      if (unsub) {
        unsub();
      }

      unsub = this.admin.firestore().doc(path).onSnapshot((res)=>{

        cb(res,msg);
      });
    };

    const cb = (res,msg) => {
      console.log( msg);

      console.dir( msg);

      console.log("firestore get result " + res);
      // console.dir(res);
      let val = res.data();
      console.dir(res.data());

      console.log("val=" );
      console.dir( val);

      if (msg) {
        msg.payload = val;
        node.send(msg);
      } else {
        node.send({ payload: val });
      }
    };

    node.on(
      "input",
      function (msg) {
        if (msg && msg.payload) {
          // msgin = msg;
          console.log("msg" );
          // console.dir(msg);

          const path = msg.payload.path;

          console.log(`Path is ${path}`);
          setup(path,msg);
        }
      }.bind(this)
    );

    if (config.path) {
      setup(config.path);
    }
  }
  RED.nodes.registerType("firestore-on", FirebaseAdmin);
};

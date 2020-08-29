const app = require("express")();
//const http = require("http").Server(app);

const http = require("http").createServer(app);

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

const port = process.env.ExpressPort || 3100;
const myroute = require("./routes").routes;
startMyServer();
// const sessions = require("./sessions");
// const myLoginPassport = require('./passport');


// sessions.initSessionStore(app).then(() => {
//     myLoginPassport.configure(app);
//     startMyServer();
// });

function startMyServer() {
    http.listen(port, () => {
        console.log(`listening on port no. ${port}`)
        myroute.establishRoutes(app);
    })
}
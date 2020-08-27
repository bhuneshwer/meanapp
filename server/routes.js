(function() {


    function establishRoutes(app) {

        const Utils = require("./utils").Utils

        app.use(require("express").static("../client"))


        app.get('/welcome', (req, res) => {
            res.send(`Welcome ${req.query.username} at ${req.query.companyname}`);
        })

        app.post('/welcome', (req, res) => {
            console.log("Req.", req.body)
            res.send(`Welcome ${req.body.username} at ${req.body.companyname}`);
        })

        app.get('/todos', (req, res) => {
            Utils.getDBClient().then((dbClient) => {
                dbClient.collection("todos").find({}).toArray((err, results) => {
                    res.json(results)
                })
            });
        })

        app.post('/todos/create', (req, res) => {
            Utils.getDBClient().then((dbClient) => {
                dbClient.collection("todos").insert(req.body, (err, results) => {
                    res.json(results)
                });
            })
        })



        app.get("/", (req, res) => {
            res.render("index.html")
        })


    }


    exports.routes = {
        "establishRoutes": establishRoutes,
    }


})();
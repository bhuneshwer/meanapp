(function() {


    function establishRoutes(app) {

        const Utils = require("./utils").Utils;
        const ObjectID = require('mongodb').ObjectID;



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

        app.put('/todos/update', (req, res) => {
            let todoId = req.query.todoId;
            let todoObjectToUpdate = {
                "taskstatus": req.body.todoStatus,
                "updatedOn": new Date()
            }

            let _id = new ObjectID.createFromHexString(todoId.toString())

            Utils.getDBClient().then((dbClient) => {
                dbClient.collection("todos").update({ _id }, {
                    $set: todoObjectToUpdate
                }, (err, results) => {
                    res.json(results)
                });
            })
        })


        app.post('/accounts/create', (req, res) => {
            let rqst = {
                "req": req,
                "body": req.body,
                "query": req.query
            }

            let q = require("q").defer(); // PENDING

            require("./controllers/register_post").execute(rqst, Utils, q);

            q.promise.then((response) => {
                res.json(response);
            }, function(error) {
                res.json({ "error": error })
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
(function() {
    const ObjectID = require('mongodb').ObjectID;


    function create(collectionName, dataToInsert, utils, options) {
        // options.insertMany?
        return new Promise((resolve, reject) => {
            utils.getDBClient().then((dbClient) => {
                dbClient.collection(collectionName).insert(dataToInsert, (err, results) => {
                    if (!err) {
                        return resolve(results);
                    }
                    return reject(err);
                })
            });
        })
    }

    function getByQuery(collectionName, queryParams, utils, options) {
        // Options.pageNumber?
        // Options.limit ?
        // options.sortingParams?

        let selectedFields = options && options.selectedFields ? options.selectedFields : {};
        return new Promise((resolve, reject) => {
            utils.getDBClient().then((dbClient) => {
                let collection = dbClient.collection(collectionName);
                let cursor;

                // properties to be handled - limit, page_number 
                if (options && options.limit && options.pageNumber) {
                    // options has limit and paging data
                    // using skip and limit to enable paging
                    cursor = collection.find(queryParams, selectedFields).skip(options.pageNumber > 0 ? ((options.pageNumber - 1) * options.limit) : 0).sort({
                        _id: -1
                    });
                    cursor.limit(options.limit);
                } else {
                    // no options is available for paging
                    cursor = collection.find(queryParams, selectedFields).sort({
                        _id: -1
                    });
                }

                cursor.toArray((err, documents) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(documents);
                    }
                });

            }, (err) => {
                console.error(`Error while getting db client err is ${JSON.stringify(err)}`)
                return reject(err);
            });
        });
    }

    function update() {
        return new Promise((resolve, reject) => {
            resolve(null);
        })
    }

    function getById() {
        return new Promise((resolve, reject) => {
            resolve(null);
        })
    }

    function deleteDocument(collectionName, queryParams, utils, options) {
        return new Promise((resolve, reject) => {
            utils.getDBClient().then((dbClient) => {
                let collection = dbClient.collection(collectionName);
                collection.remove(queryParams, (response) => {
                    return resolve(response);
                }, (error) => {
                    return reject(response)
                })

            }, (err) => {
                console.error(`Error while getting db client err is ${JSON.stringify(err)}`)
                return reject(err);
            });
        });
    }

    exports.DA = {
        create: create,
        getByQuery: getByQuery,
        update: update,
        getById: getById,
        deleteDocument: deleteDocument
    }
})()
(function() {
    var Utils = new function() {

        const MongoClient = require('mongodb').MongoClient;
        const uri = process.env.SUPERMAN_MONGO_URI;
        const client = new MongoClient(uri);


        this.getDBClient = function() {
            return new Promise((resolve, reject) => {
                client.connect(err => {
                    resolve(client.db())
                });
            })
        }

   		//Promises:
   			// PENDING 
   			// REJECTED - reject()
   			// Fullfilled - settled -  Resolve()
   			// 
   			// f1, f2, f3
   			// res = f1() f2res = f2(), f3res = f3()
   			// Promise.all([f1res,f2res,f3res]

		// f1res = getGoogleText()
		// f2res = myNameFromLitmusWorld()
		// f3res = getMyPanfromGov()


		// Promise.all([f1res,f2res,f3res]).then((values)=>{
		// 	console.log(values[0] +  values[1] + values[2])
		// })

       	
       	// function getGoogleText(myid){
       	// 	return new Promise(function(resolve,reject){
       	// 		resolve("Bhunesh ")
       	// 	})
       	// }

       	// function myNameFromLitmusWorld(myid){
       	// 	return new Promise(function(resolve,reject){
       	// 		resolve(12123)
       	// 	})
       	// }

       	// function getMyPanfromGov(myid){
       	// 	return new Promise(function(resolve,reject){
       	// 		resolve("Good Boy")
       	// 	})
       	// }
       	// 
       	
       	// function getMyName(){
       	// 	return new Promise(function(resolve,reject){
       	// 		resolve("Good Boy")
       	// 	})
       	// }

       	// getMyName().then((result)=>{
       	// 	console.log(`result is ${result}`)
       	// })

       	// async function getMyNameAsync(){
       	// 	return "Bhuneshwer"
       	// }

       	// getMyNameAsync().then((result)=>{
       	// 	console.log(`Result of async using promise is ${result}`)
       	// })

       	// async function callGetMynameAsync(){
       	// 	console.log(`Result of async using await is ${await getMyNameAsync()}`)
       	// }

       	// callGetMynameAsync()
       	

    }

    exports.Utils = Utils;
})()
(function() {

    const baseUrl = "http://localhost:3100";

    function init() {
        addEventListeners()

    }

    function getData() {

    }

    function signUp(event) {
        event.preventDefault();
        var payload = {
            "fullName": __id("userfullname").value,
            "emailAddress": __id("useremailaddress").value,
            "password": __id("userpassword").value,
        }

        if (!payload.fullName || !payload.emailAddress || !payload.password) {
            alert("Provide data for all the required fields");
            return;
        } else {
            executeAjax(`${baseUrl}/accounts/create`, "POST", payload).then((response) => {
                __id("signUpForm").reset();
                console.log(`Response from api is ${JSON.stringify(response)}`);
            }).catch((err) => {
                console.error(err.message)
            })
        }
    }


    function addEventListeners() {
        document.getElementById("signUpForm").addEventListener("submit", (event) => {
            signUp(event);
        })
    }



    function __id(idStr) {
        return document.getElementById(idStr)
    }


    function executeAjax(url, methodType, data) {
        if (!data) {
            data = {}
        }
        return new Promise((resolve, reject) => {
            try {
                // Refrence https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest
                var xmlHttp = new XMLHttpRequest()
                xmlHttp.onreadystatechange = function() {
                    // Refer https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
                    if (this.readyState == 4 && this.status == 200) {
                        try { resolve(JSON.parse(this.responseText)); } catch (e) {
                            resolve(this.responseText)
                        }
                    }
                }

                xmlHttp.open(methodType, url, true);
                xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xmlHttp.send(JSON.stringify(data));
            } catch (e) {
                reject(e);
            }
        });
    }

    function createTodo() {
        var todo = {
            taskname: __id("taskname").value,
            taskstatus: __id("taskstatus") ? __id("taskstatus").value : "Active"
        }
        executeAjax(`${baseUrl}/todos/create`, "POST", todo).then((response) => {
            __id("taskname").value = "";
            getTodos()
        }).catch((err) => {
            console.error(err.message)
        })

    }
    document.addEventListener("DOMContentLoaded", (event) => {
        init()
    })
})()
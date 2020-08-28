(function() {

    const baseUrl = "http://localhost:3100";

    function init() {
        addEventListeners()
        getTodos()

    }

    function getData() {

    }

    function addEventListeners() {
        __id("postTodoBtn").addEventListener("click", (event) => {

            createTodo();
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
    var markDone = function(todoId) {
        alert(todoId)
    }

    function getTodos() {
        performAction();
        executeAjax(`${baseUrl}/todos`, "GET", {}).then((response) => {
            if (response && response.length) {
                let myTodosStr = ``
                response.forEach((todo) => {
                    myTodosStr += `
                    <li style="border-bottom:1px solid #ddd;padding:5px">
                        ${todo.taskname} - ${todo.taskstatus} 
                        <span 
                            style="cursor:pointer;color:green;display:${todo.taskstatus=="Completed"?"none":"initial"}" 
                            action="mark-done" todo-id="${todo._id}">Done
                        </span>
                    </li>`;
                })

                __id("todosList").innerHTML = myTodosStr;
            }
        }).catch((err) => {
            console.error(err.message)
        })
    }


    function performAction() {
        // Event delegation and Propogation
        var todoListContainer = __id("todosList")
        todoListContainer.addEventListener("click", (event) => {
            let nodeType = event.target.nodeName;
            if (nodeType === "SPAN") {
                let action = event.target.getAttribute("action");
                let todoId = event.target.getAttribute("todo-id");
                if (action == "mark-done" && todoId) {
                    markTodoAsDone(todoId).then((response) => {

                    }).catch((err) => {

                    })
                }
            }
        })
    }

    function markTodoAsDone(todoId) {
        return new Promise((resolve, reject) => {
            if (todoId) {
                let payload = { "todoStatus": "Completed" };
                executeAjax(`${baseUrl}/todos/update?todoId=${todoId}`, "PUT", payload).then((response) => {
                    getTodos()
                }).catch((err) => {
                    console.error(err.message)
                })

            } else {
                reject("Todo Id is not available.")
            }
        })
    }


    document.addEventListener("DOMContentLoaded", (event) => {
        init()
    })
})()
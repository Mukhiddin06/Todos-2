let elForm = document.querySelector(".todo-form");
let inputValue = document.querySelector(".todo-input");
let elTodoList = document.querySelector(".todo-list");
let elModalWrapper = document.querySelector(".modal-wrapper");
let elModalInnner = document.querySelector(".modal-inner");
let elModalContent = document.querySelector(".modal-content");


let elAllCount = document.querySelector(".all-count");
let elCompletedCount = document.querySelector(".completed-count");
let elUncompletedCount = document.querySelector(".uncompleted-count");
let elCountBtnWrapper = elAllCount.parentElement.parentElement



let elChoosenInput = document.querySelector(".choosen-img");
let elUploadImg = document.querySelector(".upload-img");



let todos = JSON.parse(localStorage.getItem("todos")) || [];


elCountBtnWrapper.addEventListener("click", function(e) {
    if(e.target.classList.contains("all-count-btn")) {
        renderTodos(todos);
    }
     else if(e.target.classList.contains("completed-count-btn")) {
        const filteredArr = todos.filter(item => item.isComplated == true)
        renderTodos(filteredArr);
    }
     else if(e.target.classList.contains("uncompleted-count-btn")) {
        const filteredArr = todos.filter(item => item.isComplated == false)
        renderTodos(filteredArr);
    }
})




elForm.addEventListener("submit", function (e){
    e.preventDefault();
    const data = {
        id : todos.length + 1,
        todoValue : inputValue.value,
        isComplated : false,
        imgURL : e.target.chooseImg.files[0] ? URL.createObjectURL(e.target.chooseImg.files[0]) : null
    }
    e.target.reset();
    todos.push(data);
    renderTodos(todos);
    elUploadImg.src = "./Images/empty-img.png"
    localStorage.setItem("todos", JSON.stringify(todos));
})

function renderTodos(arr){
    elTodoList.innerHTML = null;
    arr.forEach((item, index) => {
        let elTodoItem = document.createElement("li");
        elTodoItem.className = `flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm ${item.isComplated ? "opacity-60 line-through" : ""}`;
        elTodoItem.innerHTML = `
        <div class="flex items-center space-x-2">
           <span class="font-bold text-blue-500">${index + 1}</span>
           <strong class="text-gray-700">${item.todoValue}</strong>
           ${item.imgURL ? `<img class="rounded-lg" src="${item.imgURL}" alt="Choosen img" width="50" height="50"/>` : ""}
        </div>
        <div class="flex items-center space-x-2">
            <div onclick="handleComplatedClick(${item.id})" class="w-[20px] relative h-[20px] cursor-pointer rounded-full border-2 border-gray-400 hover:bg-gray-200 transition duration-200">
                <div class="absolute inset-[2px] ${item.isComplated ? "bg-blue-500": ""} rounded-full" ></div>
            </div>
            <button id="${item.id}" onclick="handleDeleteTodo(${item.id})" type="button" class="delete-btn p-2 rounded-lg bg-red-500 text-white font-semibold border-2 border-transparent hover:bg-transparent hover:text-red-500 hover:border-red-500 transition duration-300">Delete</button>
            <button id="${item.id}" onclick="handleUptadeTodo(${item.id})" type="button" class="p-2 rounded-lg bg-blue-500 text-white font-semibold border-2 border-transparent hover:bg-transparent hover:text-blue-500 hover:border-blue-500 transition duration-300">Update</button>
        </div>
        `;
        elTodoList.appendChild(elTodoItem);
    });
    elAllCount.textContent = todos.length
    elCompletedCount.textContent = todos.filter(item => item.isComplated == true).length
    elUncompletedCount.textContent = todos.filter(item =>item.isComplated != true).length
}
renderTodos(todos)


elModalWrapper.addEventListener("click", function(e){
    if(e.target.id == "wrapper"){
        elModalWrapper.classList.add("scale-0")
    }
})


function handleComplatedClick(id){
    const findedObj = todos.find(item => item.id == id)
    findedObj.isComplated =!findedObj.isComplated
    renderTodos(todos)
    localStorage.setItem("todos", JSON.stringify(todos));
}



function handleDeleteTodo(id){
    const findedIndex = todos.findIndex(item => item.id == id)
    todos.splice(findedIndex, 1)
    renderTodos(todos)
    localStorage.setItem("todos", JSON.stringify(todos));
}



function handleUptadeTodo(id) {
    elModalWrapper.classList.remove("scale-0");
    const findedObj = todos.find(item => item.id == id);

    elModalContent.innerHTML = `
    <form onsubmit="handleSave(${findedObj.id}, event)">
        <div class="w-[450px] flex items-end justify-between m-auto p-4 mt-20 rounded-lg bg-transparent shadow-lg">
            <input id="update-input" value="${findedObj.todoValue}" class="p-2 mt-1 rounded-lg outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" type="text">
            <button class="p-2 w-[19%] rounded-lg bg-blue-500 text-white font-semibold border-2 border-transparent hover:bg-transparent hover:text-blue-500 hover:border-blue-500 transition duration-300" type="submit">Save</button>
        </div>
        <label>
            <input type="file" class="hidden update-file">
            <img class="update-img mt-5 rounded-lg mx-auto" src="${findedObj.imgURL}" alt="Uptade img" width="200" height="200"/>
        </label>
    </form>
    `;
    let elUpdateFile = document.querySelector(".update-file")
    let elUpdateImg = document.querySelector(".update-img")


    elUpdateFile.addEventListener("change", function(e) {
        elUpdateImg.src = URL.createObjectURL(e.target.files[0])
    });
}






function handleSave(id, event) {
    event.preventDefault();
    let updatedValue = document.getElementById("update-input").value;
    const findedObj = todos.find(item => item.id == id);
    findedObj.todoValue = updatedValue;
    findedObj.imgURL = document.querySelector(".update-img").src
    elModalWrapper.classList.add("scale-0");
    renderTodos(todos);
    localStorage.setItem("todos", JSON.stringify(todos));
}



function closeBtnClick(){
    elModalWrapper.classList.add("scale-0")
}



elChoosenInput.addEventListener("change", function(e){
    elUploadImg.src = URL.createObjectURL(e.target.files[0])
})

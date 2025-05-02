const DATA_BASE_URL = `https://join-b179e-default-rtdb.europe-west1.firebasedatabase.app/`;
let allTasks = [];

// function initBoard() {
//     fetchEntries("");
// }
// async function fetchEntries(path = "") {
//     console.log('test');
//     let responseData = await fetch(DATA_BASE_URL + path + ".json");
//     // console.log(responseData);
//     let responseDataAsJson = await responseData.json();
//     console.log(responseDataAsJson);
// }


function initBoard() {
    fetchEntriesList();
}
async function fetchEntriesList() {
    console.log('test');
    let responseData = await fetch(DATA_BASE_URL + ".json");
    // console.log(responseData);
    let responseDataAsJson = await responseData.json();
    console.log(responseDataAsJson);
    let taskList = responseDataAsJson.Board;
    console.log(taskList);
    
    for (const letter in taskList.Task){
        allTasks.push(taskList.Task[letter]);
    }
console.log(allTasks);

    renderEntrie(taskList);
}

function renderEntrie(taskList) {
    let contentRef = document.getElementById('board-content');

    // for (let i = 0; i < taskList.length; i++) {
    //     let taskList = taskList[i];
    //     contentRef.innerHTML += `<div>${taskList[i]}</div>`;
    // }

    console.log(taskList);

} 
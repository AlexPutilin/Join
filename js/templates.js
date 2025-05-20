function getSubtaskTemplate(name) {
    return `
        <div class="subtask-item-container">
            <div class="subtask-item">
                <span class="subtask-name">• ${name}</span>
                <div class="btn-collection-container">
                    <button type="button" class="btn-small" onclick="openSubtaskEditMenu(this)">
                        <div class="icon-wrapper">
                            <img class="icon-default" src="../assets/img/icon-edit-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-edit-hover.svg">
                        </div>
                    </button>
                    <div class="btn-seperator"></div>
                    <button type="button" class="btn-small" onclick="deleteSubtaskItem(this)">
                        <div class="icon-wrapper">
                            <img class="icon-default" src="../assets/img/icon-delete-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-delete-hover.svg">
                        </div>
                    </button>
                </div>
            </div>
            <div class="subtask-item-editmenu d-none">
                <input type="text">
                <div class="btn-collection-container">
                    <button type="button" class="btn-small" onclick="closeAllSubtaskEdits()">
                        <div class="icon-wrapper">
                            <img class="icon-default" src="../assets/img/icon-cancel-task-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-cancel-task-hover.svg">
                        </div>
                    </button>
                    <div class="btn-seperator"></div>
                    <button type="button" class="btn-small" onclick="commitEditSubtask(this)">
                        <div class="icon-wrapper">
                            <img class="icon-default" src="../assets/img/icon-check-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-check-hover.svg">
                        </div>
                    </button>
                </div>
            </div>
        </div>
    `
}
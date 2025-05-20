function getSubtaskTemplate(name) {
    return `
        <div class="subtask-item">
            <span>• ${name}</span>
            <div class="btn-collection-container">
                <button type="button" class="btn-small" onclick="">
                    <div class="icon-wrapper">
                        <img class="icon-default" src="../assets/img/icon-edit-default.svg">
                        <img class="icon-hover" src="../assets/img/icon-edit-hover.svg">
                    </div>
                </button>
                <div class="btn-seperator"></div>
                <button type="button" class="btn-small" onclick="">
                    <div class="icon-wrapper">
                        <img class="icon-default" src="../assets/img/icon-delete-default.svg">
                        <img class="icon-hover" src="../assets/img/icon-delete-hover.svg">
                    </div>
                </button>
            </div>
        </div>
    `
}
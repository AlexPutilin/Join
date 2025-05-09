/**
 * Retrieves the key DOM elements used for category selection.
 *
 * @function getCategoryElements
 * @returns {Object} An object containing:
 *   - selected {HTMLElement}: The currently selected category element.
 *   - error {HTMLElement}: The error message element.
 *   - value {string|null}: The currently selected value, or null if none.
 */
function getCategoryElements() {
    const selected = document.getElementById("selected-category");
    const error = document.getElementById("category-error");
    const value = selected.getAttribute("data-value");
    return { selected, error, value };
  }
  
  /**
   * Toggles the visibility of the category dropdown options and updates the arrow icon accordingly.
   *
   * @function toggleCategoryDropdown
   * @returns {void}
   */
  function toggleCategoryDropdown() {
    const { selected } = getCategoryElements();
    const options = document.getElementById("category-options");
    const isHidden = options.classList.contains("hidden"); 
  
    if (isHidden) {
      options.classList.remove("hidden");
      selected.style.backgroundImage = "url('../assets/img/icon-up-hover.svg')";
    } else {
      options.classList.add("hidden");
      selected.style.backgroundImage = "url('../assets/img/icon-down-default.svg')";
    }
  }
  
  /**
   * Handles category selection when an option is clicked.
   * Updates the selected value and hides the dropdown and error message.
   *
   * @function selectCategory
   * @param {HTMLElement} element - The dropdown option element that was clicked.
   * @returns {void}
   */
  function selectCategory(element) {
    const { selected, error } = getCategoryElements();
    const value = element.getAttribute("data-value");
    const label = element.textContent;
  
    selected.textContent = label;
    selected.setAttribute("data-value", value);
    document.getElementById("category-options").classList.add("hidden");
    error.classList.add("hidden");
    selected.style.backgroundImage = "url('../assets/img/icon-down-default.svg')";
  }
  
  

  
  

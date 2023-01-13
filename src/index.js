const inputEl = document.querySelector(".search-bar")

inputEl.addEventListener("input", onSearch)
function onSearch() {
    console.log(inputEl.elements.searchQuery.value)
}
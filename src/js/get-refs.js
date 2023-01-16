export default function getRefs() {
  return {
    searchForm: document.querySelector('.js-search-form'),
    input: document.querySelector('.js-search-input'),
    btnSearch: document.querySelector('.js-search-button'),
    gallery: document.querySelector('.gallery'),
    guard: document.querySelector('.js-guard'),
  };
}

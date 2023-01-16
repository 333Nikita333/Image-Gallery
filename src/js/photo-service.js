import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32850329-b1ad59fa6423bb8f4069942ac';

export default class PhotoApiService {
  constructor() {
    this.searchQuery = '';
    this.perPage = 40;
    this.page = 1;
  }

  async processRequest() {
    const params = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.perPage,
    });
    const url = `${BASE_URL}/?${params}`;
    this.incrementPage();
    return await axios.get(url);
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

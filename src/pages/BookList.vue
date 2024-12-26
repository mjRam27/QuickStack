<template>
  <div class="book-list">
    <section class="home-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1>Welcome to Quickstack</h1>
          <p class="hero-description">
           Your Gateway to Knowledge: Explore, Borrow, and Manage Books Easily<br />
           Your next favorite book is waiting for you!
         </p>

          <section class="search-section">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for books..."
              class="search-input"
            />
            <button @click="searchBooks" class="search-button">Search</button>
          </section>
        </div>
        <div class="hero-image">
          <img src="@/assets/finallib.png" alt="Books and Library" />
        </div>
      </div>
    </section>


    <section v-if="searchResults.length" class="search-results section">
      <h2 class="section-title"><span>Search Results</span></h2>
      <div class="books-container">
        <div
          class="book-card"
          v-for="book in searchResults"
          :key="book.id"
        >
          <img :src="book.image" alt="Book Image" class="book-image" />
          <h3>{{ book.name }}</h3>
          <p class="author">Author: {{ book.author }}</p>
          <p class="category">Category: {{ book.category }}</p>
          <p class="copies">Copies: {{ book.copies }}</p>
        </div>
      </div>
    </section>

    <section class="new-arrivals section">
      <h2 class="section-title"><span>New Arrivals</span></h2>
      <div class="books-container">
        <div
          class="book-card"
          v-for="book in newArrivals"
          :key="book.id"
        >
          <img :src="book.image" alt="Book Image" class="book-image" />
          <h3>{{ book.name }}</h3>
          <p class="author">Author: {{ book.author }}</p>
          <p class="category">Category: {{ book.category }}</p>
          <p class="copies">Copies: {{ book.copies }}</p>
        </div>
      </div>
    </section>

    <section class="categories section">
      <h2 class="section-title"><span>Categories</span></h2>
      <div v-for="(books, category) in categorizedBooks" :key="category" class="category-section">
        <h3 class="category-box" :class="{'center-category': ['Computer Science', 'Data Science', 'MBA', 'Cyber Security'].includes(category.trim())}">
          {{ category }}
        </h3>
        <div class="books-container">
          <div class="book-card" v-for="book in books" :key="book.id">
            <img :src="book.image" alt="Book Image" class="book-image" />
            <h3>{{ book.name }}</h3>
            <p class="author">Author: {{ book.author }}</p>
            <p class="copies">Copies: {{ book.copies }}</p>
            
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
 
export default {
  name: "BookList",
  data() {
    return {
      books: [], 
      newArrivals: [], 
      categorizedBooks: {}, 
      searchQuery: "", 
      searchResults: [], 
    };
  },
  methods: {

    async fetchBooks() {
      try {
        const response = await axios.get("http://localhost:3000/books");
        this.books = response.data;
        this.getNewArrivals();
        this.categorizeBooks();
      } catch (error) {
        console.log("Error while fetching books:", error);
      }
    },

    getNewArrivals() {
      this.newArrivals = [];
      for (let i = 0; i < this.books.length; i++) {
        if (i < 5) {
          this.newArrivals.push(this.books[i]);
        } else {
          break;
        }
      }
    },
 
    categorizeBooks() {
      this.categorizedBooks = {};
      for (let i = 0; i < this.books.length; i++) {
        const book = this.books[i];
        const category = book.category;
        if (!this.categorizedBooks[category]) {
          this.categorizedBooks[category] = [];
        }
        this.categorizedBooks[category].push(book);
      }
    },

    searchBooks() {
      const query = this.searchQuery.toLowerCase();
      this.searchResults = [];
      for (let i = 0; i < this.books.length; i++) {
        const bookName = this.books[i].name.toLowerCase();
        if (bookName.includes(query)) {
          this.searchResults.push(this.books[i]);
        }
      }
    },
  },
  mounted() {
    this.fetchBooks(); 
  },
};
</script>

<style scoped>

.book-list {
  font-family: 'Roboto', sans-serif;
  color: #333;
  margin: 10px;
  padding: 20px;
 
}


.section {
  margin-top: 40px;
  margin-bottom: 40px;
}
.section-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  
  font-weight: bolder;
  font-family: 'Arial', sans-serif;
}

.section-title span {
  
  color: black;
  padding: 0 10px;
  border-radius: 5px;
}


.search-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.search-input {
  width: 50%;
  padding: 8.5px;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
}
.search-button {
  padding: 10px 20px;
  font-size: 1rem;
  color: black;
  background-color: #fff;
  
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.search-button:hover {
  background-color: #fff;
}

.books-container {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding: 10px 0;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
  flex-wrap: nowrap;
}
.books-container::-webkit-scrollbar {
  height: 8px;
}
.books-container::-webkit-scrollbar-thumb {
  background-color: #007bff;
  border-radius: 10px;
}
.books-container::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}


.book-card {
  background: white;
  border-radius: 5px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  width: 250px;
  height: 350px;
  padding: 20px;
  text-align: center;
  flex-shrink: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
}

.book-card:hover {
  background-color: #fff;
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.book-image {
  width: 100%;
  max-height: 200px;
  min-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 5px;
}

.book-card h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0px !important;
  padding-bottom: 0px !important;
  text-align: left;
}

.book-card p {
  font-size: 15px;
  color: #383737;
  margin: 4px 0px !important;
  padding-bottom: 0px !important;
  text-align: left;
}


.home-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #800000;
  color: #fff;
  width: 100% !important;
}

.hero-content {
  display: flex;
  padding: 0px 30px;
  justify-content: space-between;
  align-items: center;
  color: white !important;
  background-color: #800000;
}

.hero-text {
  flex: 1;
  color: white !important;
  margin-right: 40px;
}

.hero-text h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: Georgia, serif;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 30px;
  font-weight: 300;
  font-family: Arial, sans-serif;
}

.hero-image {
  max-width: 450px;
  margin-left: 200px;
}

.hero-image img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}


.category-section {
  margin-bottom: 30px;
}

.center-category {
  display: block;
  text-align: center;
  margin: 20px 0px;
  background-color: #f1f1f1;
  padding: 15px;
  font-size: 1.3rem;
  text-transform: uppercase;
  font-weight: bold;
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  color: #800000;
}

@media (max-width: 768px) {
  .hero-image {
  max-width: 450px;
  margin-left: 0px;
}

.home-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #800000;
  color: #fff;
  width: 100% !important;
}

.hero-content{
  display: flex;
  width: 100%;
  flex-direction: column;
}
.hero-text{
  padding: 0px 5px !important;
  width: 100%;
}

.hero-description{
  padding: 0px 5px !important;
  width: 100% !important;
}

.search-section{
  width: 100% !important;
}

.search-input{
  width: 100%;
}


}
</style>

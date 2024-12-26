<template>
    <section>
      <h2>Admin / Librarian</h2>
      <div class="admin-actions">
        <button @click="goToAdminBooks">Add Books</button>
        <button @click="goToViewUsers">View Users</button>
        <button @click="goToBookHistory">Book History</button>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    methods: {
      goToAdminBooks() {
        this.$router.push("/view-books");
      },
      
      goToViewUsers() {
        this.$router.push("/view-users");
      },
  
      goToBookHistory(){
        this.$router.push("/view-books-history");
      }
    },
  };
  </script>
  
  <style scoped>
  section {
    text-align: center;
    margin: 3rem auto;
    max-width: 40rem;
    border: 1px solid #ccc;
    border-radius: 12px;
    padding: 2rem;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .admin-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  button {
    font: inherit;
    cursor: pointer;
    padding: 0.5rem 1.5rem;
    border: 1px solid #830404;
    background-color: #830404;
    color: white;
    border-radius: 8px;
    transition: background-color 0.3s, color 0.3s;
  }
  
  button:hover {
    background-color: white;
    color: #830404;
  }
  </style>
  
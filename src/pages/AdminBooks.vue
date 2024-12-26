<template>
  <Header />
  <div id="app">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h3>List of Books</h3>
          <button class="add-button" @click="openModal">+ Add Book</button>
        </div>
 
        <div style="overflow-x: auto; border: 1px solid #ddd">
          <table>
            <thead style="background-color: #f2f2f2">
              <tr>
                <th style="border-right: 1px solid #ddd">Name</th>
                <th style="border-right: 1px solid #ddd">Date of Publish</th>
                <th style="border-right: 1px solid #ddd">Category</th>
                <th style="border-right: 1px solid #ddd">Copies</th>
                <th style="border-right: 1px solid #ddd">Author</th>
                <th>Actions</th>
                 </tr>
            </thead>
            <tbody>
              <tr v-for="(book, index) in books" :key="index">
                <td style="border-right: 1px solid #ddd">{{ book.name }}</td>
                <td style="border-right: 1px solid #ddd">{{ book.date }}</td>
                <td style="border-right: 1px solid #ddd"> {{ book.category }}</td>
                <td style="border-right: 1px solid #ddd">{{ book.copies }}</td>
                <td style="border-right: 1px solid #ddd">{{ book.author }}</td>
                <td class="actions">
                  <button v-if="book.copies > 0" class="assign_button" @click="assignBook(book)">
                    Assign
                  </button>
                  <button class="edit_button" @click="editBook(book)">Edit</button>
                  <button class="delete_button" @click="deleteBook(book)"> Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div>Total Books: {{ countBooks() }}</div>
        </div>
      </div>
    </div>
 
    <div class="modal" :class="{ active: modalActive }">
      <div class="modal-content">
        <h3 id="modal-title">
          {{ editingIndex !== null ? "Edit Book" : "Add Book" }}
        </h3>
        <br />
        <label>Upload Image:</label>
        <input @input="handleInputChange" name="image" type="text" v-model="form.image" id="book-image" />
        <h6 class="error_info">{{ this.error.image }}</h6>
 
        <label>Name of the Book:</label>
        <input @input="handleInputChange" name="name" type="text" v-model="form.name" />
        <h6 class="error_info">{{ this.error.name }}</h6>
 
        <label>Date of Publish:</label>
        <input @input="handleInputChange" name="date" type="date" v-model="form.date" />
        <h6 class="error_info">{{ this.error.date }}</h6>
 
        <label>Category:</label>
        <select @input="handleInputChange" name="category" v-model="form.category">
          <option>Computer Science</option>
          <option>Data Science</option>
          <option>Cyber Security</option>
          <option>MBA</option>
        </select>
        <h6 class="error_info">{{ this.error.category }}</h6>
 
        <label>Copies:</label>
        <input @input="handleInputChange" name="copies" type="number" v-model="form.copies" />
        <h6 class="error_info">{{ this.error.copies }}</h6>
 
        <label>Author:</label>
        <input @input="handleInputChange" name="author" type="text" v-model="form.author" />
        <h6 class="error_info">{{ this.error.author }}</h6>
 
        <div id="button_list">
          <button class="submit-button" @click="submitBook">Submit</button>
          <button class="cancel-button" @click="closeForm">Cancel</button>
        </div>
      </div>
    </div>
 
    <div class="modal" :class="{ active: assignmodalActive }">
      <div class="modal-content">
        <h3 id="modal-title">Assign Book</h3>
        <br />
        <label>Retrieve Date:</label>
        <input @input="handleInputChange1" name="retrieve_date" :min="today" type="date"
          v-model="assignbook.retrieve_date" />
        <h6 class="error_info">{{ this.assignbook_error.retrieve_date }}</h6>
 
        <label>Users:</label>
        <select name="user" v-model="assignbook.user">
          <option value="" disabled>Select a user</option>
          <option v-for="user in users" :key="user" :value="user">
            {{ user?.name }}
          </option>
        </select>
 
        <h6 class="error_info">{{ this.assignbook_error.user }}</h6>
 
        <label>Copies:</label>
        <input @input="handleInputChange1" name="copies" type="number" v-model="assignbook.copies" />
 
        <h6 class="error_info">{{ this.assignbook_error.copies }}</h6>
        <br />
 
        <div id="button_list">
          <button class="submit-button" @click="submitAssignBook">Submit</button>
          <button class="cancel-button" @click="closeAssignBook">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
 
<script>
import axios from "axios";
import { useToast } from "vue-toastification";
 
export default {
  data() {
    return {
      modalActive: false,
      assignmodalActive: false,
      assignBookData: null,
      today: new Date().toISOString().split("T")[0],
      books: [],
      assignbooks: [],
      users: [],
      form: {
        image: "",
        name: "",
        date: "",
        category: "",
        copies: "",
        author: "",
      },
      error: {
        name: "",
        image: "",
        date: "",
        category: "",
        copies: "",
        author: "",
      },
      assignbook: {
        retrieve_date: "",
        user: "",
        copies: 1,
      },
      assignbook_error: {
        retrieve_date: "",
        user: "",
        copies: "",
      },
      editingIndex: null,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchBooks();
    this.fetchUsers();
    this.fetchAssignBooks();
  },
  methods: {
 
    countBooks() {
      let sum = 0;
      for (const book of this.books) {
        sum += parseInt(book.copies);
      }
      return sum;
    },
     
 
    fetchBooks() {
      axios
        .get("http://localhost:3000/books")
        .then((response) => {
          this.books = response.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    fetchUsers() {
      axios
        .get("http://localhost:3000/users")
        .then((response) => {
          console.log("response.data", response.data);
          this.users = response.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    fetchAssignBooks() {
      axios
        .get("http://localhost:3000/books_history")
        .then((response) => {
          this.assignbooks = response.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    openModal() {
      this.modalActive = true;
      this.editingIndex = null;
      this.form = { name: "", date: "", category: "", copies: null, author: "",
      };
    },
    closeModal() {
      this.modalActive = false;
    },
    
   
    submitBook() {
      if (this.form.copies < 0) {
    this.error.copies = "Copies should be greater than 0!";
    return;
  }
 
      if (
        this.form.image == "" ||
        this.form.image == null ||
        this.form.image == undefined
      ) {
        this.error.image = "This Field is required!";
      } else if (this.form.name == "") {
        this.error.name = "This Field is required!";
      } else if (this.form.date == "") {
        this.error.date = "This Field is required!";
      } else if (this.form.category == "") {
        this.error.category = "This Field is required!";
      } else if (this.form.copies == "") {
        this.error.copies = "This Field is required!";
      } else if (this.form.author == "") {
        this.error.author = "This Field is required!";
      } else {
        if (this.editingIndex !== null) {
          let sendData = { ...this.form };
          sendData["id"] = JSON.stringify(sendData?.id);
          axios
            .put(`http://localhost:3000/books/${this.form.id}`, sendData)
            .then(() => {
              this.toast.success("Book Updated!");
              this.fetchBooks(); 
              this.isUpdateFormVisible = false;
            })
            .catch((error) => {
              console.error("Error updating user:", error);
            });
        } else {
          this.form["id"] = JSON.stringify(
            parseInt(this.books.length) > 0
              ? parseInt(this.books[this.books.length - 1].id) + 1
              : +1
          );
          axios
            .post(`http://localhost:3000/books`, this.form)
            .then(() => {
              this.toast.success("Book Created!");
              this.fetchBooks(); 
              this.isUpdateFormVisible = false;
            })
            .catch((error) => {
              console.error("Error updating user:", error);
            });
        }
        this.closeModal();
      }
    },
    closeForm() {
      this.closeModal();
    },
    editBook(book) {
      this.editingIndex = book.id;
      this.form = { ...book };
      this.modalActive = true;
    },
    deleteBook(book) {
      axios
        .delete(`http://localhost:3000/books/${book?.id}`)
        .then(() => {
          this.toast.success("Book Deleted!");
          this.fetchBooks(); 
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    },
    assignBook(book) {
      this.assignBookData = book;
      this.assignmodalActive = true;
    },
    submitAssignBook() {
      if (this.assignBookData.copies >= this.assignbook.copies) {
        if (this.assignbook.retrieve_date == "") {
          this.assignbook_error.retrieve_date = "This Field is required!";
        } else if (this.assignbook.user == "") {
          this.assignbook_error.user = "This Field is required!";
        } else if (this.assignbook.copies == "") {
          this.assignbook_error.copies = "This Field is required!";
        } else {
          this.assignbook["id"] = JSON.stringify(
            parseInt(this.assignbooks.length) > 0
              ? parseInt(this.assignbooks[this.assignbooks.length - 1].id) + 1
              : 1
          );
          this.assignbook["book"] = this.assignBookData;
          this.assignbook["status"] = "Assigned";
          this.assignbook["request_for_extention"] = false;
          this.assignbook["extension_status"] = "Pending";
          this.assignbook["extenstion_remarks"] = "";
 
 
          axios
            .post(`http://localhost:3000/books_history`, this.assignbook)
            .then(() => {
              axios
                .put(`http://localhost:3000/books/${this.assignBookData.id}`, {
                  ...this.assignBookData,
                  copies: this.assignBookData.copies - this.assignbook.copies,
                })
                .then(() => {
                  this.toast.success("Book Assigned!");
                  this.fetchBooks();
                  this.fetchAssignBooks();
                  (this.assignbook = {
                    retrieve_date: "",
                    user: "",
                    copies: 1,
                  }),
                    (this.assignbook_error = {
                      retrieve_date: "",
                      user: "",
                      copies: "",
                    });
                })
                .catch((error) => {
                  console.error("Error updating book:", error);
                });
            })
            .catch((error) => {
              console.error("Error updating book history:", error);
            });
          this.closeAssignBook();
        }
      } else {
        this.assignbook_error.copies = "Copies is out of stock!";
      }
    },
    closeAssignBook() {
      this.assignmodalActive = false;
    },
    handleInputChange(e) {
      const { name, value } = e.target;
      this.form[name] = value;
      this.error[name] = "";
    },
    handleInputChange1(e) {
      const { name, value } = e.target;
      if (name == "user") {
        this.assignbook[name] = this.assignbook.value;
      } else {
        this.assignbook[name] = value;
      }
      this.assignbook_error[name] = "";
    },
  },
};
</script>
 
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}
 
body {
  display: flex;
  min-height: 100vh;
  background-color: #f4f4f4;
}
 
#button_list {
  display: flex;
}
 
.container {
  flex: 1;
  padding: 20px;
}
 
.card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
 
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
 
.add-button {
  background-color: #830404;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}
 
table {
  width: 100%;
  font-size: 14px !important;
  border-collapse: collapse;
}
 

td {
  padding: 8px 10px;
  text-align: left;
  border-top: 1px solid #ddd;
}
 
.actions {
  display: flex;
  margin-left: 0px;
  cursor: pointer;
}
 
.actions button {
  margin-right: 5px;
}
 
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  justify-content: center;
  align-items: center;
}
 
.modal.active {
  display: flex;
}
 
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
 
.modal-content label {
  display: block;
  margin-bottom: 5px;
}
 
.modal-content input,
.modal-content select {
  width: 100%;
  margin-bottom: 15px;
  padding: 8px;
}
 
.submit-button {
  display: block;
  background-color: #830404;
  color: white;
  padding: 5px 10px;
  text-align: center;
  cursor: pointer;
  border: none;
  margin-right: 10px;
  border-radius: 5px;
}
 
.cancel-button {
  display: block;
  background-color: #fff;
  border: 1px solid #ddd;
  color: black;
  padding: 5px 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
}
 
.assign_button {
  display: block;
  background-color: #2a8230;
  color: white;
  font-weight: 500;
  font-size: 11px;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  border: none;
  font-weight: bold;
  border-radius: 5px;
}
 
.edit_button {
  display: block;
  background-color: #476493;
  color: white;
  font-weight: 500;
  font-size: 11px;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}
 
.delete_button {
  display: block;
  background-color: #b24646;
  color: white;
  font-weight: 500;
  font-size: 11px;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}
 
.error_info {
  color: red !important;
}
</style>
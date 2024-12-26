<template>
    <Header />
    <div id="app">
      <div class="container">
        <div class="card">
          <div class="card-header">
            <h3>Assigned Books</h3>
          </div>
          <div style='overflow-x:auto;border:1px solid #ddd'>
            <table >
              <thead style="background-color:#f2f2f2;">
                <tr>
                  <th style="border-right: 1px solid #ddd;">Name</th>
                  <th style="border-right: 1px solid #ddd;">Book Info</th>
                  <th style="border-right: 1px solid #ddd;">Copies</th>
                  <th style="border-right: 1px solid #ddd;">User</th>
                  <th style="border-right: 1px solid #ddd;">Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(history, index) in books_history" :key="index">
                  <td style="border-right: 1px solid #ddd;">{{ history.book.name }}</td>
                  <td style="border-right: 1px solid #ddd;">{{ history?.retrieve_date }}</td>
                  <td style="border-right: 1px solid #ddd;">{{ history.copies }}</td>
                  <td style="border-right: 1px solid #ddd;">{{ history.user.name }}</td>
                  <td style="border-right: 1px solid #ddd;">{{ history.status }}</td>
                  <td>
                    <div  class="actions">
                    <button v-if="history.status == 'Assigned'" class="cancel-button" @click="updateHistory(history)">Update</button>
                    <button v-if="history.request_for_extention == true && history.status == 'Assigned' && history.extension_status == 'Pending'" class="submit-button" @click="extensionModal(history)">Extension</button>
                  </div>
                  </td>
                </tr>
              </tbody>
            </table>
         </div>
        </div>
      </div>
  
   
      <div class="modal" :class="{ active: books_history_modal }">
        <div class="modal-content">
          <h3 id="modal-title">Update Book History</h3>
  
          <br> 
          <h5>Book Selected : {{  this.books_data.name }} - And Copies Avialable ( {{ this.books_data?.copies }} ) And check before extending or updating.</h5>

          <br> 
          <label>Retrieve Date:</label>
          <input :readonly="this.books_data?.copies <= 2" type="date" v-model="books_history_selected.retrieve_date">
          

          <label>Copies:</label>
          <input readonly type="number" v-model="books_history_selected.copies">
          <label>Status:</label>
          <select v-model="books_history_selected.status">
            <option>Assigned</option>
            <option>Retrieved</option>
          </select>
          <div id="button_list">
          <button class="submit-button" @click="submitAssignBook">Submit</button>
          <button class="cancel-button" @click="closeAssignBook">Cancel</button>
        </div>
        </div>
      </div>

      <div class="modal" :class="{ active: extension_modal }">
        <div class="modal-content">
            
          <h6 @click="this.extension_modal = false" style="font-size: 20px;position: absolute;right:20px">x</h6>

          <h3  id="modal-title">Extension Request Info</h3>
          <br>
          <h5>Book Selected : {{  this.books_data.name }} - And Copies Avialable ( {{ this.books_data?.copies }} ) And check before extending or updating.</h5>




          <br> 
          <p style="font-size: 13px;padding: 0px">Date: {{ this.books_history_selected?.extention_date}}</p>
          
          <p style="font-size: 13px;padding: 0px;">User Remarks: {{ this.books_history_selected?.user_remarks }}</p>
          <br> 

          <label>Admin Remarks:</label>
          <textarea style="width:100%;padding: 5px;" type="text"  name="remarks" v-model="remarks" @input="handleInputChange" ></textarea>
          <h6 class="error_info">{{ this.remarks_error }}</h6>
           
          <br>
          <br>
          <div id="button_list">
          <button class="submit-button" @click="approve_extension_request('Approved')">Approve</button>
          <button class="cancel-button" @click="approve_extension_request('Rejected')">Reject</button>
        </div>
        </div>
      </div>
    </div>
    <Footer />
  </template>
  
  <script>
  import axios from "axios";
  import { useToast } from 'vue-toastification';

  export default {
    data() {
      return {
        remarks:'',
        remarks_error:'',
        books_history: [],
        books_data:{
          copies:0
        },
        books_history_selected:{
          id:'',
          retrieve_date: "",
          status:"",
          user: {},
          copies:"",
          book: {}
        },
        books_history_modal:null,
        extension_modal:false
      };
    },
    setup(){
      const toast = useToast();
      return { toast };
    },
    mounted() {
      this.fetchBooksHistory();
    },
    methods: {
      fetchBooksHistory() {
        axios
          .get("http://localhost:3000/books_history")
          .then((response) => {
            console.log("response.data",response.data)
            this.books_history = response.data;
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
          });
      },
      async updateHistory(history){
        // console.log("history",history)
        let id = Reflect.get(history.book, 'id');
        let response = await axios.get(`http://localhost:3000/books/${id}`)
        this.books_data = response.data
        this.books_history_selected = history
        this.books_history_modal = true
      },
      async extensionModal(history){
        let id = Reflect.get(history.book, 'id');
        let response = await axios.get(`http://localhost:3000/books/${id}`)
        this.books_data = response.data
        this.books_history_selected = history
        this.extension_modal = true
      },
      closeAssignBook(){
        this.books_history_modal = false
      },

      submitAssignBook(){
        console.log("this.books_history_selected",this.books_history_selected.book.id)
        axios.put(`http://localhost:3000/books_history/${this.books_history_selected.id}`,this.books_history_selected)
        .then(async() => {
              if(this.books_history_selected.status == "Retrieved"){
                let bookId = this.books_history_selected.book.id
                console.log("bookId",bookId)

                let book =  await axios.get(`http://localhost:3000/books/${bookId}`)
                console.log("book",book)
                axios.put(`http://localhost:3000/books/${bookId}`,{...book.data,copies:book.data.copies + this.books_history_selected.copies})
                .then(() => {
                  this.fetchBooksHistory(); 
                  this.toast.success("Book Retrieved!");
                  this.isUpdateFormVisible = false;
                }).catch((error) => {
                  console.error("Error updating user:", error);
                });
              }
              this.books_history_modal = false;
          })
          .catch((error) => {
            console.error("Error updating user:", error);
          });
      },
      approve_extension_request(v){

        if(this.remarks == ''){
          this.remarks_error = "This Field is required "
        }else{
          if(v == "Approved"){
              let sendData = {
                ...this.books_history_selected
              }

              sendData['retrieve_date'] = this?.books_history_selected?.extention_date
              sendData['extension_status'] = "Approved"
              sendData['extenstion_remarks'] = this.remarks

              axios.put(`http://localhost:3000/books_history/${this.books_history_selected.id}`,sendData)
                .then(()=>{
                  let sendData1 = {
                    user: this.books_history_selected.user,
                    bookHistory:this.books_history_selected,
                    extension_status:v,
                    extenstion_remarks:this.remarks,
                    type: "User"
                  }
                  axios.post(`http://localhost:3000/notification`,sendData1)
                  .then(()=>{
                  this.toast.success("Book Extension Approved!");
                    this.fetchBooksHistory()
                    this.extension_modal = false
                    this.book_history_selected = {
                      id:'',
                      retrieve_date: "",
                      status:"",
                      user: {},
                      copies:"",
                      book: {}
                    }
                    this.remarks = ''
                  }).catch(err=>{
                    console.log("error",err)
                  })
                }).catch(err=>{
                    console.log("error",err)
                  })
          }else{
              if(v == "Rejected"){
                let sendData = {
                ...this.books_history_selected
              }


              sendData['extension_status'] = "Rejected"
              sendData['extenstion_remarks'] = this.remarks

              axios.put(`http://localhost:3000/books_history/${this.books_history_selected.id}`,sendData)
                .then(()=>{
                  let sendData1 = {
                    user: this.books_history_selected.user,
                    bookHistory:this.books_history_selected,
                    extension_status:v,
                    extenstion_remarks:this.remarks,
                    type: "User"
                  }
                  axios.post(`http://localhost:3000/notification`,sendData1)
                  .then(()=>{
                  this.toast.error("Book Extension Rejected!");
                    this.fetchBooksHistory()
                    this.extension_modal = false
                    this.book_history_selected = {
                      id:'',
                      retrieve_date: "",
                      status:"",
                      user: {},
                      copies:"",
                      book: {}
                    }
                    this.remarks = ''
                  }).catch(err=>{
                    console.log("error",err)
                  })
                }).catch(err=>{
                    console.log("error",err)
                  })
            }
          }
        }
      },

      handleInputChange(e){
        const { value } = e.target;
        this.remarks = value;
        this.remarks_error = '';
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

 
  #button_list{
    display: flex;
  }

  .update-btn, .delete-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    margin-right: 10px;
    transition: background-color 0.3s, transform 0.3s;
  }
  
  .update-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
  }
  
  .update-btn:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  .error_info{
    color: red !important;
  }

  .cancel-btn {
    background-color: #51b4ff;
    color: white;
    border: none;
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
    font-size: 14px;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .actions {
    cursor: pointer;
    display: flex;
    flex-direction: row !important;
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
    position: relative;
    border-radius: 8px;
    width: 400px;
  }
  
  .modal-content label {
    display: block;
    margin-bottom: 5px;
  }
  
  .modal-content input, .modal-content select {
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
    background-color: #34778f;
    color: white;
    padding: 5px 10px;
    margin-right: 10px !important;
    text-align: center;
    cursor: pointer;
    border: none;
    border-radius: 5px;
  }

  @media (max-width: 768px) {
    .actions {
      margin-left: 0px;
      cursor: pointer;
      display: flex;
      flex-direction: row !important;
      align-items: center !important;
      justify-content: center !important;
    }
   }
  </style>
  
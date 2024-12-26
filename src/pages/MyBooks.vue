<template>
    <Header />
    <div id="app">
      <div class="container">
        <div class="card">
          <div class="card-header">
            <h3>Books Subscribed</h3>
          </div>
          <div style="overflow-x:auto;border:1px solid #ddd">
          <table>
            <thead style="background-color:#f2f2f2;">
              <tr>
                <th style="border-right: 1px solid #ddd;">Book Name</th>
                <th style="border-right: 1px solid #ddd;">return Date</th>
                <th style="border-right: 1px solid #ddd;">Copies</th>
                <th style="border-right: 1px solid #ddd;">User</th>
                <th style="border-right: 1px solid #ddd;">Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(history, index) in books_history" :key="index">
                <td style="border-right: 1px solid #ddd;">{{ history.book.name }}</td>
                <td style="border-right: 1px solid #ddd;">{{ history?.retrieve_date }}</td>
                <td style="border-right: 1px solid #ddd;">{{ history.copies }}</td>
                <td style="border-right: 1px solid #ddd;">{{ history.user.name }}</td>
                <td style="border-right: 1px solid #ddd;">{{ history.status }}</td>
                <td style="font-weight: 800;font-size: 18px !important;">
                  <h6 v-if="history.status == 'Retrieved'">{{ history.status == 'Retrieved' && 'Book Retrieved' }}</h6> 
                  <button v-if="history.request_for_extention == false && history.status == 'Assigned'" class="submit-button" @click="requestExtension(history)">Extend Request</button>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
  
   
    </div>

    <div class="modal" :class="{ active: this.modalActive }">
        <div class="modal-content">
          <h3 id="modal-title">Request For Extension</h3>
          <br>
          
          <label>Extension Date</label>
          <input :min="today"  @input="handleInputChange" required type="date" name="date" v-model="extension_info.date" />
          <h6 class="error_info">{{ this.extension_info_error.date }}</h6>
         
          <label>Remarks</label>
          <textarea style="width:100%;padding: 5px;" required type="text"  @input="handleInputChange" name="user_remarks" v-model="extension_info.user_remarks" />
          <h6 class="error_info">{{ this.extension_info_error.user_remarks  }}</h6>

          <br>
          <br>

          <div id="button_list">
          <button class="submit-button" @click="submitExtensionRequest">Submit</button>
          <button class="cancel-button" @click="this.modalActive = false">Cancel</button>
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
        books_history: [],
        modal:false,
        book_history_selected:'',
        today: new Date().toISOString().split("T")[0],
        modalActive:false,
        extension_info:{
          user_remarks:"",
          date:"" 
        },
        extension_info_error:{
          user_remarks:"",
          date:"" 
        },
        input:{
          user:"",
          bookHistory:"",
          extension_status:"",
          extenstion_remarks:"",
          type:""
        }
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
            let userInfo = this.$store.getters.userInfo;
            this.books_history = response.data.filter((f)=>f.user.id == userInfo.id);
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
          });
      },
      submitExtensionRequest(){
        if(this.extension_info.date == ''){
          this.extension_info_error.date = "This Field is Required!"
        }else if(this.extension_info.user_remarks == ''){
          this.extension_info_error.user_remarks = "This Field is Required!"
        }else{
          let send_data = {...this.book_history_selected}
          send_data['request_for_extention'] = true
          send_data['user_remarks'] = this.extension_info?.user_remarks
          send_data['extension_status'] = "Pending"
          send_data['extention_date'] = this.extension_info?.date

          // let id = Reflect.get(book_history_selected.book, 'id');
          // console.log("id",id)
          axios
            .put(`http://localhost:3000/books_history/${this.book_history_selected?.id}`,send_data)
            .then(() => {

              

              this.toast.success("BookExtension Request Raised!");
              
              this.fetchBooksHistory();
              this.modalActive = false
              this.extension_info={
                user_remarks:"",
                date:"" 
              }
              this.extension_info_error={
                user_remarks:"",
                date:"" 
              }
              
            })
            .catch((error) => {
              console.error("Error fetching users:", error);
            });
        }
      },
      handleInputChange(e){
        const { name, value } = e.target;
        this.extension_info[name] = value;
        this.extension_info_error[name] = '';
      },
      requestExtension(history){

        this.book_history_selected = history
        this.modalActive = true
      }
      
    }
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
  .error_info{
    color: red !important;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th {
    padding: 8px 10px;
    text-align: left;
    font-size: 14px !important;
    border-bottom: 1px solid #ddd;
  }

  td {
    padding: 8px 10px;
    text-align: left;
    font-size: 14px !important;
    border-bottom: 1px solid #ddd;
  }
  
  .actions button {
    margin-left: 10px;
    cursor: pointer;
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
    margin-right: 10px !important;
    text-align: center;
    cursor: pointer;
    border: none;
    font-size: 11px !important;
    border-radius: 5px;
  }
  .cancel-button {
    display: block;
    background-color: #fff;
    border: 1px solid #ddd;
    color: black;
    padding:5px 10px;
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
  }
  </style>
  
<template>
      <form  @submit.prevent="handleLogin">
      
        <label>Matriculation Id:</label>
        <input v-model="input.matriculation_id" @input="handleInputChange"  name="matriculation_id" id="matriculation_id"  type="text" required />
       
        <label>Password:</label>
        <input autocomplete="current-password" v-model="input.password" @input="handleInputChange"  name="password" id="password"  type="password" required />
        <br />
        <button
          type="submit"
          class="submit-button"
        >
          Submit
        </button>
        <!-- <div class="auth-actions">
          <button @click="handleLogin" class="auth-button">Login</button>
          <button @click="handleSignup" class="auth-button signup-button">Signup</button>
        </div> -->
      </form>
    </template>
    
    <script>
  
    import axios from 'axios';
    import { useToast } from 'vue-toastification';
    
    export default {
      name:"LoginPage",
      setup(){
        const toast = useToast();
        return { toast };
      },
      data(){
        return{
          input:{
            matriculation_id: "",
            password:""
          },
          error:{
            matriculation_id: "",
            password:""
          }
        }
      },
      methods: {
        async handleLogin() {
              if(this.input.matriculation_id == ""){
                  this.error.email = "This field is required"
              } else if(this.input.password == ""){
                  this.error.password = "This field is required"
              }else{
                 await axios.get(`http://localhost:3000/users`,{params:{...this.input}})
                  .then((res)=>{
                      console.log("res?.status",res)
                      if(res?.status == 200){
                        this.$store.dispatch("login",res?.data[0]);
                        if(res?.data?.length > 0){
                          this.toast.success("Login Successful!");
                          this.$router.push('/book');
                        }else{
                          this.toast.error("Invalid Matriculation Id and Password");
                          console.log("Error Not found",res?.data)
                        }
                      }else if(res?.status == 403){
                        console.log("Error")
  
                      }
                  }).catch((err)=>{
                      console.log("err",err)
                  })
          }
        },
        resetform(){
          this.input={
            matriculation_id: "",
            password:""
          },
          this.error={
            matriculation_id: "",
            password:""
          }
          },
        handleInputChange(e){
            const { name, value } = e.target;
            this.input[name] = value;
            this.error[name] = '';
          }
      },
    };
    </script>
    
    <style scoped>
    
    body {
      background-color: #f2f2f2; 
      margin: 0;
      font-family: Arial, sans-serif;
    }
    
   
    form {
      max-width: 490px;
      margin: 50px auto;
      background: #ffffff; 
      text-align: left;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
    }
    
    
    label {
      color: #333; 
      display: inline-block;
      margin: 25px 0 15px;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: bold;
    }
    

    input {
      display: block;
      padding: 10px 6px;
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #ccc; 
      border-radius: 5px;
      color: #555;
      font-size: 1em;
    }
    
    input:focus {
      outline: none;
      border-color: #830404; 
      box-shadow: 0 0 5px rgba(131, 4, 4, 0.5);
    }
    

    .submit-button {
      background-color: maroon;
      color: white;
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 5px;
      margin-top: 20px;
      width: 100%;
      font-weight: bold;
      font-size: 1em;
    }
    
    .submit-button:hover {
      background-color: #a60000; 
    }
    
  
    .auth-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    
    .auth-button {
      background-color: #4caf50; 
      color: white;
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 5px;
      width: 48%;
      font-weight: bold;
      font-size: 1em;
      transition: background-color 0.3s, color 0.3s;
    }
    
    .auth-button:hover {
      background-color: #388e3c;
    }
    
    .signup-button {
      background-color: #2196f3; 
    }
    
    .signup-button:hover {
      background-color: #1976d2; 
    }
    </style>
    
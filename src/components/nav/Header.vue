<template>
  <header  class="header">
    <div class="header__logo">
      <img
        src="@/assets/logo3.svg"
        alt="Logo"
        style="margin-right: 10px;"
      />
      <router-Link to="/">QuickStack</router-Link>

    </div>
    <!-- <nav class="header__nav">
      <ul>
        <li>
          <router-Link to="/register">Register</router-Link>
        </li>
        <li>
          <router-Link to="/book">Books</router-Link>
        </li>
        <p>&nbsp;  &nbsp;</p>
      </ul>
    </nav> -->
    <div class="header_location">
      
      <font-awesome-icon @click="this.drawer = true" class="menu" :icon="['fas', 'bars']" />
      <font-awesome-icon @click="this.notification = true" v-if="isLoggedIn" class="menu"  :icon="['fas', 'bell']" />

    <p>&nbsp; &nbsp; &nbsp;</p>
    <div class="header__actions">
      <router-link v-if="this?.userinfo?.roles == 'admin'" to="/admin" class="admin-link">Admin</router-link>
      <router-link v-if="isLoggedIn" to="/my_book" class="admin-link">My Books</router-link>
      <button v-if="isLoggedIn" @click="logout">Logout</button>

        <router-link v-if="!isLoggedIn" to="/register" class="admin-link">Register</router-link>
        <router-link v-if="!isLoggedIn" to="/login" class="admin-link">Login</router-link>
      <font-awesome-icon @click="this.notification = true" v-if="isLoggedIn" class="bell"  :icon="['fas', 'bell']" />

    </div>
   </div>
  </header>
  <div v-if="this.drawer == true"  class="menu_slider">

    <div>
      <h6 style="color: black;" @click="this.drawer = false" class="link_text1" >Close Menu</h6>
      <h6 @click="handleDrawerMenuClick" class="link_text1"><router-link v-if="this.userinfo.roles == 'admin'" to="/admin" >Admin</router-link></h6>
      <h6 @click="handleDrawerMenuClick" class="link_text1"><router-link v-if="isLoggedIn" to="/my_book" >My Books</router-link></h6>
      <h6  v-if="isLoggedIn" @click="logout();handleDrawerMenuClick()" class="link_text1">Logout</h6>
      <h6 @click="handleDrawerMenuClick" class="link_text1"><router-link v-if="!isLoggedIn" to="/register" >Register</router-link></h6>
      <h6 @click="handleDrawerMenuClick" class="link_text1" ><router-link v-if="!isLoggedIn" to="/login" >Login</router-link></h6>
    </div>
  </div>

  <div v-if="this.notification == true" class="menu_notification">
       <h6 style="color: black;" @click="this.notification = false" class="link_text" >x</h6>

      <div style="border-bottom: 1px solid #ddd;padding: 5px;padding-bottom: 5px !important;" v-for="data in notification_data" :key="data" >
          <h3 style="font-weight: 700;line-height: 5px;font-size: 13px;margin-bottom: 0px !important;padding-bottom: 0px !important;">{{ data?.bookHistory?.book?.name }}</h3>
          <p style="font-size: 11.5px;line-height: 4px;margin-bottom: 0px !important;padding-bottom: 0px !important;">Status: {{ data?.extension_status }}</p>
          <p style="font-size: 11.5px;line-height: 4px;;margin-bottom: 0px !important;padding-bottom: 0px !important;padding-bottom: 5px !important;">Remarks: {{ data?.extenstion_remarks }}</p>
      </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HeaderComponent",
  data() {
    return {
      loggedIn:false,
      userinfo:{},
      searchQuery: "",
      drawer:false,
      notification:false,
      notification_data:[]
    };
  },
  mounted(){
    this.loggedIn = this.$store.getters.isAuthenticated;
    this.userinfo =  this.$store.getters.userInfo;

    if(this.loggedIn == true){
      this.getnotification()
    }
  },
  computed:{
    isLoggedIn() {
      if(this.$store.getters.isAuthenticated == true){
        this.getnotification()
      }
      return this.$store.getters.isAuthenticated;
    },
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  watch: {
    isLoggedIn(newValue) {
      this.loggedIn = newValue;

      if(newValue == true){
      this.getnotification()
    }
    },
    userInfo(newValue) {
      this.userinfo = newValue;
    },
  },
  methods: {
    login() {
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
    handleSearch() {
      // Logic to handle search, e.g., emit event or trigger navigation
      console.log("Searching for:", this.searchQuery);
    },
    getnotification(){
      axios
          .get("http://localhost:3000/notification")
          .then((response) => {
            let userInfo = this.$store.getters.userInfo;
            if(userInfo.id !== undefined){
               this.notification_data = response.data.filter((f)=>f.user.id == userInfo.id);
            }
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
          });
    },
    handleDrawerMenuClick(){
      this.drawer = false
    }
  },
};
</script>

<style scoped>
/* Header Base Styling */
.header {
  min-width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 4rem;
  background-color: #830404;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  top: 0;
  z-index: 100;
}

.menu_slider{
  display: inline-block;
  width: 350px;
  min-height: 100vh;
  height: 100%;
  z-index: 1000;
  background-color: white !important;
  position: absolute;
  right: 0px !important;
  top:0px !important
  
}

/* Logo Styling */
.header__logo {
  display: flex;
  align-items: center;
}

.header__logo img {
  height: 40px;
  width: 40px;
  /* border-radius: 50%; */
}

.header__logo a {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
  transition: color 0.3s;
}

.header__logo a:hover {
  color: #f0d5ff;
}

.header_location {
  display: flex;
  position: relative;
}

/* Navigation Styling */
.header__nav {
  margin-left: auto;
}

.header__nav ul {
  list-style: none;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
}

.header__nav li {
  margin: 0;
}

.menu_notification{
  top:65px;
  right:10px;
  position: absolute;
  width:300px;
  height: 300px;
  overflow-y: scroll;
  background: white !important;
  border: 1px solid #eee;
  box-shadow: #eee;
}

.header__nav a {
  text-decoration: none;
  color: white;
  font-weight: 500;
  padding: 0.25rem 0;
  border-bottom: 2px solid transparent;
  transition: color 0.3s, border-color 0.3s;
}

.header__nav a:hover,
.header__nav a.router-link-active {
  color: #f0d5ff;
  border-color: #f0d5ff;
}

/* Cart Badge */
.cart {
  display: flex;
  align-items: center;
}

.cart base-badge {
  margin-left: 0.5rem;
}

/* Actions (Login/Logout and Admin Button) */
.header__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.link_text{
  position: absolute;
  cursor: pointer;
  font-size: 20px !important;
  padding: 10px;
  margin: 0px 10px !important;
  right: 5px;
}

.link_text1{
  font-size: 20px !important;
  padding: 10px;
  color: rgb(54, 24, 161);
  text-decoration: underline;
  margin: 0px 10px !important;
}

button {
  font: inherit;
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
  padding: 0.5rem 1.5rem;
  border: 1px solid white;
  background-color: transparent;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

button:hover {
  background-color: white;
  color: #45006d;
}
.bell{
  cursor: pointer;
  border: 1px solid white;
  border-radius: 5px;
  padding: 6px 10px;
}

.admin-link {
  text-decoration: none;
  font-weight: bold;
  font-size: 12px !important;
  color: #ffc107; /* Gold Color for Admin */
  padding: 0.5rem 1rem;
  border: 1px solid #ffc107;
  border-radius: 5px;
  background-color: transparent;
  transition: background-color 0.3s, color 0.3s;
}

.admin-link:hover {
  background-color: #ffc107;
  color: #45006d;
}

/* Search Bar Styling */
.header__search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  margin-right: 5px !important;
}

.header__search-bar input {
  border: none;
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 20px;
  flex-grow: 1;
}

.header__search-bar button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}

.header__search-bar button img {
  height: 20px;
  width: 20px;
}

.menu{
  display: none;
  margin-left: 20px !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    display: flex;
    align-content: center;
    align-items: center;
    padding: 1rem 10px;
  }

  .header__logo{
    background-color: transparent;
  }

  .header_location{
    display: flex;
    align-content: center;
    justify-content: center;
    margin-top: 55px;
    margin-right: -20px !important;
    font-size: 25px;
  }

  

  .header__nav ul {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .header__actions {
    display: none !important;
    margin-top: 0.5rem;
  }

  .menu{
  display: block !important;
  }
  .header__search-bar {
    width: 100%;
    margin-top: 0.5rem;
    order: 3; /* Move below the nav and actions */
  }
}


</style>

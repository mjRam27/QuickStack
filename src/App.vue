<template>
  <div class="app-container">
    <Header />
      <div class="main_container">
        <router-view />
      </div>
    <Footer />
  </div>
</template>

<script>

import Header from "./components/nav/Header.vue";
import Footer from "./components/nav/Footer.vue";
export default {
  components: {
    Header,
    Footer
   
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  margin: 0;
}

body {
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
}

.app-container {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}

.main_container {
  flex: 1; 
  min-height: calc(
    100vh - 228px - 80px
  ); 
}

footer {
  margin-top: auto; 
}



</style>

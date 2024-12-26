<template>
  <footer class="footer">
    <div class="footer__content">

      <div class="footer__brand">
        <img
          src="https://cdn-icons-png.flaticon.com/256/9043/9043296.png"
          alt="VueShop"
          class="footer__logo"
        />
        <h4 style="margin-top: 5px;font-weight: bolder;">QuickStack</h4>

      </div>

      <div class="footer__nav">
        <h4>Quick Links</h4>
        <ul>
          <li class="social-icon"><router-link to="/">Home</router-link></li>
        </ul>
      </div>

      <div class="footer__contact">
        <h4>Contact</h4>
        <ul>
          <li class="social-icon">Email: support@QuickStack.com</li>
          <li class="social-icon">Phone: +1 234 567 890</li>
        </ul>
      </div>

      <div class="footer__social">
        <h4>Follow Us</h4>
        <ul>
          <li>
            <a href="https://facebook.com" target="_blank" class="social-icon"
              >Facebook</a
            >
          </li>
          <li>
            <a href="https://twitter.com" target="_blank" class="social-icon"
              >Twitter</a
            >
          </li>
          <li>
            <a href="https://instagram.com" target="_blank" class="social-icon"
              >Instagram</a
            >
          </li>
        </ul>
      </div>
    </div>

    <p class="copy_right">&copy; 2024 QuickStack. All rights reserved.</p>

  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
};
</script>

<style scoped>

.footer {
  background-color: #f5f5f5; 
  color: black !important;
  padding: 2rem 1rem 0rem 1rem;
  font-size: 0.9rem;
  padding: 20px 5rem 0px 5rem;
  margin-top: 2rem;
}

.copy_right{
 text-align: center;
 background-color: #830404;
 padding: 7px;
 color: white;
 font-size: 11px;
}

.footer__content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer__brand {
  flex: 1;
  min-width: 200px;
}

.footer__logo {
  width: 100px;
  margin-bottom: 1rem;
}

.footer__nav,
.footer__contact,
.footer__social {
  flex: 1;
  min-width: 200px;
}

h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 0.5rem;
}

a {
  text-decoration: none;
  color: black;
}

a:hover {
  color: #f0b800; 
}

.social-icon {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 13px !important;
  font-weight: 500 !important;
}

@media (max-width: 768px) {
  .footer__content {
    flex-direction: column;
    align-items: center;
  }

 
}
</style>

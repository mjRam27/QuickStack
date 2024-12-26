<template>
  <section class="update-form-container">
    <form @submit.prevent="submitUpdateForm">
      <h3>Update User</h3>
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" v-model="updatedUser.name" id="name" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="updatedUser.email" id="email" required />
      </div>

      <div class="form-group">
        <label for="mobile">Mobile</label>
        <input type="tel" v-model="updatedUser.mobile" id="mobile" required />
      </div>

      <div class="form-group">
        <label for="matriculation_id">Matriculation ID</label>
        <input type="text" v-model="updatedUser.matriculation_id" id="matriculation_id" required />
      </div>

      <div class="form-group">
        <label for="roles">Roles</label>
        <select v-model="updatedUser.roles" id="roles" required>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-button">Submit</button>
      </div>
    </form>
  </section>
</template>

<script>
import axios from "axios";
import { useToast } from 'vue-toastification';

export default {
  props: ["id"],
  data() {
    return {
      updatedUser: {
        name: "",
        email: "",
        mobile: "",
        matriculation_id: "",
        roles: "",
      },
    };
  },
  setup(){
      const toast = useToast();
      return { toast };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      axios
        .get(`http://localhost:3000/users/${this.id}`)
        .then((response) => {
          console.log("response",response)
          this.updatedUser = response.data;
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    },
    submitUpdateForm() {
      axios
        .put(`http://localhost:3000/users/${this.id}`, this.updatedUser)
        .then((response) => {
          this.toast.success("User Updated!");
          console.log("User updated:", response.data);
          this.$router.push("/view-users"); 
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    },
  },
};
</script>

<style scoped>
.update-form-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus,
select:focus {
  border-color: #830404;
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.submit-button {
  padding: 10px 20px;
  background-color: maroon;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s, transform 0.3s;
}

.submit-button:hover {
  background-color: #800000;
  transform: scale(1.05);
}
</style>
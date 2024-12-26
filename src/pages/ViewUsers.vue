<template>
  <section class="view-users-section">
    <div v-if="users.length > 0" class="users-list">
      <h3>Users List</h3>

      <div style='overflow-x:auto;border:1px solid #ddd'>
      <table class="users-table">
        <thead style="background-color:#f2f2f2;">
          <tr>
            <th style="border-right: 1px solid #ddd;">Name</th>
            <th style="border-right: 1px solid #ddd;">Email</th>
            <th style="border-right: 1px solid #ddd;">Mobile</th>
            <th style="border-right: 1px solid #ddd;">Matriculation ID</th>
            <th style="border-right: 1px solid #ddd;">Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td style="border-right: 1px solid #ddd;">{{ user.name }}</td>
            <td style="border-right: 1px solid #ddd;">{{ user.email }}</td>
            <td style="border-right: 1px solid #ddd;">{{ user.mobile }}</td>
            <td style="border-right: 1px solid #ddd;">{{ user.matriculation_id }}</td>
            <td style="border-right: 1px solid #ddd;">{{ user.roles }}</td>
            <td class="action-buttons">
              <button @click="openUpdateForm(user)" class="update-btn">
               Update
              </button>
              <button @click="deleteUser(user.id)" class="delete-btn">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

    </div>
    <div v-else>
      <p>No users found.</p>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      users: [],
    };
  },
  setup(){
      const toast = useToast();
      return { toast };
    },
  mounted() {
    this.viewUsers();
  },
  methods: {
    viewUsers() {
      axios
        .get("http://localhost:3000/users")
        .then((response) => {
          this.users = response.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    openUpdateForm(user) {
      this.$router.push({ path: `/update-user/${user.id}` });
    },
    deleteUser(userId) {
      const confirmed = confirm("Are you sure you want to delete this user?");
      if (confirmed) {
        axios
          .delete(`http://localhost:3000/users/${userId}`)
          .then(() => {
            this.toast.success("User Deleted!");
            this.users = this.users.filter((user) => user.id !== userId);
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
          });
      }
    },
  },
};
</script>

<style scoped>
.view-users-section {
  padding: 2rem;
  max-width: 85rem;
  margin: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #333;
  font-weight: 600;
}

.users-list {
  max-width: 100%;
  margin: 0 auto;
}

.users-table {
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
  /* margin-top: 1.5rem; */
}

.users-table th,
.users-table td {
  font-size: 14px;
  text-align: left;
}

.users-table th {
  background-color: #f2f2f2;
  color: black;
  padding: 8px 10px;
  font-size: 14px;
  font-weight: 600;
}

.users-table td {
  border-top: 1px solid #ddd;
  background-color: #fff;
  padding: 8px 10px;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.update-btn,
.delete-btn {
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

.update-btn {
  background-color: #2a8230;
  color: white;
  border: none;
}

.update-btn:hover {
  background-color: #2a8230;
}

.delete-btn {
  background-color: #b24646;
  color: white;
  border: none;
}

.delete-btn:hover {
  background-color: #b24646;
}

p {
  font-size: 1.2rem;
  color: #333;
}
</style>

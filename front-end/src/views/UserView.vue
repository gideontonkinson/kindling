<template>
<div v-if="!loggedIn" class = "container m-5">
  <h3>Hello! We hope that here on Kindling you can find your best better half or some new best friends.</h3>
  <div class="form" v-if="!newUser">
    <input v-model="username" placeholder="Username"><br>
    <input type = "password" v-model="password" placeholder="Password"><br>
    <div>
      <button @click="login">Login</button> | 
      <button @click="createAccount">Register</button>
      <p>{{ message }}</p>
    </div>
  </div>
  <div class="form" v-else-if="newUser">
      <input v-model="firstname" placeholder="First Name"><br>
      <input v-model="lastname" placeholder="Last Name"><br>
      <input v-model="email" placeholder="Email"><br>
      <input v-model="username" placeholder="Username"><br>
      <input type = "password" v-model="password" placeholder="Password"><br>
      <div data-toggle="buttons">
        <label class="btn">
            <input  v-model="gender" name="gender" type="radio" class ="cheker" autocomplete="off" v-bind:value="'Male'" checked>
            Male
        </label>
        <label class="btn">
            <input v-model="gender" name="gender" type="radio" class ="cheker" v-bind:value="'Female'">
            Female
        </label>
      </div>
      <textarea v-model="description" placeholder="About You - Include things like what type of relationship you are looking for, age and city"></textarea><br>
      <input type="file" name="photo" @change="fileChanged">
      <div>
        <button @click="hasAccount">Login</button> | 
        <button @click="register">Register</button>
        <p>{{ message }}</p>
      </div>
  </div>
</div>
<div class="admin" v-else-if="loggedIn">
  <h1>Hello {{user.firstname}} {{user.lastname}}</h1>
    <div class="edit">
      <div>
        <img class = "photo" :src="user.path" />
        <p>Username: {{user.username}}</p><br>
        <label></label><input v-model="user.email" placeholder="Email"><br>
        <label>About you:</label><br><textarea v-model="user.description" placeholder="About You - Include things like what type of relationship you are looking for, age and city"></textarea><br>
      </div>
      <div>
        <button @click="deleteUser(user)">Delete Account</button>
        <button @click="editUser(user)">Save Changes</button>
      </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'UserView',
  data() {
    return {
      newUser: false,
      loggedIn: false,
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      password: "",
      gender: "",
      description: "",
      file: null,
      user: null,
      message: ""
    }
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    createAccount(){
      this.newUser = true;
    },
    hasAccount() {
      this.newUser = false;
    },
    async register() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/register', {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          username: this.username,
          password: this.password,
          gender: this.gender,
          description: this.description,
          path: r1.data.path
        });
        if(r2.data.message != null){
          this.message = r2.data.message;
        } else {
          this.user = r2.data;
          this.loggedIn = true;
          this.firstname = null;
          this.lastname = null;
          this.username = null;
          this.password = null;
          this.email = null;
          this.description = null;
          this.message = null;
        }
      } catch (error) {
        return false;
      }
    },
    async login() {
      try {
        let response = await axios.post('/api/login', {
          username: this.username,
          password: this.password,
        });
        console.log(response.data);
        if(response.data.message != null){
          this.message = response.data.message;
        } else {
          this.user = response.data;
          this.loggedIn = true;
          this.firstname = null;
          this.lastname = null;
          this.username = null;
          this.password = null;
          this.email = null;
          this.description = null;
          this.message = null;
        }
      } catch (error) {
        return false;
      }
    },
    async deleteUser(currUser) {
      try {
        await axios.delete("/api/persons/" + currUser._id);
        this.user = null;
        this.loggedIn = false;
        return true;
      } catch (error) {
        return false;
      }
    },
    async editUser(currUser) {
      try {
        await axios.put("/api/persons/" + currUser._id, {
          email: this.user.email,
          description: this.user.description,
        });
        return true;
      } catch (error) {
        return false;
      }
    },
  }
}
</script>

<style>
  textarea {
    width: 50%;
    height: 5em;
  }

  textarea:focus {
    outline-color: rgb(223, 18, 18);
  }

  .photo {
    width: 40em;
    border-radius: 5px;
  }

  input {
    margin: 5px !important;
    border-style: solid !important;
    border-radius: 7px !important;
    border-width: 1px;
    width: 15em;
    padding: 4px;
  }

  input:focus {
    outline-color: rgb(223, 18, 18);
  }

  .cheker {
    width: 2em !important;
    accent-color: rgb(223, 18, 18);
  }

  button {
    margin: 5px !important;
    padding: 10px;
    border-radius: 10px !important;
    color: #fff;
    background: rgb(223, 100, 18);
    border-style: solid;
    border-color: #fff;
  }

  button:hover {
    background: rgb(197, 84, 8);
  }
</style>
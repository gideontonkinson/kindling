<template>
<div class = "container mb-5">
  <h2>Kindle any new relationship right here!</h2>
  <h4>Click on a user to find out more about them and to see their reviews.</h4>
  <section class="image-gallery">
    <div class = "row mb-5">
      <div class="col-xs-12 col-sm-6 mb-2" v-for="person in persons" :key="person._id">
        <router-link  :to="'/persons/' + person._id">
        <h4>{{person.firstname}} {{person.lastname}}</h4>
        <p>Reviews - {{person.reviewsCount}}</p>
        <img :src="person.path" />
        </router-link>
      </div>
    </div>
  </section>
</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
export default {
  name: 'HomeView',
  data() {
    return {
     persons: [],
    }
  },
  created() {
    this.getPersons();
  },
  methods: {
    async getPersons() {
      try {
        let response = await axios.get('/api/persons');
        this.persons = response.data;
        return true;
      } catch (error) {
        return false;
      }
    },
  },
}
</script>

<style scoped>
  a {
    text-decoration: none;
    color: #222;
  }

  a:hover {
    color: #333;
  }

  img {
    border-radius: 5px;
    width:90%;
  }

  .image-gallery {
    margin-top: 2em;
    margin-bottom: 2em;
  }
</style>


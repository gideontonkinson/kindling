<template>
<div class = "container">
    <div> 
        <h2><b>{{person.firstname}} {{person.lastname}}</b></h2>
        <img class = "photo" :src="person.path" />
        <p><b>About Them:</b> {{ person.description }}</p>

    </div>
    <div>
    <h4>Add a Review</h4>
    <div>
        <input v-model="addedName" placeholder="Name">
        <br>
        <textarea v-model="addedReview" placeholder="Write your review here"></textarea>
        <br />
        <button @click="addReview">Add Review</button>
    </div>
    <h3>Reviews</h3>
    <div v-for="review in person.reviews" :key="review.date">
      <hr>
      <p>{{review.text}}</p>
      <p><i> --{{review.author}}</i></p>
      <p><i>{{review.date}}</i></p>
    </div>
</div>
</div>
</template>

<script src="https://momentjs.com/downloads/moment.js"></script>
<script>
import axios from 'axios';
export default {
  name: 'PersonView',
  data() {
    return {
      person: {},
      addedName: "",
      addedReview: "",
    }
  },
  created() {
    this.getPerson();
  },
  mounted() {
    const plugin = document.createElement("script");
    plugin.setAttribute(
      "src",
      "https://momentjs.com/downloads/moment.js"
    );
    plugin.async = true;
    document.head.appendChild(plugin);
  },
  methods: {
    async addReview() {
        let newReview = {
            author: this.addedName,
            text: this.addedReview,
            date: moment().format('MMMM Do YYYY, h:mm a'),
        };
        console.log(newReview);
        try {
            let response = await axios.put('/api/reviews/' + this.person._id, {
                review: newReview,
            });
            this.person = response.data;
            this.addedName = null;
            this.addedReview = null;
        } catch (error){
            return false;
        }
    },
    async getPerson() {
        let url = window.location.href;
        let parts = url.split("/");
        let id = parts[4];
        try {
            let response = await axios.get('/api/persons/' + id);
            this.person = response.data;
        } catch (error) {
            return false;
        } 
    },
  }
}
</script>
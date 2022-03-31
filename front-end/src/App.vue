<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/user">User</router-link>
    </nav>
    <router-view/>
    <div class="footer fixed-bottom">
    <a class = "stealth" href = "https://github.com/gideontonkinson/kindling.git">Github Repository</a>
  </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #cf5808;
}

nav a:hover {
  color: #b3510f;
}

/* Footer */
.footer {
  margin-top: 20px;
  height: 50px;
  padding: 20px 100px 0px 100px;
  background: #e3e3e3;
  font-size: 12px;
}

.stealth {
  text-decoration: none;
  color: #222;
}

.stealth:hover {
  color: #333;
}
</style>

<template>
  <div id="app" class="container">
    <div id="nav">
      <!--<router-link to="/">Home</router-link> | -->
      <!--<router-link to="/event/create">Create event</router-link> |-->
      <!--<router-link to="/login">Login</router-link> |-->
    </div>
    <router-view/>
    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          Logo
        </b-col>
        <b-col>
        <b-jumbotron>
          <b-btn variant="primary" href="#">Login</b-btn>
          <b-btn variant="success" href="#">Sign up</b-btn>
        </b-jumbotron>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px 30px 30px 0;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

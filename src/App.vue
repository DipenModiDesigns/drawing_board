<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    <router-link to="/new">New</router-link>
  </div>

  <router-view />
  
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      
    };
  },
  components: {
  },
  computed: {
  },
  beforeMount() {
  },
};
</script>
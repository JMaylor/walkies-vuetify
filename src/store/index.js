import Vue from "vue";
import Vuex from "vuex";
const axios = require("axios");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    baseURL: process.env.VUE_APP_API,
    mapboxKey: process.env.VUE_APP_MAPBOX_KEY,
    token: localStorage.getItem("token") || null,
    drawer: true,
    userProfile: null,
  },
  mutations: {
    storeToken(state, token) {
      state.token = token;
    },
    toggleDrawer(state) {
      state.drawer = !state.drawer;
    },
    setUserProfile(state, profile) {
      state.userProfile = profile;
    },
    addDog(state, dog) {
      state.userProfile.dogs.push(dog);
    },
    removeDog(state, dog) {
      state.userProfile.dogs = state.userProfile.dogs.filter(
        (x) => x._id.$oid !== dog._id.$oid
      );
    },
  },
  actions: {
    storeToken(context, token) {
      context.commit("storeToken", token);
      localStorage.setItem("token", token);
    },
    getUserProfile(context) {
      if (context.state.token) {
        // attempt to retrieve profile
        console.log("getting profile");
        axios
          .get(`${context.state.baseURL}user`, {
            headers: {
              Authorization: "Bearer " + context.state.token,
            },
          })
          .then((response) => {
            const userProfile = JSON.parse(response.data.user);
            userProfile.events.forEach((event, i) => {
              userProfile.events[i] = JSON.parse(event);
            });
            userProfile.events.sort((x, y) => x.time.$date - y.time.$date);
            userProfile.dogs.forEach((dog, i) => {
              userProfile.dogs[i] = JSON.parse(dog);
            });
            context.commit("setUserProfile", userProfile);
          });
      }
    },
    logout() {},
    async addDog(context, dog) {
      const newDog = await axios.post(
        `${context.state.baseURL}dogs`,
        {
          name: dog.name,
          breed: dog.breed,
          date_of_birth: `${dog.date_of_birth}-01`,
        },
        {
          headers: {
            Authorization: `Bearer ${context.state.token}`,
          },
        }
      );
      context.commit("addDog", {
        name: dog.name,
        breed: dog.breed,
        date_of_birth: `${dog.date_of_birth}-01`,
        _id: {
          $oid: newDog.data.id,
        },
      });
    },
    async editDog(context, dog) {
      console.log(dog);
      await axios.put(
        `${context.state.baseURL}dogs/${dog.id}`,
        {
          name: dog.name,
          breed: dog.breed,
          date_of_birth: `${dog.date_of_birth}-01`,
        },
        {
          headers: {
            Authorization: `Bearer ${context.state.token}`,
          },
        }
      );
      context.dispatch("getUserProfile");
    },
  },
  modules: {},
});

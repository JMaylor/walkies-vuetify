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
		state.drawer = !state.drawer
	},
    setUserProfile(state, profile) {
      state.userProfile = profile;
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
            userProfile.dogs.forEach((dog, i) => {
              userProfile.dogs[i] = JSON.parse(dog);
            });
			context.commit("setUserProfile", userProfile);
		  });
      }
    },
  },
  modules: {},
});

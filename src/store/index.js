import Vue from "vue";
import Vuex from "vuex";
const axios = require("axios");
const moment = require("moment");

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
    acceptEvent(state, id) {
      // find the event index
      const eventIndex = state.userProfile.events.findIndex(
        (x) => x._id.$oid == id
      );
      // change status to accepted
      if (eventIndex > -1) {
        state.userProfile.events[eventIndex].status = "accepted";
      }
    },
    declineEvent(state, id) {
      // find the event index
      const eventIndex = state.userProfile.events.findIndex(
        (x) => x._id.$oid == id
      );
      // remove it
      if (eventIndex > -1) {
        state.userProfile.events.splice(eventIndex, 1);
      }
    },
    updateEvent(state, updatedEvent) {
      // find the event index
      const eventIndex = state.userProfile.events.findIndex(
        (x) => x._id.$oid == updatedEvent._id.$oid
      );
	  // update it
	  state.userProfile.events.splice(eventIndex, 1, updatedEvent)
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
            // parse the user profile
            const userProfile = JSON.parse(response.data.user);

            // parse each individual event
            userProfile.events.forEach((event, i) => {
              userProfile.events[i] = JSON.parse(event);
            });

            // filter to only store events in the future
            const now = new moment();
            // console.log(now);
            // console.log(moment(userProfile.events[4].time.$date));
            // console.log(moment(userProfile.events[4].time.$date).isAfter(now));
            userProfile.events = userProfile.events.filter((x) =>
              moment(x.time.$date).isAfter(now)
            );

            // sort to store events chronologically
            userProfile.events.sort((x, y) => x.time.$date - y.time.$date);

            // parse each individual dog
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
    acceptEvent(context, id) {
      axios
        .put(
          `${context.state.baseURL}events/accept/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${context.state.token}`,
            },
          }
        )
        .then((response) => {
          context.commit("acceptEvent", id);
          return response;
        })
        .catch((err) => console.log(err));
    },
    declineEvent(context, id) {
      axios
        .delete(`${context.state.baseURL}events/decline/${id}`, {
          headers: {
            Authorization: `Bearer ${context.state.token}`,
          },
        })
        .then((response) => {
          context.commit("declineEvent", id);
          return response;
        })
        .catch((err) => console.log(err));
    },
    updateEvent(context, event) {
      console.log(event);
      axios
        .put(`${context.state.baseURL}events/${event.id}`, event.details, {
          headers: {
            Authorization: `Bearer ${context.state.token}`,
          },
        })
        .then((response) => {
          // parse the returned event
          const updatedEvent = JSON.parse(response.data.event);
          context.commit("updateEvent", updatedEvent);
        })
        .catch((err) => console.log(err));
    },
  },
  modules: {},
});

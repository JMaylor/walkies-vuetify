import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#277DA1",
        secondary: "#4D908E",
        accent: "#577590",
        error: "#F94144",
        info: "#43AA8B",
        success: "#90BE6D",
        warning: "#F8961E",
      },
    },
  },
});

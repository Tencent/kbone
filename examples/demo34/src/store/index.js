import { createStore } from "vuex";

export default createStore({
	state: {
		profile: {
			role: "unauthenticated",
			uuid: "unauthenticated"
		},
		userInfo: null
	},
	getters: {
		role({ profile }) {
			return profile ? profile.role : "";
		},
		uuid({ profile }) {
			return profile ? profile.uuid : "";
		}
	}
});

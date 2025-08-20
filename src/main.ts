import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import ZeroMd, { STYLES } from "zero-md";

customElements.define(
	"zero-md",
	class extends ZeroMd {
		async load() {
			await super.load();
			this.template = STYLES.preset("dark");
		}
	},
);

const app = mount(App, {
	target: document.getElementById("app")!,
});

export default app;

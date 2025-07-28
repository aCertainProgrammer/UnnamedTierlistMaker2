type State = {
	current_screen: "main_screen" | "settings_screen";
};

export const state = $state({
	current_screen: "main_screen",
});

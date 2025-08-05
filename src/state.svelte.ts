type State = {
	current_screen: "main_screen" | "settings_screen";
	tier_editor_open: boolean;
	currently_edited_tier_id: number;
};

export const state = $state({
	current_screen: "main_screen",
	tier_editor_open: false,
	currently_edited_tier_id: 0,
});

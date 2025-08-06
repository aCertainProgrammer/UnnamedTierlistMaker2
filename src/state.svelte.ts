type ProgramState = {
	current_screen: "main_screen" | "settings_screen";
	tier_editor_open: boolean;
	currently_edited_tier_id: number;
	export_pool_overlay_open: boolean;
	snapshot_overlay_open: boolean;
};

export const program_state = $state({
	current_screen: "main_screen",
	tier_editor_open: false,
	currently_edited_tier_id: 0,
	export_pool_overlay_open: false,
	snapshot_overlay_open: false,
});

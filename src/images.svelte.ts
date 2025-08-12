import type { TierlistType, TierType } from "./types";
import { capitalize, exportImage } from "./util";
import { getTierlist } from "./tierlist.svelte";

const champion_width_px = 80;
const champion_height_px = 80;
const padding_x_px = 4;
const padding_y_px = 4;
const tier_gap_px = 0;
const tier_name_height_px = champion_height_px;
const tier_name_width_px = champion_width_px;
const tierlist_name_height_px = 50;

const tierlist_name_font_size = 32;
const tier_name_font_size = 24;
const max_image_width_px = 1920;
const max_image_heigth_px = 1920;
const min_image_width_px = 600;

let image_width_px = max_image_width_px;
let image_heigth_px = max_image_heigth_px;

const tier_champions_max_width_px = $derived(
	image_width_px - 2 * padding_x_px - tier_name_width_px,
);

const text_color = "#cccccc";
const background_color = "#0d1117";
const tier_background_color = "#0a0440";
const tier_name_color = "#000000";
const tierlist_name_color = "#06145e";

const champion_icon_padding_px = 2;

function getFont(font_size: number): string {
	return `${font_size}px Helvetica, Arial, sans-serif`;
}

export async function exportTierlistAsImage(tierlist: TierlistType) {
	const canvas = document.createElement("canvas");

	const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
	ctx.textBaseline = "middle";

	getAndSetImageSize(tierlist);

	canvas.width = image_width_px;
	canvas.height = image_heigth_px;

	ctx.fillStyle = background_color;
	ctx.fillRect(0, 0, image_width_px, image_heigth_px);

	drawTierlistName(ctx, tierlist.name);

	const base_y = padding_y_px + tierlist_name_height_px;
	await Promise.all(
		tierlist.tiers.map(async (tier, index) => {
			const rows = getTierRowCount(tier);
			const y = getTierYPositionInTierlist(index, tierlist);
			const starting_y = base_y + y;

			await drawTier(ctx, tier, starting_y, rows);
		}),
	);

	const dataURL = canvas.toDataURL();
	const name =
		tierlist.name.length < 200 && tierlist.name.length > 0
			? tierlist.name
			: "Tierlist";
	exportImage(dataURL, `${name}.png`);
}

function drawTierlistName(
	ctx: CanvasRenderingContext2D,
	tierlist_name: string,
) {
	const width_px = image_width_px - 2 * padding_x_px;
	ctx.fillStyle = tierlist_name_color;
	ctx.fillRect(padding_x_px, padding_y_px, width_px, tierlist_name_height_px);

	ctx.fillStyle = text_color;
	ctx.font = getFont(tierlist_name_font_size);
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(
		tierlist_name,
		image_width_px / 2,
		padding_y_px + tierlist_name_height_px / 2,
		image_width_px - 2 * padding_x_px,
	);
}

async function drawTier(
	ctx: CanvasRenderingContext2D,
	tier: TierType,
	start_height_px: number,
	rows: number,
) {
	const height_px = rows * champion_height_px;

	ctx.fillStyle = tier.color;
	ctx.fillRect(padding_x_px, start_height_px, tier_name_width_px, height_px);

	ctx.font = getFont(tier_name_font_size);
	ctx.fillStyle = tier_name_color;
	ctx.textAlign = "center";
	ctx.fillText(
		tier.name,
		padding_x_px + tier_name_width_px / 2,
		start_height_px + height_px / 2,
		tier_name_width_px,
	);

	const remaining_width_px =
		image_width_px - 2 * padding_x_px - tier_name_width_px;
	ctx.fillStyle = tier_background_color;
	ctx.fillRect(
		padding_x_px + tier_name_width_px,
		start_height_px,
		remaining_width_px,
		height_px,
	);

	const max_champions_per_row = Math.floor(
		tier_champions_max_width_px / champion_width_px,
	);
	await Promise.all(
		tier.champions.map(async (champion, index) => {
			const column = index % max_champions_per_row;
			const row = Math.floor(index / max_champions_per_row);
			const src = `./img/champion_icons/${capitalize(champion)}.webp`;
			const image = await loadImage(src);

			const start_x =
				padding_x_px +
				tier_name_width_px +
				champion_width_px * column +
				champion_icon_padding_px;

			ctx.drawImage(
				image,
				start_x,
				row * champion_height_px +
					start_height_px +
					champion_icon_padding_px,
				champion_width_px - champion_icon_padding_px * 2,
				champion_height_px - champion_icon_padding_px * 2,
			);
		}),
	);

	ctx.strokeStyle = "black";
	ctx.lineWidth = 1;
	ctx.strokeRect(
		padding_x_px,
		start_height_px,
		tier_name_width_px + remaining_width_px,
		height_px,
	);
}

function getTierYPositionInTierlist(
	index: number,
	tierlist: TierlistType,
): number {
	let y = 0;

	for (let i = 0; i < index; i++) {
		const tier = tierlist.tiers[i];
		const rows = getTierRowCount(tier);

		y += rows * champion_height_px;
	}

	return y;
}

function getTierRowCount(tier: TierType) {
	const needed_horizontal_space_px =
		tier.champions.length == 0
			? champion_width_px
			: tier.champions.length * champion_width_px;

	return Math.ceil(needed_horizontal_space_px / tier_champions_max_width_px);
}

async function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

function getAndSetImageSize(tierlist: TierlistType): void {
	let max_width = 0;
	let should_change_width = true;
	for (let i = 0; i < tierlist.tiers.length; i++) {
		const tier = tierlist.tiers[i];
		if (getTierRowCount(tier) > 1) {
			should_change_width = false;
			break;
		}

		const tier_x =
			tier_name_width_px + tier.champions.length * champion_width_px;
		const max_local_x = 2 * padding_x_px + tier_x;

		if (max_local_x > max_width) {
			max_width = max_local_x;
		}
	}

	if (should_change_width) {
		image_width_px = max_width;
	}
	if (image_width_px < min_image_width_px) {
		image_width_px = min_image_width_px;
	}

	const start_y = 2 * padding_y_px + tierlist_name_height_px;
	const needed_y = tierlist.tiers.reduce(
		(accumulator, current) =>
			accumulator + getTierRowCount(current) * champion_height_px,
		start_y,
	);

	image_heigth_px = needed_y;
}

//function getLines(
//	ctx: CanvasRenderingContext2D,
//	text: string,
//	maxWidth: number,
//): Array<string> {
//	let words = text.split(" ");
//	let lines = [];
//	let currentLine = words[0];
//
//	for (let i = 1; i < words.length; i++) {
//		let word = words[i];
//		let width = ctx.measureText(currentLine + " " + word).width;
//
//		if (width < maxWidth) {
//			currentLine += " " + word;
//		} else {
//			lines.push(currentLine);
//			currentLine = word;
//		}
//	}
//
//	lines.push(currentLine);
//	return lines;
//}

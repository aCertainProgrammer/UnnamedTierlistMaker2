import { exec } from "node:child_process";
import { captureRejections } from "node:events";
import { createWriteStream } from "node:fs";
import { writeFile } from "node:fs/promises";
import { stdout } from "node:process";
import { finished, pipeline, Readable } from "node:stream";

type PatchData = {
	n: {
		champion: String;
	};
};

const patch_json: PatchData = await fetch(
	"https://ddragon.leagueoflegends.com/realms/euw.json",
).then((data) => data.json());
const patchString = patch_json.n.champion;

const smallApiPath = `https://ddragon.leagueoflegends.com/cdn/${patchString}/img/champion/`;
const smallFsPath = "../public/img/champion/";
const smallPostfix = ".png";

const champions = await fetch(
	`https://ddragon.leagueoflegends.com/cdn/${patchString}/data/en_US/champion.json`,
)
	.then((data) => data.json())
	.then((json) => json.data);

let startedIndex = 1;
let finishedIndex = 1;

async function processChampion(champion: String) {
	console.log(
		"Working on " +
			champion +
			" - " +
			startedIndex +
			"/" +
			Object.keys(champions).length,
	);
	startedIndex += 1;

	const smallChampionResponse = await fetch(
		smallApiPath + champion + smallPostfix,
	);

	if (smallChampionResponse == null || smallChampionResponse.body == null) {
		console.error("things are null: " + champion);
		return;
	}

	await writeFile(
		smallFsPath + champion + smallPostfix,
		Readable.fromWeb(smallChampionResponse.body),
		{
			flag: "w",
		},
	);

	console.log(
		"Done with " +
			champion +
			" - " +
			finishedIndex +
			"/" +
			Object.keys(champions).length,
	);
	finishedIndex += 1;
}

const promises: Array<Promise<void>> = [];
for (let champion in champions) {
	const promise = processChampion(champion);
	promises.push(promise);
}

await Promise.all(promises);

exec(
	"cd ../public/img/champion_icons/ && python3 ./image_minifier.py",
	(err, stdout, stderr) => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(stdout);
	},
);

// this is just to make the file an ES6 Module
export {};

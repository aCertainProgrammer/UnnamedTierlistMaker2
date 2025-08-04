export function capitalize(string: string): string {
	if (string == null) return "";
	if (string.length == 0) return "";

	let newString = "";
	newString += string[0].toUpperCase();
	for (let i = 1; i < string.length; i++) {
		newString += string[i].toLowerCase();
	}
	return newString;
}

export function prettifyChampionName(name: string): string {
	switch (name) {
		case "aurelionsol":
			name = "Aurelion Sol";
			break;
		case "belveth":
			name = "Bel'Veth";
			break;
		case "chogath":
			name = "Cho'Gath";
			break;
		case "drmundo":
			name = "Dr. Mundo";
			break;
		case "ksante":
			name = "K'Sante";
			break;
		case "kaisa":
			name = "Kai'sa";
			break;
		case "khazix":
			name = "Kha'Zix";
			break;
		case "kogmaw":
			name = "Kog'Maw";
			break;
		case "leesin":
			name = "Lee Sin";
			break;
		case "masteryi":
			name = "Master Yi";
			break;
		case "missfortune":
			name = "Miss Fortune";
			break;
		case "reksai":
			name = "Rek'Sai";
			break;
		case "tahmkench":
			name = "Tahm Kench";
			break;
		case "twistedfate":
			name = "Twisted Fate";
			break;
		case "velkoz":
			name = "Vel'Koz";
			break;
		case "xinzhao":
			name = "Xin Zhao";
			break;
		default:
			name = capitalize(name);
	}
	return name;
}

export async function readFile(file: File): Promise<string> {
	const text = file.text();
	return text;
}

export function exportData(data: object, fileName: string): void {
	const blob = new Blob([JSON.stringify(data, null, 4)], {
		type: "plain/text",
	});
	const fileUrl = URL.createObjectURL(blob);
	const downloadElement = document.createElement("a");
	downloadElement.href = fileUrl;
	downloadElement.download = fileName;
	downloadElement.style.display = "none";
	document.body.appendChild(downloadElement);
	downloadElement.click();
	document.body.removeChild(downloadElement);
}

export function exportImage(dataUrl: string, fileName: string): void {
	const downloadElement = document.createElement("a");
	downloadElement.href = dataUrl;
	downloadElement.download = fileName;
	downloadElement.style.display = "none";
	document.body.appendChild(downloadElement);
	downloadElement.click();
	document.body.removeChild(downloadElement);
}

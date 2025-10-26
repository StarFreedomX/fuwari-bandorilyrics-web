/* This is a script to create a new post markdown file with front-matter */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

function ask(question: string): Promise<string> {
	const rl = readline.createInterface({
		input: process.stdin as NodeJS.ReadableStream,
		output: process.stdout as NodeJS.WritableStream,
	});
	return new Promise((resolve) =>
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer);
		}),
	);
}

function sanitizeFilename(name: string): string {
	return name
		.replace(/[<>:"/\\|?*]/g, "_") // Windows非法字符
		.replace(/\s+/g, "_") // 空格变下划线
		.replace(/_+/g, "_") // 连续下划线合并
		.replace(/^_+|_+$/g, "") // 去掉首尾下划线
		.substring(0, 255); // 限制长度（部分文件系统限制）
}

const bandNames = [
	"Poppin'Party",
	"Afterglow",
	"Roselia",
	"Hello, Happy World!",
	"Pastel*Palettes",
	"RAISE A SUILEN",
	"Morfonica",
	"MyGO!!!!!",
	"Ave Mujica",
	"梦限大MewType",
];
/*const bandNicknames = {
    "Poppin'Party": [
        "poppin'party",
        "poppin party",
        "ppp",
        "破琵琶",
        "popipa",
        "poppin",
        "poppinparty",
        "ポピパ",
        "歩品破茶"
    ],
    "Afterglow": [
        "afterglow",
        "ag",
        "夕阳红",
        "悪蓋愚狼"
    ],
    "Roselia": [
        "roselia",
        "r",
        "r组",
        "ロゼリア",
        "相声团",
        "相声组",
        "露世裏悪",
        "露世里恶",
        "萝"
    ],
    "Hello, Happy World!": [
        "ハロー、ハッピーワールド！",
        "hello, happy world!",
        "hello，happy world！",
        "hello, happy world！",
        "hello,happyworld",
        "hhw",
        "harohapi",
        "ハロハピ",
        "破狼法被威悪怒",
        "儿歌团",
        "好好玩"
    ],
    "Pastel*Palettes": [
        "pastel＊palettes",
        "pastel*palettes",
        "pastelpalettes",
        "pastel",
        "palettes",
        "pasupare",
        "pp",
        "パスパレ",
        "破巣照破烈斗",
        "怕死怕累"
    ],
    "RAISE A SUILEN": [
        "raiseasuilen",
        "raise",
        "suilen",
        "ras",
        "ラス",
        "零図悪酔恋",
        "睡莲",
        "麗厨唖睡蓮",
        "睡蓮"
    ],
    "Morfonica": [
        "morfonica",
        "毛二力",
        "monika",
        "monica",
        "モニカ",
        "蝶团",
        "蝶",
        "m团",
        "m"
    ],
    "MyGO!!!!!": [
        "MyGO!!!!!",
        "MyGO！！！！！",
        "mygo",
        "我去！！！！！",
        "我去!!!!!",
        "我去",
        "卖狗",
        "go"
    ],
    "Ave Mujica": [
        "母鸡卡",
        "mujica",
        "am",
        "mjk"
    ],
    "梦限大MewType": [
        "梦",
        "梦限大"
    ]
}*/
const orgFileName = await ask("请输入歌曲文件名: ");
let fileName = sanitizeFilename(orgFileName);
const songName = await ask(
	`${orgFileName === fileName ? "" : `已修正为: ${fileName}\n`}请输入歌曲名称: `,
);
const publishDate = await ask("请输入歌曲发布日期(yyyy-MM-dd): ");
const game_ver =
	Number(await ask("歌曲本身是否只有Game Ver(默认为否，若是请输入1): ")) === 1;
let categoryIndex: number;
do {
	categoryIndex =
		Number(
			await ask(
				"歌曲类型(默认原创曲Original,若为翻唱曲Cover和合作曲Extra请分别输入1和2): ",
			),
		) || 0;
} while (![0, 1, 2].includes(categoryIndex));
const category = ["Original", "Cover", "Extra"].at(categoryIndex);
const nicknames = await ask("请输入歌曲别名: ");
const band = await ask("请输入歌曲乐队名: ");
const isNormalBand = bandNames.includes(band);
let bandTag = band.includes(",") ? `"${band}"` : band;
if (!isNormalBand) {
	bandTag = await ask("请输入乐队Tag: ");
}

const nicokaraVideo: { href: string; title: string }[] = [];
let O_Nicokara = false;
const S_Nicokara =
	Number(
		await ask("是否只有Short Ver卡拉ok视频(输入1为是，其他输入为否): "),
	) === 1;
if (categoryIndex >= 1) {
	O_Nicokara =
		Number(
			await ask("该歌曲是否只有其他版本卡拉ok视频(输入1为是，其他输入为否): "),
		) === 1;
}
while (true) {
	const href = await ask("请输入nicokara视频链接,若无则直接回车: ");
	if (!href.length) break;
	const title = await ask("请输入链接展示的标题,若重新输入链接则直接回车: ");
	if (!title.length) continue;
	nicokaraVideo.push({ href, title });
}

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i;
if (!fileExtensionRegex.test(fileName)) {
	fileName += ".md";
}

const targetDir = "./src/content/songs/";
const fullPath = path.join(targetDir, fileName);

if (fs.existsSync(fullPath)) {
	console.error(`Error: File ${fullPath} already exists `);
	process.exit(1);
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath);
if (!fs.existsSync(dirPath)) {
	fs.mkdirSync(dirPath, { recursive: true });
}

const content = `---
title: ${songName}
published: ${publishDate}
tags: [${bandTag}${game_ver ? ", Game Ver" : ""}${
	nicokaraVideo.length ? (O_Nicokara ? ", O-Nicokara" : ", Nicokara") : ""
}${nicokaraVideo.length && S_Nicokara ? ", S-Nicokara" : ""}]
band: ${band}
category: ${category}
lyrics: |
---
${nicknames}
${
	O_Nicokara
		? `\n:::note
BanG Dream!版本暂无卡拉ok视频，此处使用其他版本视频
:::`
		: ""
}${
	S_Nicokara
		? `\n:::note
暂无完整版视频，此处使用short ver.
:::`
		: ""
}
${nicokaraVideo
	.map(
		(e) =>
			`<summary>
    <a href="${e.href}">
        ${e.title}
    </a>
</summary>`,
	)
	.join("\n")}
`;

fs.writeFileSync(path.join(targetDir, fileName), content);

console.log(`Song ${fullPath} created`);

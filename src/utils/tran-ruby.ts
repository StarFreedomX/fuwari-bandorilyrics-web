export function tranRuby(input: string): string {
	const delAdd = /＋+/g;
	const delNum = /\[\d+\]/g;
	const delNumTime = /\[\d+\|\d{2}:\d{2}:\d{2,}\]/g;
	const delTime = /\[\d{2}:\d{2}:\d{2,}\]/g;
	const header: string[] = [];

	// 1. 提取所有 <define ...> 定义
	const defines = new Map<string, string>();
	let output = input.replace(
		/<define\s+(show\s+)?<(\w+)>\s*=\s*(<[^>]+>)\s*>/g,
		(_, show, tag, html) => {
			defines.set(tag, html);

			// 仅在带 show 前缀时触发 header.push
			if (show) {
				const match = html.match(/color:#([0-9A-Fa-f]{6})/);
				if (match) {
					header.push(
						`<span style="height:10px;width:10px;background:#${match[1]};display:inline-block"></span> ` +
							`${html}${tag}${html.replace(/^<(\w+)[^>]*>/, "</$1>")}`,
					);
				}
			}
			return "";
		},
	);

	// 处理假名
	output = output
		.replace(delAdd, "")
		.replace(delNum, "")
		.replace(delNumTime, "")
		.replace(delTime, "")
		.replace("　", " ")
		.trim();

	/*output = output.replace(
		/\{([^|{}]+)\|([^|{}]+)\}/g,
		"<ruby>$1<rt>$2</rt></ruby>",
	);*/
	output = convertMultiline(output);
	// console.log(output, "\n-------------------\n");

	// 自定义标签替换
	for (const [tag, html] of defines.entries()) {
		const openTag = new RegExp(`<${tag}>`, "g");
		const closeTag = new RegExp(`</${tag}>`, "g");
		const htmlEndTag = html.replace(/^<(\w+)[^>]*>/, "</$1>");
		output = output.replace(openTag, html).replace(closeTag, htmlEndTag);
	}

	// 假设 output 是宏展开后包含 <style> 的字符串
	const styleRegex = /<style[\s\S]*?<\/style>/gi;

	// 提取并移除所有 style
	const styles = (output.match(styleRegex) || []).join("");
	output = output.replace(styleRegex, "");

	// 清理正文首尾空白、标签间多余空白、连续空行
	output = output.replace(/^\s+|\s+$/g, "");

	return `${preCss}${styles}<div class="lyrics" style="white-space: pre-wrap; margin:0;">${
		header.length ? `${header.join("  ")}<br><br>` : ""
	}${output}</div>`;
	//return `<br><div style="white-space: pre-wrap;">${header.length ? `${header.join("  ")}<br><br>` : ""}${output}</div><br>`;
}

const preCss = `
<style>
	.lyrics rt {
        font-size: 0.75em;
    }
    .lyrics ruby, .lyrics rb, .lyrics rt {
        background: inherit
    }
    .lyrics .hide-rt {
    	visibility:hidden;
        font-size: 1.333em
    }
    .lyrics .colorful {
    	--turn: left;
        background:-webkit-linear-gradient(var(--turn),var(--colors));
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
        -webkit-box-decoration-break:clone;
    }
	.lyrics .colorful::selection,
	.lyrics .colorful *::selection {
	    background: rgba(255, 255, 255, 0.2); /* 半透明选中背景 */
	}

</style>
`;

export function convertRubyInline(line: string): string {
	// 把标签当成切断点
	const tagRegex = /(<\/?\w+[^>]*>)/g;
	const parts = line.split(tagRegex).filter((p) => p.length > 0);

	// 存储处理后的文本
	const converted: string[] = [];

	for (const part of parts) {
		if (part.match(/^<\/?\w/)) {
			// 是标签，不处理
			converted.push(part);
			continue;
		}

		// 非标签内容，处理 {漢字|かな}
		const rubyRegex = /\{([^|{}]+)\|([^|{}]+)\}/g;
		let hasRuby = false;
		let result = "";
		let rt = "";
		let lastIndex = 0;

		for (const match of part.matchAll(rubyRegex)) {
			hasRuby = true;
			const [raw, kanji, kana] = match;
			const index = match.index ?? 0;

			const plain = part.slice(lastIndex, index);
			result += plain;
			rt += `<span class="hide-rt">${plain}</span>`;

			const ml = (0.75 * kana.length - kanji.length) / 2;

			if (ml >= 0) {
				result += `<span style="margin-left:${ml.toFixed(3)}em;letter-spacing:${ml.toFixed(3)}em">${kanji}</span>`;
				rt += kana;
			} else {
				result += kanji;
				rt += `<span style="margin-left:${(-ml).toFixed(3)}em;letter-spacing:${(-ml).toFixed(3)}em">${kana}</span>`;
			}

			lastIndex = index + raw.length;
		}

		const tail = part.slice(lastIndex);
		result += tail;
		rt += `<span class="hide-rt">${tail}</span>`;

		if (hasRuby) {
			converted.push(`<ruby>${result}<rt><span>${rt}</span></rt></ruby>`);
		} else {
			converted.push(part);
		}
	}

	return converted.join("");
}

export function convertMultiline(text: string) {
	const lines = text.split(/\r?\n/);
	return lines.map((l) => convertRubyInline(l)).join("\n");
}

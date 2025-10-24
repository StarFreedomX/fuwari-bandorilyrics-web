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
	output = output.replace(
		/\{([^|{}]+)\|([^|{}]+)\}/g,
		"<ruby>$1<rt>$2</rt></ruby>",
	);

	// 自定义标签替换
	for (const [tag, html] of defines.entries()) {
		const openTag = new RegExp(`<${tag}>`, "g");
		const closeTag = new RegExp(`</${tag}>`, "g");
		const htmlEndTag = html.replace(/^<(\w+)[^>]*>/, "</$1>");
		output = output.replace(openTag, html).replace(closeTag, htmlEndTag);
	}

	output = output.replace(
		/<([a-zA-Z][\w-]*)([^>]*)>([\s\S]*?)<\/\1>/g,
		(_, tagName, attrs, innerText) => {
			// 去掉首尾的空格和换行
			const cleaned = innerText.replace(/^[\s\r\n]+|[\s\r\n]+$/g, "");
			return `<${tagName}${attrs}>${cleaned}</${tagName}>`;
		},
	);

	return `<br><div style="white-space: pre-wrap;">${header.length ? `${header.join("  ")}<br><br>` : ""}${output}</div><br>`;
}

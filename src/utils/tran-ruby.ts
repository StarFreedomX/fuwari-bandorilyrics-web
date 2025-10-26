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
	// 假设 output 是宏展开后包含 <style> 的字符串
	const styleRegex = /<style[\s\S]*?<\/style>/gi;

	// 提取并移除所有 style
	const styles = (output.match(styleRegex) || []).join("");
	output = output.replace(styleRegex, "");

	// 清理正文首尾空白、标签间多余空白、连续空行
	output = output.replace(/^\s+|\s+$/g, ""); /*.replace(
		/<([a-zA-Z][\w-]*)([^>]*)>([\s\S]*?)<\/\1>/g,
		(_, tagName, attrs, innerText) => {
			// 去掉首尾的空格和换行
			const cleaned = innerText.replace(/^[\s\r\n]+|[\s\r\n]+$/g, "");
			return `<${tagName}${attrs}>${cleaned}</${tagName}>`;
		},
	)*/ // 去掉最外侧首尾空白;

	return `${pre_style}${styles}<div class="colorful-page" style="white-space: pre-wrap; margin:0;">${
		header.length ? `${header.join("  ")}<br><br>` : ""
	}${output}</div>`;
	//return `<br><div style="white-space: pre-wrap;">${header.length ? `${header.join("  ")}<br><br>` : ""}${output}</div><br>`;
}

const pre_style = `
<style>
    .colorful-page {
      display: inline-block; /* 关键：保证整个容器是同一个渐变上下文 */
      background: linear-gradient(90deg, #ff3377, #ffcc33, #33ffcc, #3377ff);
      -webkit-background-clip: text;
      white-space: pre-wrap;
    }


    .colorful {
        -webkit-text-fill-color: transparent;
        color: transparent; 
      }
    
      /* ruby 和 rt 继承渐变 */
      .colorful ruby,
      .colorful rt,
      .colorful rb {
        -webkit-text-fill-color: transparent;
        color: transparent;
      }
  
      .colorful::selection,
      .colorful *::selection {
        background: rgba(255, 255, 255, 0.2); /* 半透明选中背景 */
      }
  </style>`;

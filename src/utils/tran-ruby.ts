export function tranRuby(input: string): string {
    const delAdd = /＋+/g
    const delNum = /\[[0-9]+]/g
    const header: string[] = []
    // 1. 提取所有 <define <tag> = <HTML>> 定义
    const defines = new Map<string, string>();
    input = input.replace(/<define\s+<(\w+)>\s*=\s*(<[^>]+>)\s*>/g, (_, tag, html) => {
        defines.set(tag, html);
        const match = html.match(/color:#([0-9A-Fa-f]{6})/);
        if (match) {
            header.push(`<span style="height:10px;background:#${match[1]};display:inline-block;width:10px"></span> ${html}${tag}${html.replace(/^<(\w+)[^>]*>/, "</$1>")}`);
        }
        return "";
    });

    //处理假名
    input = input.replace(delAdd,'').replace(delNum,'').trim();
    let output = input.replace(/\{([^|{}]+)\|([^|{}]+)\}/g, "<ruby>$1<rt>$2</rt></ruby>");

    // 自定义标签替换
    for (const [tag, html] of defines.entries()) {
        const openTag = new RegExp(`<${tag}>`, "g");
        const closeTag = new RegExp(`</${tag}>`, "g");
        const htmlEndTag = html.replace(/^<(\w+)[^>]*>/, "</$1>");
        output = output.replace(openTag, html).replace(closeTag, htmlEndTag);
    }

    //console.log(output);
    return `<br\><div style="white-space: pre-wrap;">${header.length ? header.join("  ")+"<br\><br\>":""}${output}</div><br\>`;
}
export function tranRuby(input: string): string {
    const delAdd = /＋+/g
    const delNum = /\[[0-9]+]/g

    // 1. 提取所有 <define <tag> = <HTML>> 定义
    const defines = new Map<string, string>();
    input = input.replace(/<define\s+<(\w+)>\s*=\s*(<[^>]+>)\s*>/g, (_, tag, html) => {
        defines.set(tag, html);
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
    return `<br\><div style="white-space: pre-wrap;">${output}</div><br\>`;
}
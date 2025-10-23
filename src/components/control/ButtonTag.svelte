<script lang="ts">
    import { onMount } from "svelte";
    import { getTagsUrl } from "@utils/url-utils.ts";

    export let size: string | undefined;
    export let dot: boolean | undefined;
    export let tagName: string | undefined;
    export let label: string | undefined;

    // 当前 URL 中的 tag 列表
    let tags: string[] = [];

    // 解析 URL 查询参数
    function parseTagsFromUrl(): string[] {
        const params = new URLSearchParams(window.location.search);
        return params.getAll("tag");
    }

    // 计算点击后应跳转的新 URL
    function getNextTags(tags: string[], tag: string): string[] {
        return tags.includes(tag)
            ? tags.filter((t) => t !== tag)
            : [...tags, tag];
    }

    // 初始获取一次
    onMount(() => {
        tags = parseTagsFromUrl();

        // 监听浏览器前进/后退或 pushState 变化
        window.addEventListener("popstate", () => {
            tags = parseTagsFromUrl();
        });

        // 可选：监听导航变化（如单页应用内部跳转）
        const observer = new MutationObserver(() => {
            tags = parseTagsFromUrl();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    // 响应式计算下一个 href
    $: nextHref = getTagsUrl(getNextTags(tags, tagName ?? ""));
    $: isActive = tags.includes(tagName ?? "");
</script>

<a
        href={nextHref}
        aria-label={label}
        class={`btn-regular h-8 text-sm px-3 rounded-lg transition ${isActive && "selected"}`}
>

    {#if dot}
        <div
                class="h-1 w-1 bg-[var(--btn-content)] dark:bg-[var(--card-bg)] transition rounded-md mr-2"
        ></div>
    {/if}
    <slot></slot>
</a>

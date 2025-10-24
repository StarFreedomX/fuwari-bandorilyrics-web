import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";

export function pathsEqual(path1: string, path2: string) {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

export function getSongUrlBySlug(slug: string): string {
	return url(`/songs/${slug}/`);
}

export function getTagUrl(tag: string): string {
	if (!tag) return url("/archive/");
	return url(`/archive/?tag=${encodeURIComponent(tag.trim())}`);
}

export function getTagsUrl(nextTags: {
	tags: string[];
	noTags: string[];
}): string {
	const tagsPart = nextTags?.tags?.length
		? nextTags.tags.map((tag) => `tag=${encodeURIComponent(tag.trim())}`)
		: [];
	const noTagsPart = nextTags?.noTags?.length
		? nextTags.noTags.map(
				(noTag) => `noTag=${encodeURIComponent(noTag.trim())}`,
			)
		: [];
	const tagParams = [...tagsPart, ...noTagsPart];
	return url(`/archive/?${tagParams.join("&")}`);
}

export function getCategoryUrl(category: string | null): string {
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === i18n(I18nKey.uncategorized).toLowerCase()
	)
		return url("/archive/?uncategorized=true");
	return url(`/archive/?category=${encodeURIComponent(category.trim())}`);
}

export function getDir(path: string): string {
	const lastSlashIndex = path.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return path.substring(0, lastSlashIndex + 1);
}

export function url(path: string) {
	return joinUrl("", import.meta.env.BASE_URL, path);
}

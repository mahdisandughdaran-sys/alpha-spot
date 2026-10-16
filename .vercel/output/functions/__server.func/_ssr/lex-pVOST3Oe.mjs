//#region node_modules/.nitro/vite/services/ssr/assets/lex-pVOST3Oe.js
/** Invisible separator. Persian stays the prefix so existing checks still match. */
var SEP = "⁣";
var locale = "fa";
function getLocale() {
	return locale;
}
function setLocaleStore(next) {
	locale = next;
}
/** Keep the Persian sentence exact and attach an English twin for the UI. */
function msg(fa, en) {
	if (!fa || fa.includes(SEP)) return fa;
	return `${fa}${SEP}${en}`;
}
function splitBi(value) {
	const i = value.indexOf(SEP);
	if (i < 0) return { fa: value };
	return {
		fa: value.slice(0, i),
		en: value.slice(i + 1)
	};
}
function plain(value) {
	return splitBi(value).fa;
}
function tr(value, en) {
	const parts = splitBi(value);
	if (locale !== "en") return parts.fa;
	return en ?? parts.en ?? parts.fa;
}
//#endregion
export { tr as a, setLocaleStore as i, msg as n, plain as r, getLocale as t };

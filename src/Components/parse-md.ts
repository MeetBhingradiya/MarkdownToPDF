import MarkdownIt from "markdown-it";
import { FilterXSS, escapeAttrValue, safeAttrValue, whiteList } from "xss";

export const configuredXss = new FilterXSS({
	whiteList: {
		...whiteList,
		summary: [],
		h1: ["id"],
		h2: ["id"],
		h3: ["id"],
		h4: ["id"],
		h5: ["id"],
		h6: ["id"],
		kbd: ["id"],
		input: ["checked", "disabled", "type"],
		iframe: [
			"width",
			"height",
			"allowfullscreen",
			"frameborder",
			"start",
			"end",
		],
		img: [...(whiteList.img || []), "usemap", "style"],
		map: ["name"],
		area: [...(whiteList.a || []), "coords"],
		a: [...(whiteList.a || []), "rel"],
		td: [...(whiteList.td || []), "style"],
		th: [...(whiteList.th || []), "style"],
		picture: [],
		source: ["media", "sizes", "src", "srcset", "type"],
	},
	css: {
		whiteList: {
			"image-rendering": /^pixelated$/,
			"text-align": /^center|left|right$/,
			float: /^left|right$/,
		},
	},
	onIgnoreTagAttr: (tag, name, value) => {
		// Allow iframes from acceptable sources
		if (tag === "iframe" && name === "src") {
			const allowedSources = [
				{
					regex:
						/^https?:\/\/(www\.)?youtube(-nocookie)?\.com\/embed\/[a-zA-Z0-9_-]{11}(\?&autoplay=[0-1]{1})?$/,
					remove: ["&autoplay=1"], // Prevents autoplay
				},
				{
					regex:
						/^https?:\/\/(www\.)?discord\.com\/widget\?id=\d{18,19}(&theme=\w+)?$/,
					remove: [/&theme=\w+/],
				},
			];

			for (const source of allowedSources) {
				if (source.regex.test(value)) {
					let val = value;
					for (const remove of source.remove) {
						val = val.replace(remove, "");
					}
					return `${name}="${escapeAttrValue(val)}"`;
				}
			}
		}

		// For Highlight.JS
		if (name === "class" && ["pre", "code", "span"].includes(tag)) {
			const allowedClasses = [];
			for (const className of value.split(/\s/g)) {
				if (
					className.startsWith("hljs-") ||
					className.startsWith("language-")
				) {
					allowedClasses.push(className);
				}
			}
			return `${name}="${escapeAttrValue(allowedClasses.join(" "))}"`;
		}
	},
	safeAttrValue(tag, name, value, cssFilter) {
		if (tag === "img" && name === "src" && !value.startsWith("data:")) {
			try {
				const url = new URL(value);

				if (url.hostname.includes("wsrv.nl")) {
					url.searchParams.delete("errorredirect");
				}

				const allowedHostnames = [
					"imgur.com",
					"i.imgur.com",
					"github.com",
					"raw.githubusercontent.com",
					"img.shields.io",
					"i.postimg.cc",
					"wsrv.nl",
					"cf.way2muchnoise.eu",
					"bstats.org",
				];

				if (!allowedHostnames.includes(url.hostname)) {
					return safeAttrValue(
						tag,
						name,
						`https://wsrv.nl/?url=${encodeURIComponent(url.toString().replaceAll("&amp;", "&"))}&n=-1`,
						cssFilter,
					);
				}
				return safeAttrValue(tag, name, url.toString(), cssFilter);
			} catch (err) {
				/* empty */
			}
		}

		return safeAttrValue(tag, name, value, cssFilter);
	},
});

export const md = (options = {}) => {
	const md = new MarkdownIt("default", {
		html: true,
		linkify: true,
		breaks: false,
		...options,
	});

	const defaultLinkOpenRenderer =
		md.renderer.rules.link_open ||
		((tokens, idx, options, _env, self) =>
			self.renderToken(tokens, idx, options));

	md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		const index = token.attrIndex("href");

		if (index !== -1) {
			const href = token.attrs?.[index][1];

			try {
				const url = new URL(href || "");
				const allowedHostnames: string[] = [];

				if (allowedHostnames.includes(url.hostname)) {
					return defaultLinkOpenRenderer(tokens, idx, options, env, self);
				}
			} catch (err) {
				/* empty */
			}
		}

		tokens[idx].attrSet("rel", "noopener nofollow ugc");

		return defaultLinkOpenRenderer(tokens, idx, options, env, self);
	};

	return md;
};

export const renderString = (string: string) =>
	configuredXss.process(md().render(string));

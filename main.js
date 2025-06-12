import { CodeJar } from "codejar";
import hljs from "highlight.js/lib/core";

// Import each language module you require
import json from "highlight.js/lib/languages/json"; // for JSON
import fsharp from "./hl_fsharp";

import { parse_json } from "./json_parser";
import { get_key, startup } from "./choose_lib";
import { to_record } from "./dom_record";
import { to_systext } from "./dom_systext";
import { to_thoth } from "./dom_thoth";
import { getRidofEmptyLines, swapHlCss } from "./helper";

document.addEventListener("DOMContentLoaded", () => {
	const json_editor = document.querySelector("#jsoneditor");
	const convert_me = document.querySelector("#convert-me");
	const copy_me = document.querySelector("#copy-me");
	const clear_me = document.querySelector("#clear-me");
	const fs_editor = document.querySelector("#fs-editor");

	hljs.registerLanguage("json", json); // for JSON
	hljs.registerLanguage("fsharp", fsharp);

	const highlight_json = (editor) => {
		editor.innerHTML = hljs.highlight(editor.textContent, {
			language: "json",
		}).value;
	};
	const highlight_fsharp = (editor) => {
		editor.innerHTML = hljs.highlight(editor.textContent, {
			language: "fsharp",
		}).value;
	};

	startup();
	swapHlCss();

	const options = {
		tab: "    ",
		history: false,
	};

	const defaultMsg = "// Enter valid JSON on the left \n// Click > to convert";

	const json_jar = CodeJar(json_editor, highlight_json, options);
	const fs_jar = CodeJar(fs_editor, highlight_fsharp, options);
	fs_jar.updateCode(defaultMsg);

	let watermarks = document.getElementsByClassName("watermark");
	json_jar.onUpdate((code) => {
		if (
			code.length > 1 &&
			watermarks[0].classList.contains("animate-fade-in")
		) {
			watermarks[0].classList.remove("animate-fade-in");
			watermarks[0].classList.add("animate-fade-out");
		}
	});
	convert_me.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		const code = json_jar.toString().trim();
		if (code === "") {
			return;
		}

		json_jar.updateCode(code);
		const jobjs = parse_json(code);

		const lib = get_key();

		watermarks[1].classList.remove("animate-fade-in");
		watermarks[1].classList.add("animate-fade-out");
		let fs_str = "";

		if (lib == "record") fs_str = to_record(jobjs);
		if (lib == "systext") fs_str = to_systext(jobjs);
		if (lib == "thoth") fs_str = to_thoth(jobjs);

		fs_jar.restore({ start: 0, end: 0 });
		fs_jar.updateCode(getRidofEmptyLines(fs_str));
	});

	clear_me.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		watermarks[0].classList.remove("animate-fade-out");
		watermarks[0].classList.add("animate-fade-in");
		watermarks[1].classList.remove("animate-fade-out");
		watermarks[1].classList.add("animate-fade-in");
		fs_jar.restore({ start: 0, end: 0 });
		json_jar.restore({ start: 0, end: 0 });
		fs_jar.updateCode(defaultMsg);
		json_jar.updateCode("");
	});

	copy_me.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		const copyText = fs_jar.toString();
		navigator.clipboard.writeText(copyText).then(() => {
			copy_me.innerHTML = `<i class="gg-smile"></i>`;
			setTimeout(function () {
				copy_me.innerHTML = `<i class="gg-copy"></i>`;
			}, 1000);
		});
	});
});

import { toPascalCase } from "js-convert-case";

export function getRidofEmptyLines(str) {
	return str
		.split("\n")
		.filter((line) => line.trim() !== "")
		.join("\n");
}

export function decodeType(typstr) {
	let basic_typ = "";
	let reg_basic = /^\d\d_(.+)$/;
	let __reg = typstr.match(reg_basic);
	if (Array.isArray(__reg)) {
		basic_typ = __reg[1];
	} else {
		basic_typ = typstr;
	}

	if (basic_typ == "integer") {
		return "int";
	}
	if (basic_typ == "string") {
		return "string";
	}
	if (basic_typ == "float") {
		return "float";
	}
	if (basic_typ == "boolean") {
		return "bool";
	}
	if (basic_typ == "obj") {
		return "obj";
	}
	let obj_reg = /^object\((.+)\)$/;
	let _reg = basic_typ.match(obj_reg);
	if (Array.isArray(_reg)) {
		return decodeType(_reg[1]);
	}

	let arr_reg = /^array\((.+)\)$/;
	let _arrreg = basic_typ.match(arr_reg);
	if (Array.isArray(_arrreg)) {
		let _t = decodeType(_arrreg[1]);
		return `${_t} array`;
	}
	return toPascalCase(basic_typ);
}

export function swapHlCss() {
	let theme_swap = document.getElementById("theme-swap");
	const jsoneditor = document.getElementById("jsoneditor");
	const fseditor = document.getElementById("fs-editor");

	let isLight = JSON.parse(
		localStorage.getItem("json2fsthemeIsLight") ?? "false",
	);
	theme_swap.checked = isLight;
	if (isLight) {
		jsoneditor.classList.remove("editor-dark");
		jsoneditor.classList.add("editor-light");
		fseditor.classList.remove("editor-dark");
		fseditor.classList.add("editor-light");
	} else {
		jsoneditor.classList.add("editor-dark");
		jsoneditor.classList.remove("editor-light");
		fseditor.classList.add("editor-dark");
		fseditor.classList.remove("editor-light");
	}

	theme_swap.addEventListener("click", (e) => {
		let isLight = theme_swap["checked"];
		if (isLight) {
			jsoneditor.classList.remove("editor-dark");
			jsoneditor.classList.add("editor-light");
			fseditor.classList.remove("editor-dark");
			fseditor.classList.add("editor-light");
		} else {
			jsoneditor.classList.add("editor-dark");
			jsoneditor.classList.remove("editor-light");
			fseditor.classList.add("editor-dark");
			fseditor.classList.remove("editor-light");
		}

		localStorage.setItem("json2fsthemeIsLight", JSON.stringify(isLight));
	});
}

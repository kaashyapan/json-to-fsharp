import { toPascalCase } from "js-convert-case";
import { decodeType } from "./helper";

let accum = [];
let indent = 0;

const writeElement = (h) => {
	accum.push(`[<CLIMutable>]\n`);
	accum.push(`type ${toPascalCase(h.id)} = {\n`);
	indent = indent + 4;

	let attrs = [];
	h.fields?.forEach((e) => {
		let fName = toPascalCase(e.name);
		let typ = decodeType(e.typ);
		attrs.push(`${fName}: ${typ}\n`);
	});

	if (attrs.length > 0) {
		accum.push(`\n`);
		accum.push(" ".repeat(indent));
	} else {
		accum.push(`\n`);
	}

	accum.push(attrs.join(" ".repeat(indent)));
	h.children?.forEach((e) => {
		accum.push(" ".repeat(indent));
		writeElement(e);
	});
	indent = indent - 4;
	if (indent > 0) accum.push(" ".repeat(indent)); //TODO if exp not necessary. Just in case...
	accum.push(`}\n`);
};

export function to_thoth(h) {
	accum = [];
	indent = 0;
	h.forEach((e) => writeElement(e));
	return accum.join("");
}

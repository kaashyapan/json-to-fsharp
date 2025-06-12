import JSON5 from "json5";

let objs = [];

const normalize_fields = (fields) => {
	let _fields = {};

	//make big array of all fields in all obj instances
	for (const e of fields) {
		const fId = e["key"];
		if (_fields.hasOwnProperty(fId)) {
			let _f = _fields[fId];
			_fields[fId] = _f.concat([e["typ"]]);
		} else {
			_fields[fId] = [e["typ"]];
		}
	}

	for (const [key, value] of Object.entries(_fields)) {
		let typs = value.sort();
		_fields[key] = typs[0];
	}
	let ordered = [];
	for (const e of fields) {
		const fId = e["key"];
		if (_fields.hasOwnProperty(fId)) {
			ordered.push({ name: fId, typ: _fields[fId] });
			delete _fields[fId];
		}
	}
	return ordered;
};

const normalize = () => {
	let _objs = {};

	//make big array of all fields in all obj instances
	for (const e of objs) {
		const objectId = e["id"];
		if (_objs.hasOwnProperty(objectId)) {
			let _f = _objs[objectId].concat(e["fields"]);
			_objs[objectId] = _f;
		} else {
			_objs[objectId] = e["fields"];
		}
	}

	//preserve object definition order and accumulate fields such that there is single instance of an object definition
	let orderedObjs = [];
	for (const e of objs) {
		const objectId = e["id"];
		if (_objs.hasOwnProperty(objectId)) {
			const _fields = normalize_fields(_objs[objectId]);
			orderedObjs.push({ id: objectId, fields: _fields });
			delete _objs[objectId];
		}
	}

	objs.length = 0;
	objs = orderedObjs;
};

const parse_value = (e_name, e) => {
	let _typ = typeof e;
	if (_typ === "number") {
		if (JSON.stringify(e).includes(".") == true) {
			return "03_float";
		} else {
			return "04_integer";
		}
	}

	if (_typ === "boolean") {
		return "05_boolean";
	}
	if (_typ === "string") {
		return "06_string";
	}
	if (_typ === "object") {
		if (Array.isArray(e)) {
			if (e.length == 0) {
				return "99_array(obj)";
			} else {
				let _t = parse_value(e_name, e[0]);
				if (_t === "object") {
					return `01_array(${e_name})`;
				} else {
					return `01_array(${_t})`;
				}
			}
		} else {
			parse_obj(e_name, e);
			return `02_object(${e_name})`;
		}
	}
	return _typ;
};

const parse_obj = (obName, ob) => {
	let kvs = [];
	for (const [key, value] of Object.entries(ob)) {
		if (value !== null && value !== undefined) {
			kvs.push({ key: key, typ: parse_value(key, value) });
		} else {
			kvs.push({ key: key, typ: "98_obj" });
		}
	}
	let _ob = {
		id: obName,
		fields: kvs,
	};

	objs.push(_ob);
};

export function parse_json(json_str) {
	let elements = JSON5.parse(json_str.trim());
	objs = [];
	if (Array.isArray(elements)) {
		for (const e of elements) {
			parse_obj("RootElement", e);
		}
	} else {
		parse_obj("RootElement", elements);
	}
	// console.log(objs);
	normalize();
	return objs;
}

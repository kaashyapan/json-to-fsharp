const systext = document.querySelector("#systext");
const thoth = document.querySelector("#thoth");
const record = document.querySelector("#record");

export function get_key() {
	let defaultlib = localStorage.getItem("json2fslib") ?? "record";
	return defaultlib;
}

export function persist_key(lib) {
	localStorage.setItem("json2fslib", lib);
	return;
}

export function changeLib(lib) {
	if (lib == "record") {
		record.classList.add("btn-primary");
		systext.classList.remove("btn-primary");
		thoth.classList.remove("btn-primary");
	}
	if (lib == "systext") {
		systext.classList.add("btn-primary");
		thoth.classList.remove("btn-primary");
		record.classList.remove("btn-primary");
	}
	if (lib == "thoth") {
		systext.classList.remove("btn-primary");
		thoth.classList.add("btn-primary");
		record.classList.remove("btn-primary");
	}

	persist_key(lib);
	return;
}

export function startup() {
	changeLib(get_key());

	record.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		changeLib("record");
	});

	systext.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		changeLib("systext");
	});

	thoth.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		changeLib("thoth");
	});
}

import {
	lastIndexOf,
	split,
	pipe,
	slice,
	reject,
	equals,
	join,
	filter,
	length,
	last,
	ifElse,
	identity,
	indexOf,
	includes,
	curry,
	head,
	tail,
	addIndex,
	map,
	isEmpty,
	either,
	isNil,
} from "ramda";
const util = require("util");
import { get } from "shades";

export const mapIndexed = addIndex(map);

export const truncate = curry((length, str) => {
	return str.length > length ? `${str.substr(0, length)}...` : str;
});

export const capitalize = (string) => {
	return string[0].toUpperCase() + string.slice(1);
};

export const trim = (array) => {
	return pipe(reject(equals("")), reject(isNil))(array);
};

export const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

export const just = curry((filter_array, array) =>
	pipe(filter((value) => includes(value, filter_array)))(array)
);

export const inspect = curry((obj, label = "") => {
	console.log(label);
	console.log(util.inspect(obj, false, null, true));
	return obj;
});

export const remove_first_n = curry((n, array) =>
	pipe(slice(n, Infinity))(array)
);
export const remove_last_n = curry((n, array) => pipe(slice(0, -n))(array));

export const remove_trailing_slash = pipe(
	ifElse(pipe(last, equals("/")), pipe(slice(0, -1)), identity)
);

const get_pathname = (uri) => {
	if (uri.includes("http")) {
		let { pathname } = new URL(uri);
		return pathname;
	} else {
		return uri;
	}
};

export const to_resource_pathname = (uri) => {
	let pathname = get_pathname(uri);
	let resource_url = pipe(split("resource"), tail)(pathname);

	if (isEmpty(resource_url)) {
		return "";
	} else {
		return pipe(
			join("/"),
			remove_trailing_slash,
			(path) => `/resource` + path
		)(resource_url);
	}
};

export const to_route_pathname = (uri) => {
	let pathname = get_pathname(uri);
	return pipe(split("resource"), head, remove_trailing_slash)(pathname);
};

export const get_route_endpoint = (uri) => {
	return pipe(to_route_pathname, split("/"), last)(uri);
};

export const to_group_pathname = (uri) => {
	let pathname = get_pathname(uri);
	return pipe(
		split("resource"),
		last,
		split("/f/"),
		head,
		remove_trailing_slash,
		(path) => `/resource` + path
	)(pathname);
};

export const to_path_array = pipe(split("/"), reject(equals("")));

export const to_resource_path_array = (uri) => {
	return pipe(
		remove_trailing_slash,
		to_resource_pathname,
		to_path_array
	)(uri);
};

export const get_resource_type = (uri) => {
	return pipe(
		to_resource_path_array,
		ifElse(
			pipe(remove_last_n(1), is_object_id),
			pipe(remove_last_n(2), last),
			pipe(remove_last_n(1), last)
		)
	)(uri);
};

export const get_resource_id = (uri) => {
	return pipe(to_resource_path_array, (path) =>
		pipe(indexOf("f"), (index) => path[index + 1])(path)
	)(uri);
};

export const get_entity_id = (uri) => {
	return pipe(to_resource_path_array, (path) =>
		pipe(indexOf("e"), (index) => path[index + 1])(path)
	)(uri);
};

// export const is_object_id = (id) => {
// 	if (!id) return false;
// 	if (id.match(/^[0-9a-fA-F]{24}$/)) {
// 		return true;
// 	} else {
// 		return false;
// 	}
// };

export const is_root_path_p = (uri) => {
	let res = pipe(
		to_resource_path_array,
		just(["e", "g", "d", "f"]),
		length,
		equals(1)
	)(uri);

	return res;
};

export const is_group_p = (uri) => {
	return pipe(
		to_resource_path_array,
		filter(equals("d")),
		length,
		equals(1)
	)(uri);
};

// export const is_directory_p = (uri) => {
// 	return pipe(
// 		to_pathname,
// 		to_resource_path_array,
// 		get_resource_type,
// 		equals("d")
// 	)(uri);
// };

export const is_resource_p = (uri) => {
	return pipe(to_resource_path_array, includes("f"))(uri);
};

export const get_group_id = (uri) => {
	return pipe(to_resource_path_array, (array) =>
		pipe(indexOf("g"), (index) => array[index + 1])(array)
	)(uri);
};

export const get_file_id = (uri) => {
	return pipe(to_resource_path_array, (array) =>
		pipe(lastIndexOf("f"), (index) => array[index + 1])(array)
	)(uri);
};

export const has_valid_route_p = (route, uri) => {
	let route_path = to_route_pathname(uri);
	// console.log(route_path);
	// console.log(includes(route, route_path));
	return includes(route, route_path) ? true : false;
};

export const has_resource_url_p = (uri) => {
	let has_resource = to_resource_pathname(uri);
	return pipe(equals(""))(has_resource) ? false : true;
};

// export const get_directory_resource_id = (uri) => {
// 	return pipe(to_pathname, to_resource_path_array, (path) =>
// 		pipe(lastIndexOf("d"), (index) => path[index + 1])(path)
// 	)(uri);
// };

// export const get_redirect_url = (uri) => {
// 	return pipe(to_pathname, to_resource_path_array, (path) =>
// 		pipe(
// 			indexOf("resource"),
// 			(index) => pipe(slice(index, Infinity))(path),
// 			join("/"),
// 			(value) => `/${value}`
// 		)(path)
// 	)(uri);
// };

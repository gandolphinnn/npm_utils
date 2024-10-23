/**
 * Checks if a value is null, undefined or NaN.
 * Useful if the value can be 0 or false, because it will still return true
 * @param value - The value to be checked.
 * @returns True if the value is null, undefined or NaN, otherwise false.
 */
export function isNull(value: any) {
	return value === null || value === undefined || Number.isNaN(value);
}

/**
 * Checks if multiple values are null or NaN.
 * @param values - The list of values.
 * @returns True is ALL the values are null or NaN, otherwise false.
 */
export function areNull(...values: any[]) {
	for (let i = 0; i < values.length; i++) {
		if (!isNull(values[i]))
			return false;
	}
	return true;
}

/**
 * Returns the first non-null value from a list of values, or null if all values are null.
 */
export function coalesce(...values: any[]) {
	for (let i = 0; i < values.length; i++) {
		if (!isNull(values[i]))
			return values[i];
	}
	return null;
}

/**
 * Returns the prototype of the parent object.
 * @example To get the parent name, append ".name"
 */
export function parentClass(obj: Object) {
	return Object.getPrototypeOf(obj.constructor);
}
/**
 * Returns the name of the class's prototype
 * @obj A class, NOT A PROTOTYPE
 */
export function className(obj: Object) {
	return obj.constructor.name
}

/**
 * Generates a plural or singular string based on the provided amount.
 * @param val - The amount.
 * @param pluralString - The plural string. Defaults to 's'.
 * @param singularString - The singular string. Defaults to an empty string.
 * @returns The plural or singular string based on the amount.
 */
export function plural(val: number, pluralString: string = 's', singularString: string = '') {
	return val == 1? singularString : pluralString;
}

/**
 * Compare a generated value with an expected value and log the result to the console;
 * @param testName - The test name to display in the console.
 */
export function test(testName: string, value: any, expected: any) {
	const valStr = JSON.stringify(value);
	const excpStr = JSON.stringify(expected)
	if (valStr == excpStr) {
		styleLog('color: #0c0', 'Test ', testName, ' passed: ', valStr);
	}
	else {
		styleLog('color: #f00', 'Test ', testName, ' failed: VALUE=', valStr, '; EXCPECTED=', excpStr);
	}
}

/**
 * Apply some css styles to the console log
 * @example 'color: black; background-color: white', 'testo ', 1
 */
export function styleLog(style: string, ...text: any[]) {
	console.log('%c'+ text.join(''), style);
}
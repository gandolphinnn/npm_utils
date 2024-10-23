/**
 * Edits a specific property of objects in an array using a callback function.
 * @param arr - The array of objects.
 * @param key - The property key to be edited.
 * @param callback - The callback function to modify the property value.
 * @returns The array of objects with the modified property values.
 */
export function arrEdit<T, K extends keyof T, R>(arr: T[], key: K, callback: (val: T[K]) => R): T[] {
	return arr.map((obj) => {
		const value = obj[key];
		const modifiedValue = callback(value);
		return { ...obj, [key]: modifiedValue } as T;
	});
}

/**
 * Pivots an array of objects into an object of arrays.
 * @param arr - The array of objects.
 * @returns An object where each property is an array of values for the corresponding property key.
 */
export function arrPivot<T>(arr: T[]): { [K in keyof T]: Array<T[K]> } {
	const result: Partial<{ [K in keyof T]: Array<T[K]> }> = {};
	arr.forEach((obj) => {
		Object.keys(obj).forEach((key) => {
			const typedKey = key as keyof T;
			if (!result[typedKey]) {
				result[typedKey] = [];
			}
			result[typedKey]?.push(obj[typedKey]);
		});
	});
	return result as { [K in keyof T]: Array<T[K]> };
}

/**
 * Pivots an object of arrays into an array of objects.
 * @param obj - The object of arrays.
 * @returns An array of objects where each object has property values from the corresponding array.
 */
export function objPivot<T>(obj: Record<keyof T, Array<T[keyof T]>>): T[] {
	const keys = Object.keys(obj) as Array<keyof T>;
	const result: T[] = [];
	for (let i = 0; i < Math.max(...keys.map((key) => obj[key].length)); i++) {
		const newObj: Partial<T> = {};
		keys.forEach((key) => {
			newObj[key] = obj[key]?.[i];
		});
		result.push(newObj as T);
	}
	return result;
}
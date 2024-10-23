import { isNull } from '..';

/**
 * Generates a random integer between the specified minimum and maximum values.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns A random integer between min and max (inclusive).
 */
export function rand(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random integer between 0 and the specified maximum value.
 * @param max - The maximum value.
 * @returns A random integer between 0 and max (inclusive).
 */
export function rand0(max: number) {
	return Math.floor(Math.random() * (Math.floor(max) + 1));
}

/**
 * Clamps a value within the specified minimum and maximum range.
 * @param val - The value to be clamped. null values will return nulls.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns The clamped value within the range [min, max] (inclusive).
 */
export function clamp(val: number, min: number, max: number) {
	if (min > max) throw new Error('MIN can\'t be greater than MAX');
	if (isNull(val)) return val;

	return Math.max(Math.min(val, max), min);
}

/**
 * Applies overflow to a value within a specified range.
 * @param val - The value to be overflowed. null values will return nulls.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns The overflowed value within the range [min, max] (inclusive). Loops under and over the range.
 */
export function overflow(val: number, min: number, max: number) {
	if (min > max) throw new Error('MIN can\'t be greater than MAX');
	if (isNull(val)) return val;

	const range = max - min + 1;
	return (val % range + range) % range + min;
}

/**
 * Convert to hexadecimal
 */
export function decToHex(dec: number) {
	return dec.toString(16);
}

/**
 * Convert to decimal
 */
export function hexToDec(hex: string) {
	return parseInt(hex, 16);
}
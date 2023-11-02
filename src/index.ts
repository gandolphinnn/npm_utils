export interface KeyValuePair<K, V> {
    key: K,
	value: V;
}
export class Monad {
	value: any;
	history:Array<KeyValuePair<Function, any>>

	constructor(value: any, history:Array<KeyValuePair<Function, any>>= []) {
		this.value = value;
		this.history = history;
	}

	apply(func: Function) {
		if (this.value == null)
			return this;

		let value = func(this.value);
		let kvp: KeyValuePair<Function, any> = {key: func, value: value}
		return new Monad(value, [...this.history, kvp]);
	}
}
export function Rand(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function Rand0(max:number) {
	return Math.floor(Math.random() * (Math.floor(max) - 1));
}
export function ArrLast(arr: Array<any>) {
	return arr[arr.length-1];
}
export function ParentClass(obj: Object) {
	return Object.getPrototypeOf(obj.constructor);
}
export function Plural(val: number, pluralString: string = 's', singularString: string = '') {
	if (val == 1) {
		return singularString;
	}
	return pluralString;
}
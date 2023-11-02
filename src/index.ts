export interface KeyValuePair<K, V> {
    key: K,
	value: V;
}
type BoolFunction = (val) => boolean
export class Monad {
	value: any;
	history:Array<KeyValuePair<Function, any>>;
	condition: BoolFunction;
	keepDefaultConditions: boolean;

	constructor(value: any, history:Array<KeyValuePair<Function, any>> = [{key: () => {'INIT'}, value: value}]) {
		this.value = value;
		this.history = history;
		this.SetConditions();
	}

	Apply(func: Function) {
		let newVal: any;
		let kvp: KeyValuePair<Function, any>;
		try {
			newVal = func(this.value);
			if (this.condition(newVal)) {
				throw new Error('Monad custom condition failed');
			}
			if (this.keepDefaultConditions && (isNaN(newVal) || newVal === null)) {
				throw new Error('Monad default condition failed');
			}
			kvp = {key: func, value: newVal};
		} catch (error) {
			kvp = {key: func, value: error};
			newVal = this.value;
		}
		return new Monad(newVal, [...this.history, kvp]).SetConditions(this.keepDefaultConditions, this.condition);
	}

	SetConditions(keepDefaultConditions: boolean = true, func: BoolFunction = (v: any) => {return false}) {
		this.keepDefaultConditions = keepDefaultConditions;
		this.condition = func;
		return this
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
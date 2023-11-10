type BoolFunction = (val: any) => boolean
type HistoryLog = {
	value: any,
	apply: Function
}
export class Monad {
	value: any;
	history:Array<HistoryLog>;
	condition: BoolFunction;
	default: any;

	constructor(value: any, history:Array<HistoryLog> = [{value: value, apply: () => value}]) {
		this.value = value;
		this.history = history;
		this.setConditions();
		this.setDefault();
	}
	apply(func: Function) {
		let newVal: any;
		let log: HistoryLog;
		try {
			newVal = func(this.value);
			if (this.condition(newVal)) {
				throw new Error('Monad custom condition failed, set value to default: ' + this.default);
			}
			if (isNaN(newVal) || newVal === null) {
				throw new Error('Monad default condition failed, set value to default: ' + this.default);
			}
			log = {value: newVal, apply: func};
		} catch (error) {
			log = {value: error, apply: func};
			newVal = this.default === null? this.value : this.default;
		}
		return new Monad(newVal, [...this.history, log]).setConditions(this.condition).setDefault(this.default);
	}
	setConditions(func: BoolFunction = (v: any) => {return false}) {
		this.condition = func;
		return this;
	}
	setDefault(defValue: any = null) {
		this.default = defValue;
		return this;
	}
}
export function Rand(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function Rand0(max:number) {
	return Math.floor(Math.random() * (Math.floor(max) + 1));
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
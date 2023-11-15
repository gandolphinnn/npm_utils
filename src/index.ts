//#region Monad
type BoolFunction = (val: any) => boolean
export class Step {
	input: any;
	func: Function;
	condition: BoolFunction;
	defaultValue: any;
	output: any;
	failed: boolean;
	
	constructor(func: Function, condition: BoolFunction = (v: any) => {return false}, defaultValue: any = null) {
		this.func = func;
		this.condition = condition;
		this.defaultValue = defaultValue;
	}
	run(input: any) {
		this.input = input;
		this.defaultValue = coalesce(this.defaultValue, this.input)
		try {
			this.output = this.func(this.input);
			this.failed = this.condition(this.output) || isnull(this.output);
		} catch (error) {
			this.output = error
			this.failed = true;
		}
		return this;
	}
	get value() {		
		return this.failed ? this.defaultValue : this.output;
	}
}
export class Monad {
	value: any;
	history: Array<Step> = [];
	condition: BoolFunction;
	defaultValue: any;
	lockOnFail: boolean;
	locked: boolean;

	constructor(value: any) {
		this.value = value;
		this.setCondition();
		this.setDefault();
		this.setLockOnFail();
		this.apply((v: any) => v);
	}
	getStep(index: number) {
		const historyLength = this.history.length -1
		if (index > historyLength)
			throw new Error('Index out of range');
		
		return this.history[overflow(index, 0, historyLength)];
	}
	run(step: Step) { //? monad.Run(new Step((v: number) => v+2))
		if (!this.locked) {
			step.run(this.value);
			this.value = step.value;
			this.locked = this.lockOnFail && step.failed; 
			this.history.push(step);
		}
		return this;
	}
	reRun(stepIndex: number = -1) {
		return this.run(this.getStep(stepIndex));
	}
	apply(func: Function) {
		return this.run(new Step(func, this.condition, this.defaultValue));
	}
	reApply(stepIndex: number = -1) {
		return this.apply(this.getStep(stepIndex).func);
	}
	setCondition(func: BoolFunction = (v: any) => {return false}) {
		this.condition = func;
		return this;
	}
	setDefault(defValue: any = null) {
		this.defaultValue = defValue;
		return this;
	}
	setLockOnFail(lockOnFail: boolean = false) {
		this.lockOnFail = lockOnFail;
		this.locked = this.locked && this.lockOnFail; //? Unlock i f LOE is false
		return this;
	}
	log(collapsed = false) {
		if (collapsed)
			console.groupCollapsed('Monad history:')
		else
			console.group('Monad history:')
		console.table(arrEdit(
			arrEdit(
				this.history, 'func', (func: Function) => func.toString()
			), 'condition', (condition: Function) => condition.toString()
		), ['input', 'func', 'condition', 'output', 'defaultValue', 'failed']);
		console.log('Monad value: ', this.value);
		console.groupEnd()
		return this;
	}
}
//#endregion

//#region Arrays and Objects
export function arrLast<T>(arr: Array<T>): T {
	return arr[arr.length-1];
}
export function arrEdit<T, K extends keyof T, R>(arr: T[], key: K, callback: (val: T[K]) => R): T[] {
	return arr.map((obj) => {
		const value = obj[key];
		const modifiedValue = callback(value);
		return { ...obj, [key]: modifiedValue } as T;
	});
}
export function arrPivot<T>(arr: T[]): {[K in keyof T]: Array<T[K]>} {
	const result: Partial<{[K in keyof T]: Array<T[K]>}> = {};
	arr.forEach((obj) => {
		Object.keys(obj).forEach((key) => {
			const typedKey = key as keyof T;
			if (!result[typedKey]) {
				result[typedKey] = [];
			}
			result[typedKey]?.push(obj[typedKey]);
		});
	});
	return result as {[K in keyof T]: Array<T[K]>};
}
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
//#endregion

//#region Math
export function rand(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function rand0(max:number) {
	return Math.floor(Math.random() * (Math.floor(max) + 1));
}
export function clamp(val: number, min: number, max: number) {
	return Math.max(Math.min(val, max), min);
}
export function overflow(val: number, min: number, max: number) {
	if (min > max)
		throw new Error('MIN can\'t be greater than MAX')

	const range = max - min + 1;
	return (val % range + range) % range + min;
}
//#endregion

//#region Other
export function isnull(val: any) {
	return val === null || Number.isNaN(val);
}
export function coalesce(...data: any[]) {
	for (let i = 0; i < data.length; i++) {
		if (!isnull(data[i]))
			return data[i]
	}
}
export function parentObj(obj: Object) {
	return Object.getPrototypeOf(obj.constructor);
}
export function plural(val: number, pluralString: string = 's', singularString: string = '') {
	if (val == 1) {
		return singularString;
	}
	return pluralString;
}
//#endregion
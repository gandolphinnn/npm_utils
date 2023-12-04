//#region Monad
/**
 * Represents a step in the Monad execution.
 */
export class Step {
	input: any;
	func: Function;
	condition: (val: any) => boolean;
	defaultValue: any;
	output: any;
	failed: boolean;

	constructor(func: Function, condition: (val: any) => boolean = (v: any) => { return false; }, defaultValue: any = null) {
		this.func = func;
		this.condition = condition;
		this.defaultValue = defaultValue;
	}

	/**
	 * Runs the step with the provided input.
	 * @param input - The input value for the step.
	 * @returns The current Step instance.
	 */
	run(input: any) {
		this.input = input;
		this.defaultValue = coalesce(this.defaultValue, this.input);
		try {
			this.output = this.func(this.input);
			this.failed = this.condition(this.output) || isNull(this.output);
		} catch (error) {
			this.output = error;
			this.failed = true;
		}
		return this;
	}

	/**
	 * Gets the value after running the step, considering the default value if the step failed.
	 */
	get value() {
		return this.failed ? this.defaultValue : this.output;
	}
}

/**
 * A sequence of steps with conditions, defualt values, locks. Keeps track of every step in the history-
 */
export class Monad {
	value: any;
	history: Array<Step> = [];
	condition: (val: any) => boolean;
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

	/**
	 * Gets a specific step from the history.
	 * @param index - The index of the step in the history. By default, the last step.
	 * @returns The Step instance at the specified index.
	 */
	getStep(index: number = -1) {
		const historyLength = this.history.length - 1;
		if (index > historyLength)
			throw new Error('Index out of range');

		return this.history[overflow(index, 0, historyLength)];
	}

	/**
	 * Runs a specific step
	 * @param step - The Step instance to be executed.
	 * @returns This
	 */
	run(step: Step) {
		if (!this.locked) {
			step.run(this.value);
			this.value = step.value;
			this.locked = this.lockOnFail && step.failed;
			this.history.push(step);
		}
		return this;
	}

	/**
	 * Re-runs a specific step in the history.
	 * @param stepIndex - The index of the step to be re-run. By default, the last step.
	 * @returns This
	 */
	reRun(stepIndex: number = -1) {
		return this.run(this.getStep(stepIndex));
	}

	/**
	 * Applies a function to a new step in the Monad. Uses the Monad's condition and default value.
	 * @param func - The function to be applied to the step.
	 * @returns This
	 */
	apply(func: Function) {
		return this.run(new Step(func, this.condition, this.defaultValue));
	}

	/**
	 * Re-applies a function to a specific step in the history. Overwrite the step's condition and default value.
	 * @param stepIndex - The index of the step to be re-applied. By default, the last step.
	 * @returns This
	 */
	reApply(stepIndex: number = -1) {
		return this.apply(this.getStep(stepIndex).func);
	}

	/**
	 * Sets the condition function for determining followind steps failure.
	 * @param func - The condition function.
	 * @returns This
	 */
	setCondition(func: (val: any) => boolean = (v: any) => { return false }) {
		this.condition = func;
		return this;
	}

	/**
	 * Sets the default value to be used for following steps failure.
	 * @param defValue - The default value.
	 * @returns This
	 */
	setDefault(defValue: any = null) {
		this.defaultValue = defValue;
		return this;
	}

	/**
	 * Sets the flag to lock the Monad on step failure.
	 * @param lockOnFail - The flag to lock on failure.
	 * @returns This
	 */
	setLockOnFail(lockOnFail: boolean = false) {
		this.lockOnFail = lockOnFail;
		this.locked = this.locked && this.lockOnFail; // Unlock if LOE is false
		return this;
	}

	/**
	 * Logs the Monad history to the console.
	 * @param collapsed - Whether to collapse the console group.
	 * @returns This
	 */
	log(collapsed = false) {
		if (collapsed)
			console.groupCollapsed('Monad history:');
		else
			console.group('Monad history:');

		console.table(arrEdit(
			arrEdit(
				this.history, 'func', (func: Function) => func.toString()
			), 'condition', (condition: Function) => condition.toString()
		), ['input', 'func', 'condition', 'output', 'defaultValue', 'failed']);
		console.log('Monad value: ', this.value);
		console.groupEnd();
		return this;
	}
}
//#endregion

//#region Singleton
/**
 * Inherit this class to make the ChildClass a singleton.
 * @todo Must create a "static get instance() { return this.singletonInstance as ChildClass }"
 * @todo The ChildClass constructor must be private
 */
export class Singleton {
	private static _instance: Singleton;
	/**
	 * @todo Must create a "static get instance() { return this.singletonInstance as ChildClass }"
	 */
	protected static get singletonInstance(): Singleton {			
		if (isNull(this._instance))
			this._instance = new this();
		return this._instance;
	}
	/**
	 * @todo The ChildClass constructor must be private
	 */
	protected constructor() {}
}
//#endregion

//#region LinkedList
export class Node<T> {
	prev: Node<T> = null;
	next: Node<T> = null;
	constructor(public data: T) {}
}
export class StaticList<T> {
	private _head: Node<T> = null;
	get head() { return this._head }
	
	private _array: Node<T>[];
	get array() {return isNull(this._array) ? this.setArray() : this._array }
	set array(arr: Node<T>[]) {
		this._array = arr;
		this._head = arr[0];
	}

	get reversedArray() {
		const toRet = this.array;
		toRet.reverse();
		return toRet;
	}
	get arrayData() { return arrPivot(this.array).data	}
	
	get length(): number { return this.array.length }
	
	get tail() { return arrLast(this.array) }

	constructor(...items: T[]) {
		items.forEach(item => {
			const node = new Node(item)
		});
	}
	private pairNodes(prev: Node<T> | null, next: Node<T> | null) {
		if (prev) prev.next = next ;
		if (next) next.prev = prev;
	}
	private setArray() {
		const addToArray = (node: Node<T>) => {
			this._array.push(node);
			if (node.next) addToArray(node.next);
		};

		this._array = [];
		if (this._head) addToArray(this._head);
		
		return this._array;	
	}
	//#region Push
	pushFirst(data: T) { return this.pushAt(0, data) }
	pushAt(index: number, data: T) {
		if (index < 0 || index > this.length) throw new Error('Index out of range');
		
		const node = new Node(data);

		if (index == 0) this._head = node;

		const prevNode = this.array[index-1];
		const nextNode = this.array[index];
		this.pairNodes(prevNode, node);
		this.pairNodes(node, nextNode);
		this.setArray();
		return this.length;
	}
	pushLast(data: T) {	this.pushAt(this.length, data) }
	//#endregion

	//#region Pop
		popFirst() { return this.popAt(0) }
		popAt(index: number) {
			if (index < 0 || index >= this.length) throw new Error('Index out of range');

			if (index == 0) this._head = this.array[1];

			const node = this.array[index];
			this.pairNodes(node.prev, node.next);
			this.setArray();
			return node;
		}
		popLast() { return this.popAt(this.length-1) }
	//#endregion

	//#region Get
	getFirst(){ return this.getAt(0) }
	getAt(index: number){ return this.array[index].data }
	getLast(){ return this.getAt(this.length-1) }
	//#endregion

	//#region Set
	setFirst(data: T){ this.setAt(0, data) }
	setAt(index: number, data: T){ this.array[index].data = data }
	setLast(data: T){ this.setAt(this.length-1, data) }
	//#endregion

	//#region Methods
	swap(index1: number, index2: number) {
		const data1 = this.getAt(index1);
		const data2 = this.getAt(index2);
		this.setAt(index1, data2);
		this.setAt(index2, data1);
	}
	find(condition: (data: T) => boolean): Node<T>[] {
		let toRet: Node<T>[] = [];
		this.array.forEach(node => {
			if (condition(node.data)) toRet.push(node);
		});
		return toRet;
	}
	sort(condition: (data: T) => {}) {
		//todo all this
		const checkNext = (node: Node<T>) => {
			condition(node.data)
		};
		return this._head ? checkNext(this._head) : null;
	}
	//#endregion
}
//#endregion

//#region Arrays and Objects
/**
 * Gets the last element of an array.
 * @param arr - The array.
 * @returns The last element of the array.
 */
export function arrLast<T>(arr: Array<T>): T {
	return arr[arr.length - 1];
}

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

/**
 * Create a new instance of a class with provided params
 * @param classPrototype - The class
 * @param keyValuePairs - An array of keys and values used to assign the class params.
 * @returns A new instance of the class
 */
export function newWith<T>(classPrototype: {new(...params: any[]): T}, keyValuePairs: Array<[keyof T, any]>): T {
	const instance = new classPrototype();
	for (const [key, value] of keyValuePairs) {
		instance[key] = value;
	}
	return instance;
}
//#endregion

//#region Math
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
 * @param val - The value to be clamped.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns The clamped value within the range [min, max] (inclusive).
 */
export function clamp(val: number, min: number, max: number) {
	return Math.max(Math.min(val, max), min);
}

/**
 * Applies overflow to a value within a specified range.
 * @param val - The value to be overflowed.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns The overflowed value within the range [min, max] (inclusive). Loops under and over the range.
 */
export function overflow(val: number, min: number, max: number) {
	if (min > max)
		throw new Error('MIN can\'t be greater than MAX');

	const range = max - min + 1;
	return (val % range + range) % range + min;
}
//#endregion

//#region Other
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
 * Returns the first non-null and non-NaN value from a list of values.
 * @param values - The list of values.
 * @returns The first non-null and non-NaN value, or null if all values are null or NaN.
 */
export function coalesce(...values: any[]) {
	for (let i = 0; i < values.length; i++) {
		if (!isNull(values[i]))
			return values[i];
	}
	return null;
}

/**
 * Gets the prototype of the parent object.
 * @param obj - The object.
 * @returns The prototype of the parent object.
 */
export function parentObj(obj: Object) {
	return Object.getPrototypeOf(obj.constructor);
}

/**
 * Generates a plural or singular string based on the provided count.
 * @param val - The count.
 * @param pluralString - The plural string. Defaults to 's'.
 * @param singularString - The singular string. Defaults to an empty string.
 * @returns The plural or singular string based on the count.
 */
export function plural(val: number, pluralString: string = 's', singularString: string = '') {
	if (val == 1) {
		return singularString;
	}
	return pluralString;
}
//#endregion
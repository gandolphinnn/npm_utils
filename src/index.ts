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
	Run(input: any) {
		this.input = input;
		try {
			this.output = this.func(this.input);
			this.failed = this.condition(this.output) || (isNaN(this.output) || this.output === null);
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
	history: Array<Step> = []
	;
	condition: BoolFunction;
	defaultValue: any;
	lockOnError: boolean = false;
	locked: boolean = false;

	constructor(value: any) {
		this.value = value;
		this.SetCondition();
		this.SetDefault();
		this.Apply((v: any) => v);
	}
	Run(step: Step) { //? monad.Run(new Step((v: number) => v+2))
		if (!this.locked) {
			step.Run(this.value);
			this.value = step.value;
			this.locked = this.lockOnError && step.failed; 
			this.history.push(step);
		}
		return this;
	}
	Apply(func: Function) {
		return this.Run(new Step(func, this.condition, (this.defaultValue == null ? this.value : this.defaultValue)));
	}
	Repeat(stepIndex: number) {
		return this.Run(this.history[stepIndex]);
	}
	SetCondition(func: BoolFunction = (v: any) => {return false}) {
		this.condition = func;
		return this;
	}
	SetDefault(defValue: any = null) {
		this.defaultValue = defValue;
		return this;
	}
	LockOnError(lockOnError: boolean = false) {
		this.lockOnError = lockOnError;
		this.locked = this.locked && this.lockOnError; //? Unlock i f LOE is false
		return this;
	}
}
//#endregion

//#region Other
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
//#endregion
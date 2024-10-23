import { arrEdit, coalesce, isNull, overflow } from '..';

/**
 * Represents a step in the Monad execution.
 */
export class Step {
	input: any;
	output: any;
	failed: boolean;

	constructor(
		public func: Function,
		public condition: (val: any) => boolean = (v: any) => { return false; },
		public defaultValue: any = null
	) {
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
	history: Array<Step> = [];
	condition: (val: any) => boolean;
	defaultValue: any;
	lockOnFail: boolean;
	locked: boolean;

	constructor(public value: any) {
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
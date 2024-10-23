export {};

declare global {
	interface Array<T> {
		pushAt(index: number, ...value: T[]): number;
		popAt(index: number): T;
		last(value?: T): T;
	}
}
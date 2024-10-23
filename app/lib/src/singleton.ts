import { isNull } from '..';

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
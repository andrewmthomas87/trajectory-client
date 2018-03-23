
class Throttler {

	private _func: Function
	private _throttlePeriod: number
	private _timeout: any = null
	private _previousExecution: number = 0

	public constructor(func: Function, throttlePeriod: number) {
		this._func = func
		this._throttlePeriod = throttlePeriod
	}

	public invoke = () => {
		if (!this._timeout) {
			this._timeout = setTimeout(this._invoke, Math.max(this._throttlePeriod - (Date.now() - this._previousExecution), 0))
		}
	}

	private _invoke = () => {
		this._previousExecution = Date.now()
		this._timeout = null

		this._func.call(undefined)
	}

}

export default Throttler

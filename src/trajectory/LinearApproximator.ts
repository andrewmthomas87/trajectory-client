
class LinearApproximator {

	private _parameterValues: number[]
	private _values: number[]

	public constructor(parameterValues: number[], values: number[]) {
		this._parameterValues = parameterValues
		this._values = values
	}

	public findIndexForParameter(parameter: number, approximateIndex: number): number {
		let index = approximateIndex
		if (this._parameterValues[index] > parameter) {
			while (this._parameterValues[index] > parameter) {
				if (index === 0) {
					return -1
				}

				index--
			}
		}
		else {
			while (this._parameterValues[index] < parameter) {
				if (index === this._parameterValues.length - 1) {
					return index
				}

				index++
			}

			index--	// Point the index to the parameter value just smaller than the target parameter
		}

		return index
	}

	public findIndexForValue(value: number, approximateIndex: number): number {
		let index = approximateIndex
		if (this._values[index] > value) {
			while (this._values[index] > value) {
				if (index === 0) {
					return -1
				}

				index--
			}
		}
		else {
			while (this._values[index] < value) {
				if (index === this._values.length - 1) {
					return index
				}

				index++
			}

			index--	// Point the index to the value value just smaller than the target parameter
		}

		return index
	}

	public evaluateValue(parameter: number, index: number): number {
		if (index === -1) {
			return this._values[0]
		}
		else if (index === this._parameterValues.length - 1) {
			return this._values[this._parameterValues.length - 1]
		}

		const x: number = (parameter - this._parameterValues[index]) / (this._parameterValues[index + 1] - this._parameterValues[index])
		return x * (this._values[index + 1] - this._values[index]) + this._values[index]
	}

	public evaluateParameter(value: number, index: number): number {
		if (index === -1) {
			return this._parameterValues[0]
		}
		else if (index === this._values.length - 1) {
			return this._parameterValues[this._values.length - 1]
		}

		const x: number = (value - this._values[index]) / (this._values[index + 1] - this._values[index])
		return x * (this._parameterValues[index + 1] - this._parameterValues[index]) + this._parameterValues[index]
	}

}

export default LinearApproximator

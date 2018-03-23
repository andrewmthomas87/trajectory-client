import { observable, computed, action } from 'mobx'

import Spline, { IPoint } from 'trajectory/Spline'

enum Size {
	STRETCH,
	FILL,
	FIT
}

class State {

	@observable public $startHeading: number = 0
	@observable public $endHeading: number = 0
	@observable public $points: IPoint[] = []
	@observable public $selectedPoint: number = -1

	@observable public $size: Size = Size.STRETCH
	@observable private _$minLeft: number = 0
	@observable private _$maxRight: number = 0
	@observable private _$minBottom: number = 0
	@observable private _$maxTop: number = 0

	@computed public get $spline(): Spline {
		return Spline.quinticHermiteSplineFor(this.$startHeading, this.$endHeading, ...this.$points.slice())
	}

	@computed public get $left(): number {
		return this._$minLeft - 0.1 * (this._$maxRight - this._$minLeft)
	}

	@computed public get $right(): number {
		return this._$maxRight + 0.1 * (this._$maxRight - this._$minLeft)
	}

	@computed public get $bottom(): number {
		return this._$minBottom - 0.1 * (this._$maxTop - this._$minBottom)
	}

	@computed public get $top(): number {
		return this._$maxTop + 0.1 * (this._$maxTop - this._$minBottom)
	}

	@action
	public setHeadings(startHeading: number, endHeading: number) {
		this.$startHeading = startHeading
		this.$endHeading = endHeading
	}

	@action
	public changeSelectedPoint(x: number, y: number) {
		this.$points[this.$selectedPoint].x = x
		this.$points[this.$selectedPoint].y = y

		this._findBounds()
	}

	@action
	public removeSelectedPoint() {
		this.$points.splice(this.$selectedPoint, 1)

		if (!(this.$selectedPoint === 0 && this.$points.length)) {
			this.$selectedPoint--
		}

		this._findBounds()
	}

	@action
	public addPoint(x: number, y: number) {
		this.$points.push({ x, y })

		this._$minLeft = Math.min(this._$minLeft, x)
		this._$maxRight = Math.max(this._$maxRight, x)
		this._$minBottom = Math.min(this._$minBottom, y)
		this._$maxTop = Math.max(this._$maxTop, y)
	}

	@action
	public setSelectedPoint(index: number) {
		this.$selectedPoint = index
	}

	@action
	public setSize(size: Size) {
		this.$size = size
	}

	@action
	private _findBounds() {
		this._$minLeft = 0
		this._$maxRight = 0
		this._$minBottom = 0
		this._$maxTop = 0

		for (let point of this.$points) {
			this._$minLeft = Math.min(this._$minLeft, point.x)
			this._$maxRight = Math.max(this._$maxRight, point.x)
			this._$minBottom = Math.min(this._$minBottom, point.y)
			this._$maxTop = Math.max(this._$maxTop, point.y)
		}
	}

}

export { Size, State as default }

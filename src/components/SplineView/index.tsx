import { observer } from 'mobx-react'
import { observable, computed, action } from 'mobx'
import * as React from 'react'
import { findDOMNode } from 'react-dom'

import { Throttler } from 'utilities'

import Spline, { IPoint } from 'trajectory/Spline'

import State, { Size } from 'State'

import './component.less'

interface IProps {
	state: State
}

@observer
class SplineView extends React.Component<IProps, {}> {

	@observable private _$width: number = 0
	@observable private _$height: number = 0

	@computed private get _$fullWidth(): number {
		const $width: number = this._$width
		const $height: number = this._$height
		const { $size, $left, $right, $bottom, $top } = this.props.state

		switch ($size) {
			case Size.STRETCH:
				return $width
			case Size.FILL:
				return $width / $height > ($right - $left) / ($top - $bottom) ?
					$width :
					$height * ($right - $left) / ($top - $bottom)
			case Size.FIT:
				return $width / $height > ($right - $left) / ($top - $bottom) ?
					$height * ($right - $left) / ($top - $bottom) :
					$width
		}
	}

	@computed private get _$fullHeight(): number {
		const $width: number = this._$width
		const $height: number = this._$height
		const { $size, $left, $right, $bottom, $top } = this.props.state

		switch ($size) {
			case Size.STRETCH:
				return $height
			case Size.FILL:
				return $height / $width > ($top - $bottom) / ($right - $left) ?
					$height :
					$width * ($top - $bottom) / ($right - $left)
			case Size.FIT:
				return $height / $width > ($top - $bottom) / ($right - $left) ?
					$width * ($top - $bottom) / ($right - $left) :
					$height
		}
	}

	@computed private get _$offsetX(): number {
		return (this._$width - this._$fullWidth) / 2
	}

	@computed private get _$offsetY(): number {
		return (this._$height - this._$fullHeight) / 2
	}

	private _canvas: HTMLCanvasElement
	private _graphics: CanvasRenderingContext2D

	private _onResizeThrottler: Throttler

	public constructor(props: IProps) {
		super(props)

		this._onResizeThrottler = new Throttler(this._onResize, 200)
	}

	public componentDidMount() {
		this._canvas = findDOMNode(this.refs['canvas']) as HTMLCanvasElement
		this._graphics = this._canvas.getContext('2d') as CanvasRenderingContext2D

		window.addEventListener('resize', this._onResizeThrottler.invoke)
		this._onResize()
	}

	public componentWillUnmount() {
		window.removeEventListener('resize', this._onResizeThrottler.invoke)
	}

	public render(): JSX.Element {
		const { $spline, $selectedPoint, $left, $right, $bottom, $top } = this.props.state

		const $width: number = this._$width
		const $height: number = this._$height

		const $fullWidth: number = this._$fullWidth
		const $fullHeight: number = this._$fullHeight
		const $offsetX: number = this._$offsetX
		const $offsetY: number = this._$offsetY

		setTimeout(this._draw.bind(null, $spline, $selectedPoint, $left, $right, $bottom, $top, $fullWidth, $fullHeight, $offsetX, $offsetY), 0)

		return <canvas ref='canvas' width={$width} height={$height} />
	}

	@action
	private _onResize = () => {
		this._$width = this._canvas.offsetWidth
		this._$height = this._canvas.offsetHeight
	}

	private _draw = (spline: Spline, selectedPoint: number, left: number, right: number, bottom: number, top: number, width: number, height: number, offsetX: number, offsetY: number) => {
		this._graphics.clearRect(0, 0, this._canvas.width, this._canvas.height)

		this._graphics.strokeStyle = '#fff'
		this._graphics.fillStyle = '#fff'

		const points: IPoint[] = spline.getPoints()
		if (points.length > 1) {
			this._graphics.beginPath()
			for (let i = 0; i < spline.getDomainMax(); i++) {
				for (let j = 0; j < 50; j++) {
					const point: IPoint = spline.evaluate(i + j / 50)
					this._graphics.lineTo((point.x - left) / (right - left) * width + offsetX, height - (point.y - bottom) / (top - bottom) * height + offsetY)
				}
			}

			const point: IPoint = spline.evaluate(spline.getDomainMax())
			this._graphics.lineTo((point.x - left) / (right - left) * width + offsetX, height - (point.y - bottom) / (top - bottom) * height + offsetY)

			this._graphics.stroke()

			this._graphics.beginPath()
			for (let i = 0; i < points.length; i++) {
				const canvasPoint: IPoint = {
					x: (points[i].x - left) / (right - left) * width + offsetX,
					y: height - (points[i].y - bottom) / (top - bottom) * height + offsetY
				}
				this._graphics.moveTo(canvasPoint.x, canvasPoint.y)
				this._graphics.arc(canvasPoint.x, canvasPoint.y, 2, 0, 2 * Math.PI)
			}
			this._graphics.stroke()
			this._graphics.fill()

			if (selectedPoint >= 0) {
				this._graphics.beginPath()

				const canvasPoint: IPoint = {
					x: (points[selectedPoint].x - left) / (right - left) * width + offsetX,
					y: height - (points[selectedPoint].y - bottom) / (top - bottom) * height + offsetY
				}
				this._graphics.moveTo(canvasPoint.x, canvasPoint.y)
				this._graphics.arc(canvasPoint.x, canvasPoint.y, 5, 0, 2 * Math.PI)

				this._graphics.fillStyle = '#e84118'
				this._graphics.fill()
			}
		}
		else if (points.length === 1) {
			this._graphics.beginPath()

			const canvasPoint: IPoint = {
				x: (points[0].x - left) / (right - left) * width + offsetX,
				y: height - (points[0].y - bottom) / (top - bottom) * height + offsetY
			}
			this._graphics.moveTo(canvasPoint.x, canvasPoint.y)
			this._graphics.arc(canvasPoint.x, canvasPoint.y, 2, 0, 2 * Math.PI)

			this._graphics.stroke()
			this._graphics.fill()
		}

		this._graphics.beginPath()

		let origin: IPoint = {
			x: 0,
			y: 0
		}

		if (right - left === 0) {
			origin.x = this._canvas.width / 2
		}
		else {
			origin.x = -left / (right - left) * width + offsetX || 0
		}

		if (top - bottom === 0) {
			origin.y = this._canvas.height / 2
		}
		else {
			origin.y = height + bottom / (top - bottom) * height + offsetY || 0
		}

		this._graphics.moveTo(origin.x, origin.y)
		this._graphics.arc(origin.x, origin.y, 3, 0, 2 * Math.PI)

		this._graphics.fillStyle = '#00a8ff'
		this._graphics.fill()
	}

}

export default SplineView

import { observer } from 'mobx-react'
import * as React from 'react'

import State from 'State'

import Heading from './Heading'
import SelectedPoint from './SelectedPoint'
import AddPoint from './AddPoint'
import Points from './Points'

import './component.less'

interface IProps {
	state: State
}

@observer
class PointsWrapper extends React.Component<IProps, {}> {

	public render(): JSX.Element {
		const { $points, $selectedPoint } = this.props.state

		const top: JSX.Element | null = $selectedPoint !== -1
			? <SelectedPoint point={$points[$selectedPoint]} index={$selectedPoint} onChange={this._onChange} onRemove={this._onRemove} />
			: <AddPoint onAdd={this._onAdd} />

		return (
			<section id='points'>
				<Heading state={this.props.state} />
				{top}
				<Points state={this.props.state} onSelect={this._onSelect} />
			</section>
		)
	}

	private _onChange = (x: number, y: number) => {
		this.props.state.changeSelectedPoint(x, y)
	}

	private _onRemove = () => {
		this.props.state.removeSelectedPoint()
	}

	private _onAdd = (x: number, y: number) => {
		this.props.state.addPoint(x, y)
	}

	private _onSelect = (index: number) => {
		if (this.props.state.$selectedPoint === index) {
			this.props.state.setSelectedPoint(-1)
		}
		else {
			this.props.state.setSelectedPoint(index)
		}
	}

}

export default PointsWrapper

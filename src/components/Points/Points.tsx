import { observer } from 'mobx-react'
import * as React from 'react'

import State from 'State'

import { IPoint } from 'trajectory/Spline'

interface IProps {
	state: State
	onSelect(index: number): void
}

const Points = (props: IProps): JSX.Element => {
	const { $points, $selectedPoint } = props.state

	return (
		<div id='points'>
			{$points.map((point: IPoint, index: number) => (
				<div key={index} className={index === $selectedPoint ? 'selected' : ''} onClick={props.onSelect.bind(null, index)}>
					<span>{point.x}</span>
					<span>{point.y}</span>
				</div>
			))}
		</div>
	)
}

export default observer(Points)

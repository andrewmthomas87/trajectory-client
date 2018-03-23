
class SkidSteerRobot {

	public acceleration: number
	public deceleration: number
	public maxVelocity: number

	public angularAcceleration: number

	public constructor(acceleration: number, deceleration: number, maxVelocity: number, angularAcceleration: number) {
		this.acceleration = acceleration
		this.deceleration = deceleration
		this.maxVelocity = maxVelocity
		this.angularAcceleration = angularAcceleration
	}

}

export default SkidSteerRobot

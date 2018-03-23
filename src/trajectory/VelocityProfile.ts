
class VelocityProfile {

	public distanceValues: number[]
	public velocityValues: number[]
	public headingValues: number[]
	public angularVelocityValues: number[]
	public timeValues: number[]
	public stringValue: string

	public constructor(data: any) {
		this.distanceValues = data.DistanceValues
		this.velocityValues = data.VelocityValues
		this.headingValues = data.HeadingValues
		this.angularVelocityValues = data.AngularVelocityValues
		this.timeValues = data.TimeValues
		this.stringValue = data.StringValue
	}

}

export default VelocityProfile

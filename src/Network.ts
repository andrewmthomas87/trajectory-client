import { SkidSteerRobot, VelocityProfile } from 'trajectory'
import { IPoint } from 'trajectory/Spline'

import config from 'config'

class Network {

	public static getVelocityProfile(robot: SkidSteerRobot, startHeadingDegrees: number, endHeadingDegrees: number, points: IPoint[], resolution: number): Promise<VelocityProfile> {
		return Network._post('/velocity-profile', { robot, startHeadingDegrees, endHeadingDegrees, points, resolution }).then(data => new VelocityProfile(data))
	}

	private static _post(endpoint: string, data: any): Promise<any> {
		return fetch(`${config.server.url}${endpoint}`, {
			body: JSON.stringify(data),
			headers: { 'content-type': 'application/json' },
			method: 'POST'
		}).then(response => response.json())
	}

}

export default Network

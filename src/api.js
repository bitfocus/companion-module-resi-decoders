const { InstanceStatus, TCPHelper } = require('@companion-module/base')

module.exports = {
	async initConnection() {
		let self = this

		try {
			if (self.socket !== undefined) {
				self.socket.destroy()
				delete self.socket
			}

			if (self.config.host && self.config.host !== '') {
				self.updateStatus(InstanceStatus.Connecting)
				self.log('info', `Opening connection to Resi Decoder @ ${self.config.host}`)

				self.socket = new TCPHelper(self.config.host, 7788)

				self.socket.on('error', function (err) {
					self.updateStatus(InstanceStatus.ConnectionFailure, 'Network error: ' + err.message)
					self.log('error', `Network error: ${err.message}`)
				})

				self.socket.on('connect', function () {
					self.updateStatus(InstanceStatus.Ok)
					self.log('info', `Connected to Resi Decoder @ ${self.config.host}`)
				})

				self.socket.on('data', function (data) {})
			}
		} catch (error) {
			self.log('error', `Error connecting to Resi Decoder: ${error}`)
			self.updateStatus(InstanceStatus.ConnectionFailure, `Error connecting to Resi Decoder: ${error}`)
		}
	},

	sendCommand(cmd) {
		let self = this

		if (self.socket !== undefined && self.socket.isConnected) {
			self.socket.send(cmd + '\n')
		} else {
			self.log('error', 'Socket not connected.')
		}
	},
}

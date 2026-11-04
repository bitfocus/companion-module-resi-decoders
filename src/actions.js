module.exports = {
	initActions: function () {
		let self = this
		let actions = {}

		actions.play = {
			name: 'Play',
			callback: function () {
				self.sendCommand('CC play')
			},
		}

		actions.pause = {
			name: 'Pause',
			callback: function () {
				self.sendCommand('CC pause')
			},
		}

		actions.PAFFB = {
			name: 'Play and Fade From Black',
			callback: function () {
				self.sendCommand('CC PAFFB')
			},
		}

		actions.FTBAP = {
			name: 'Fade To Black and Pause',
			callback: function () {
				self.sendCommand('CC FTBAP')
			},
		}

		actions.FFB = {
			name: 'Fade From Black',
			callback: function () {
				self.sendCommand('CC FFB')
			},
		}

		actions.FTB = {
			name: 'Fade To Black',
			callback: function () {
				self.sendCommand('CC FTB')
			},
		}

		if (self.config.advanced == true) {
			actions.FF = {
				name: 'Seek Forward',
				options: [
					{
						type: 'textinput',
						label: 'milliseconds',
						id: 'ffms',
						default: '5000',
						useVariables: true,
					},
				],
				callback: function (action) {
					let opt = action.options
					let ffms = parseInt(opt.ffms)
					self.sendCommand('CC FF ' + ffms)
				},
			}

			actions.RW = {
				name: 'Seek Backward',
				options: [
					{
						type: 'textinput',
						label: 'milliseconds',
						id: 'rwms',
						default: '5000',
						useVariables: true,
					},
				],
				callback: function (action) {
					let opt = action.options
					let rwms = parseInt(opt.rwms)
					self.sendCommand('CC RW ' + rwms)
				},
			}
		}

		self.setActionDefinitions(actions)
	},
}

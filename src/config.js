const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		let self = this

		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value:
					'This modules controls Resi Decoders via RossTalk. You must have Remote Control enabled on your Decoder.',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Decoder IP',
				width: 6,
			},
			{
				type: 'static-text',
				id: 'hr',
				width: 12,
				label: ' ',
				value: '<hr />',
			},
			{
				type: 'checkbox',
				id: 'advanced',
				label: 'Enable Advanced Features',
				default: false,
				width: 3,
			},
			{
				type: 'static-text',
				id: 'info-advanced',
				width: 9,
				label: ' ',
				value: `Enabling Advanced Features will allow you to control some other features of the Decoder.`,
			},
		]
	},
}

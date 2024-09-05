const { combineRgb } = require('@companion-module/base')

module.exports = {
	initPresets: function () {
		let self = this
		let presets = []

		const colorWhite = combineRgb(255, 255, 255) // White
		const colorBlack = combineRgb(0, 0, 0) // Black

		presets = [
			{
				category: 'General',
				name: 'Set Converter Mode to Encoder',
				style: {
					text: 'Encoder',
					size: '18',
					color: colorWhite,
					bgcolor: colorBlack,
				},
				steps: [
					{
						down: [
							{
								actionId: 'modeSwitch',
								options: {
									mode: 'encoder',
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'mode',
						options: {
							mode: 'encoder',
						},
					},
				],
			},

			{
				category: 'Controls',
				name: 'Start playback',
				style: {
					text: 'Play',
					size: '18',
					color: colorWhite,
					bgcolor: colorBlack,
				},
				steps: [
					{
						down: [
							{
								actionId: 'play',
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			},

			{
				category: 'Controls',
				name: 'Pause Playback',
				style: {
					text: 'Pause',
					size: '18',
					color: colorWhite,
					bgcolor: colorBlack,
				},
				steps: [
					{
						down: [
							{
								actionId: 'pause',
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			},

			{
				category: 'Controls',
				name: 'Play and Fade From Black',
				style: {
					text: 'Play and FFB',
					size: '18',
					color: colorWhite,
					bgcolor: colorBlack,
				},
				steps: [
					{
						down: [
							{
								actionId: 'PAFFB',
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			},

			{
				category: 'Controls',
				name: 'Fade To Black and Pause',
				style: {
					text: 'FTB and Pause',
					size: '18',
					color: colorWhite,
					bgcolor: colorBlack,
				},
				steps: [
					{
						down: [
							{
								actionId: 'FTBAP',
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			},

			{
				category: 'Controls',
				name: 'Fade From Black',
				style: {
					text: 'FFB',
					size: '18',
					color: colorWhite,
					bgcolor: colorBlack,
				},
				steps: [
					{
						down: [
							{
								actionId: 'FFB',
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			},

			{
				category: 'Controls',
				name: 'Fade To Black',
				style: {
					text: 'FTB',
					size: '18',
					color: colorWhite,
					bgcolor: colorBlack,
				},
				steps: [
					{
						down: [
							{
								actionId: 'FTB',
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			},
		]

		self.setPresetDefinitions(presets)
	},
}

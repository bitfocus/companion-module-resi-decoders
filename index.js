// Resi Decoders
const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const upgrades = require('./src/upgrades')

const config = require('./src/config')

const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const api = require('./src/api')

class ResiDecoderInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,

			...actions,
			...feedbacks,
			...variables,
			...presets,

			...api,
		})
	}

	async init(config) {
		this.configUpdated(config)
	}

	async destroy() {
		try {
			if (self.socket !== undefined) {
				self.socket.destroy()
			}
		} catch (error) {
			this.log('error', 'destroy error:' + error)
		}
	}

	async configUpdated(config) {
		this.config = config

		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.initConnection()
	}
}

runEntrypoint(ResiDecoderInstance, upgrades)

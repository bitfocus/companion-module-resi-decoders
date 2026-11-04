const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const base = require('@companion-module/base')

// Substitute only the host-owned instance boundary. TCPHelper and the module are real.
let Instance
const originalLoad = Module._load
Module._load = function (id, ...args) {
	if (id === '@companion-module/base') {
		return {
			...base,
			InstanceBase: class {
				log() {}
				updateStatus() {}
				setActionDefinitions(actions) {
					this.actions = actions
				}
				setFeedbackDefinitions() {}
				setVariableDefinitions() {}
				setPresetDefinitions() {}
			},
			runEntrypoint: (instance) => {
				Instance = instance
			},
		}
	}
	return originalLoad.call(this, id, ...args)
}
require('../index')
Module._load = originalLoad

test('seek consumes host-prepared milliseconds without parsing again', () => {
	const commands = []
	const instance = new Instance()
	instance.config = { advanced: true }
	instance.sendCommand = (value) => commands.push(value)
	instance.initActions()
	const context = {
		parseVariablesInString() {
			throw new Error('already prepared by host')
		},
	}
	instance.actions.FF.callback({ options: { ffms: '1250' } }, context)
	instance.actions.RW.callback({ options: { rwms: 5000 } }, context)
	assert.deepEqual(commands, ['CC FF 1250', 'CC RW 5000'])
})

test('destroy closes the instance-owned socket', async () => {
	const instance = new Instance()
	let destroyed = false
	instance.socket = {
		destroy() {
			destroyed = true
		},
	}
	await instance.destroy()
	assert.equal(destroyed, true)
})

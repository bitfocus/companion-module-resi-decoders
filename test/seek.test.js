const assert = require('node:assert/strict')
const { test } = require('node:test')
const { initActions } = require('../src/actions')

test('seek consumes host-prepared milliseconds', () => {
	const commands = []
	const instance = {
		config: { advanced: true },
		sendCommand: (value) => commands.push(value),
		setActionDefinitions(actions) {
			this.actions = actions
		},
	}
	initActions.call(instance)
	instance.actions.FF.callback({ options: { ffms: '1250' } })
	instance.actions.RW.callback({ options: { rwms: 5000 } })
	assert.deepEqual(commands, ['CC FF 1250', 'CC RW 5000'])
})

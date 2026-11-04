const assert = require('node:assert/strict')
const net = require('node:net')
const { once } = require('node:events')
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

test('RossTalk actions, asynchronous variables, reconnect and shutdown', { timeout: 10000 }, async (t) => {
	const peers = []
	const server = net.createServer((peer) => peers.push(peer))
	await new Promise((resolve) => server.listen(7788, '127.0.0.1', resolve))
	const instance = new Instance()
	t.after(async () => {
		await instance.destroy()
		for (const peer of peers) peer.destroy()
		await new Promise((resolve) => server.close(resolve))
	})
	await instance.init({ host: '127.0.0.1', advanced: true })
	await once(instance.socket, 'connect')
	let received = ''
	peers[0].on('data', (data) => {
		received += data.toString()
	})
	for (const id of ['play', 'pause', 'PAFFB', 'FTBAP', 'FFB', 'FTB']) {
		await instance.actions[id].callback()
	}
	const parsed = []
	const context = {
		// The SDK callback context returns a Promise. Host variable lookup is unavailable here.
		async parseVariablesInString(text) {
			await new Promise((resolve) => setImmediate(resolve))
			parsed.push(text)
			return typeof text === 'string' ? text.replace('$(custom:seek)', '1250') : text
		},
	}
	await instance.actions.FF.callback({ options: { ffms: '$(custom:seek)' } }, context)
	await instance.actions.RW.callback({ options: { rwms: '5000' } }, context)
	const expected = 'CC play\nCC pause\nCC PAFFB\nCC FTBAP\nCC FFB\nCC FTB\nCC FF 1250\nCC RW 5000\n'
	while (received.length < expected.length) await once(peers[0], 'data')
	assert.equal(received, expected)
	assert.deepEqual(parsed, ['$(custom:seek)', '5000'])
	const oldSocket = instance.socket
	await instance.configUpdated({ host: '127.0.0.1', advanced: false })
	assert.notEqual(instance.socket, oldSocket)
	assert.equal(instance.actions.FF, undefined)
	assert.equal(instance.actions.RW, undefined)
	await once(instance.socket, 'connect')
	const socket = instance.socket
	await instance.destroy()
	assert.equal(socket.isDestroyed, true)
	await instance.configUpdated({ host: '', advanced: false })
	assert.equal(instance.socket, undefined)
	assert.doesNotThrow(() => instance.actions.play.callback())
})

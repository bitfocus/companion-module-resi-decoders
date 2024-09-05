module.exports = {
	initVariables() {
		let self = this
		let variables = []

		self.setVariableDefinitions(variables)
	},

	checkVariables() {
		let self = this

		try {
			let variableObj = {}

			self.setVariableValues(variableObj)
		} catch (error) {
			self.log('error', 'Error setting Variables: ' + String(error))
		}
	},
}

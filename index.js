var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
	self.init_tcp();
};

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;
	self.init_presets();
	self.status(self.STATE_UNKNOWN);
	self.init_tcp();
};

instance.prototype.init_tcp = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (self.config.host) {
		self.socket = new tcp(self.config.host, 7788);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.status(self.STATE_ERROR, err);
			self.log('error',"Network error: " + err.message);
		});

		self.socket.on('connect', function () {
			self.status(self.STATE_OK);
			debug("Connected");
		})

		self.socket.on('data', function (data) {});
	}
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module controls Living As One DECODERS ONLY via RossTalk.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'LA1 Decoder IP',
			width: 6,
			regex: self.REGEX_IP
		},
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);
};

// Define button presets
instance.prototype.init_presets = function () {
	var self = this;
	var presets = [
		{
			category: 'Controls',
			label: 'Start playback.',
			bank: {
				style: 'text',
				text: 'LA1\\nPlay',
				size: '14',
				color: self.rgb(255,255,255),
				latch: false
			},
			actions: [
				{
					action: 'play'
				}
			]
		},
		{
			category: 'Controls',
			label: 'Pause Playback.',
			bank: {
				style: 'text',
				text: 'LA1\\nPause',
				size: '14',
				color: self.rgb(255,255,255),
				latch: false
			},
			actions: [
				{
					action: 'pause'
				}
			]
		},
		{
			category: 'Controls',
			label: 'Play and Fade From Black.',
			bank: {
				style: 'text',
				text: 'LA1\\nPlay and FFB',
				size: '8',
				color: self.rgb(255,255,255),
				latch: false
			},
			actions: [
				{
					action: 'PAFFB'
				}
			]
		},
		{
			category: 'Controls',
			label: 'Fade To Black and Pause.',
			bank: {
				style: 'text',
				text: 'LA1\\nFTB and Pause',
				size: '8',
				color: self.rgb(255,255,255),
				latch: false
			},
			actions: [
				{
					action: 'FTBAP'
				}
			]
		},
		{
			category: 'Controls',
			label: 'Fade From Black.',
			bank: {
				style: 'text',
				text: 'LA1\\nFFB',
				size: '14',
				color: self.rgb(255,255,255),
				latch: false
			},
			actions: [
				{
					action: 'FFB'
				}
			]
		},
		{
			category: 'Controls',
			label: 'Fade To Black.',
			bank: {
				style: 'text',
				text: 'LA1\\nFTB',
				size: '14',
				color: self.rgb(255,255,255),
				latch: false
			},
			actions: [
				{
					action: 'FTB'
				}
			]
		},
	];
	self.setPresetDefinitions(presets);
}

instance.prototype.actions = function(system) {
	var self = this;
	self.system.emit('instance_actions', self.id, {

		'play' : { label: 'Play' },
		'pause': { label: 'Pause' },
		'PAFFB': { label: 'Play and Fade From Black' },
		'FTBAP': { label: 'Fade To Black and Pause' },
		'FFB'  : { label: 'Fade From Black' },
		'FTB'  : { label: 'Fade To Black' },
		/*
		'FF'   : {
			label: 'Seek Forward',
			options: [
				{
					type: 'textinput',
					label: 'milliseconds',
					id: 'ffms',
					default: '5000',
					regex: self.REGEX_NUMBER
				}
			] 
		},
		*/
		/*
		'RW'   : {
			label: 'Seek Backward',
			options: [
				{
					type: 'textinput',
					label: 'milliseconds',
					id: 'rwms',
					default: '5000',
					regex: self.REGEX_NUMBER
				}
			]
		},
		*/
	});
}

instance.prototype.action = function(action) {
	var self = this;

	// parseInt(action.options.int)
	var cmd;

	switch (action.action) {

		case 'play':
			cmd = 'CC ' + "play";
			break;
		case 'pause':
			cmd = 'CC ' + "pause";
			break;
		case 'PAFFB':
			cmd = 'CC ' + "PAFFB";
			break;
		case 'FTBAP':
			cmd = 'CC ' + "FTBAP";
			break;
		case 'FFB':
			cmd = 'CC ' + "FFB";
			break;
		case 'FTB':
			cmd = 'CC ' + "FTB";
			break;
		/*
		case 'FF':
			var ffms = parseInt(opt.ffms);
			cmd = 'CC FF ' + ffms;
			break;
		*/
		/*	
		case 'RW':
			var rwms = ParseInt(opt.rwms);
			cmd = 'CC RW ' + rwms;
			break;
		*/
	}

	if (cmd !== undefined) {

		debug('sending tcp',cmd,"to",self.config.host);

		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd + "\n");
		}
		else {
			debug('Socket not connected :(');
		}

	}

	debug('action():', action);


};

instance_skel.extendedBy(instance);
exports = module.exports = instance;

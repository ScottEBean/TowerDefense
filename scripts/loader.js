/* globals Demo, console, require */

Game = {
	input: {},
	components: {},
	graphics: {},
	utilities: {},
	assets: {},
	screens: {}
};

//------------------------------------------------------------------
// Purpose of this code is to bootstrap (maybe I should use that as the name)
// the rest of the application.  Only this file is specified in the index.html
// file, then the code in this file gets all the other code and assets
// loaded.
//------------------------------------------------------------------
Game.loader = (function() {
	'use strict';
	var scriptOrder = [
		{
			scripts: ['menu'],
			message: 'menu loaded',
			onComplete: null
		}, {
			scripts: ['mainmenu', 'about', 'help', 'highscores'],
			message: 'screens loaded',
			onComplete: null
		}, {
			scripts: ['input', 'records', 'random'],
			message: 'helpers loaded',
			onComplete: null
		}, {
			scripts: ['graphics'],
			message: 'graphics loaded',
			onComplete: null
		}, {
			scripts: ['game'],
			message: 'Game logic loaded',
			onComplete: null
		}],
		assetOrder = [{
			key: 'towerBase',
			source: '/assets/towers/base.gif'
		}, {
			key: 'tower11',
			source: '/assets/towers/t11.png'
		}, {
			key: 'tower12',
			source: '/assets/towers/t12.png'
		}, {
			key: 'tower13',
			source: '/assets/towers/t13.png'
		}, {
			key: 'tower21',
			source: '/assets/towers/t21.png'
		}, {
			key: 'tower22',
			source: '/assets/towers/t22.png'
		}, {
			key: 'tower23',
			source: '/assets/towers/t23.png'
		}, {
			key: 'tower31',
			source: '/assets/towers/t31.png'
		}, {
			key: 'tower32',
			source: '/assets/towers/t32.png'
		}, {
			key: 'tower33',
			source: '/assets/towers/t33.png'
		}, {
			key: 'tower41',
			source: '/assets/towers/t41.png'
		}, {
			key: 'tower42',
			source: '/assets/towers/t42.png'
		}, {
			key: 'tower43',
			source: '/assets/towers/t43.png'
        }, {
			key: 'airCreep1',
			source: '/assets/creeps/ac1.png'
        }, {
			key: 'airCreep2',
			source: '/assets/creeps/ac2.png'
        }, {
			key: 'airCreep3',
			source: '/assets/creeps/ac3.png'
        }, {
			key: 'airCreep4',
			source: '/assets/creeps/ac4.png'
        }, {
			key: 'airCreep5',
			source: '/assets/creeps/ac5.png'
        }, {
			key: 'airCreep6',
			source: '/assets/creeps/ac6.png'
        }, {
			key: 'groundCreep11',
			source: '/assets/creeps/gc11.png'
        }, {
			key: 'groundCreep12',
			source: '/assets/creeps/gc12.png'
        }, {
			key: 'groundCreep13',
			source: '/assets/creeps/gc13.png'
        }, {
			key: 'groundCreep14',
			source: '/assets/creeps/gc14.png'
        }, {
			key: 'groundCreep21',
			source: '/assets/creeps/gc21.png'
        }, {
			key: 'groundCreep22',
			source: '/assets/creeps/gc22.png'
        }, {
			key: 'groundCreep23',
			source: '/assets/creeps/gc23.png'
        }, {
			key: 'groundCreep24',
			source: '/assets/creeps/gc24.png'
        }];

	//------------------------------------------------------------------
	// Zero pad a number, adapted from Stack Overflow.
	// Source: http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript
	//------------------------------------------------------------------
	function numberPad(n, p, c) {
		var padChar = typeof c !== 'undefined' ? c : '0',
			pad = new Array(1 + p).join(padChar);

		return (pad + n).slice(-pad.length);
	}

	//------------------------------------------------------------------
	// Helper function used to load scripts in the order specified by the
	// 'scripts' parameter.  'scripts' expects an array of objects with
	// the following format...
	//	{
	//		scripts: [script1, script2, ...],
	//		message: 'Console message displayed after loading is complete',
	//		onComplete: function to call when loading is complete, may be null
	//	}
	//------------------------------------------------------------------
	function loadScripts(scripts, onComplete) {
		var entry = 0;
		//
		// When we run out of things to load, that is when we call onComplete.
		if (scripts.length > 0) {
			entry = scripts[0];
			require(entry.scripts, function() {
				console.log(entry.message);
				if (entry.onComplete) {
					entry.onComplete();
				}
				scripts.splice(0, 1);
				loadScripts(scripts, onComplete);
			});
		} else {
			onComplete();
		}
	}

	//------------------------------------------------------------------
	// Helper function used to load assets in the order specified by the
	// 'assets' parameter.  'assets' expects an array of objects with
	// the following format...
	//	{
	//		key: 'asset-1',
	//		source: 'asset/url/asset.png'
	//	}
	//
	// onSuccess is invoked per asset as: onSuccess(key, asset)
	// onError is invoked per asset as: onError(error)
	// onComplete is invoked once per 'assets' array as: onComplete()
	//------------------------------------------------------------------
	function loadAssets(assets, onSuccess, onError, onComplete) {
		var entry = 0;
		//
		// When we run out of things to load, that is when we call onComplete.
		if (assets.length > 0) {
			entry = assets[0];
			loadAsset(entry.source,
				function(asset) {
					onSuccess(entry, asset);
					assets.splice(0, 1);
					loadAssets(assets, onSuccess, onError, onComplete);
				},
				function(error) {
					onError(error);
					assets.splice(0, 1);
					loadAssets(assets, onSuccess, onError, onComplete);
				});
		} else {
			onComplete();
		}
	}

	//------------------------------------------------------------------
	// This function is used to asynchronously load image and audio assets.
	// On success the asset is provided through the onSuccess callback.
	// Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
	//------------------------------------------------------------------
	function loadAsset(source, onSuccess, onError) {
		var xhr = new XMLHttpRequest(),
			asset = null,
			fileExtension = source.substr(source.lastIndexOf('.') + 1);	// Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

		if (fileExtension) {
			xhr.open('GET', source, true);
			xhr.responseType = 'blob';

			xhr.onload = function() {
				if (xhr.status === 200) {
					if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'gif') {
						asset = new Image();
					} else if (fileExtension === 'mp3') {
						asset = new Audio();
					} else {
						if (onError) { onError('Unknown file extension: ' + fileExtension); }
					}
					asset.onload = function() {
						window.URL.revokeObjectURL(asset.src);
					};
					asset.src = window.URL.createObjectURL(xhr.response);
					if (onSuccess) { onSuccess(asset); }
				} else {
					if (onError) { onError('Failed to retrieve: ' + source); }
				}
			};
		} else {
			if (onError) { onError('Unknown file extension: ' + fileExtension); }
		}

		xhr.send();
	}

	//------------------------------------------------------------------
	// Called when all the scripts are loaded, it kicks off the Game app.
	//------------------------------------------------------------------
	function mainComplete() {
		console.log('it is all loaded up');
		Game.menu.initialize();
	}

	// Start with loading the assets, then the scripts.
	console.log('Starting to dynamically load project assets');
	loadAssets(assetOrder,
		function(source, asset) {	// Store it on success
			Game.assets[source.key] = asset;
		},
		function(error) {
			console.log(error);
		},
		function() {
			console.log('All assets loaded');
			console.log('Starting to dynamically load project scripts');
			loadScripts(scriptOrder, mainComplete);
		}
	);

}());
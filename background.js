chrome.webNavigation.onCommitted.addListener(function(e) {
	keepAlive();
}, {url: [{hostSuffix: 'dashnet.org'}]});

setInterval(function () {
	performInjection();
}, 4500);

// This is a race

let intervalCounters = 50;

let raceInterval = setInterval(function () {
	if(intervalCounters > 0)
		intervalCounters--;
	
	else
		clearInterval(raceInterval);
	
	performInjection();
}, 250);


function performInjection()
{
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
		if(tabs[0] && tabs[0].url && (tabs[0].url.search("www.orteil.dashnet.org") != -1 || tabs[0].url.search("https://orteil.dashnet.org") != -1 || tabs[0].url.search("http://orteil.dashnet.org") != -1))
		{
			if(typeof tabs[0].id !== 'undefined')
			{
				chrome.storage.sync.get(['autoClickerSpeed', 'grandpas'], function(result)
				{
					let autoClickerSpeed;
					
					let grandpas;
					
					if(!result || !result.grandpas)
						grandpas = false;
					
					else
						grandpas = true;
					
					if(!result || result.autoClickerSpeed < 0)
						autoClickerSpeed = 0;
					
					else if(result.autoClickerSpeed > 50)
						autoClickerSpeed = 50;
					
					else
						autoClickerSpeed = result.autoClickerSpeed;
						
					
					let msecNeededToPass;

					if(autoClickerSpeed == 0)
						msecNeededToPass = 999999999;
					
					else
						msecNeededToPass = 1000.0 / parseFloat(autoClickerSpeed);
					
					chrome.scripting.executeScript(
					{
						args: [msecNeededToPass, grandpas],
						target: {tabId: tabs[0].id},
						world: "MAIN", // Main world is mandatory to edit other website functions
						func: injectFunction,
						//files: ['inject.js'],
					});
				});
			}
		}
	}); 
}

let lifeline;

keepAlive();

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'keepAlive') {
    lifeline = port;
    setTimeout(keepAliveForced, 295e3); // 5 minutes minus 5 seconds
    port.onDisconnect.addListener(keepAliveForced);
  }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

async function keepAlive() {
  if (lifeline) return;
  for (const tab of await chrome.tabs.query({ url: '*://*/*' })) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => chrome.runtime.connect({ name: 'keepAlive' }),
        // `function` will become `func` in Chrome 93+
      });
      chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
      return;
    } catch (e) {}
  }
  chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
}

async function retryOnTabUpdate(tabId, info, tab) {
  if (info.url && /^(file|https?):/.test(info.url)) {
    keepAlive();
  }
}









/*
====================================
======= Start of inject.js =========
====================================
*/

function injectFunction(msecNeededToPass, grandpas)
{
	
	window.Eyal_msecNeededToPass = msecNeededToPass;
	
	window.Eyal_censorBullshit = async function()
	{
		window.Eyal_monitorUpgrade = function(myself)
		{
			if ((typeof myself.baseDesc !== "undefined" && myself.baseDesc.search(/temple/i) >= 0) || (typeof myself.desc !== "undefined" && myself.desc.search(/temple/i) >= 0))
			{
				myself.baseDesc = "This upgrade does something with Grandpas"
				myself.desc = "This upgrade does something with Grandpas"
				myself.ddesc = "This upgrade does something with Grandpas"
				myself.dname = "Grandpa Upgrade"
				myself.icon = [1, 0]
				window.Eyal_foundOffender = true;
			}
		}
		for (var i in Game.Upgrades)
		{
			var myself=Game.Upgrades[i];

			Eyal_monitorUpgrade(myself);
		}

		for (var i in Game.UpgradesInStore)
		{
			var myself=Game.UpgradesInStore[i];

			Eyal_monitorUpgrade(myself);
		}

		for (var i in Game.GrandmaSynergies)
		{
			var myself=Game.GrandmaSynergies[i];

			Eyal_monitorUpgrade(myself);
		}

		if(window.Eyal_foundOffender)
		{
			window.Eyal_foundOffender = false;
			
			Game.Objects["Temple"].icon = 1
			Game.Objects["Temple"].muted = 1
			Game.Objects["Temple"].extraPlural = ""
			Game.Objects["Temple"].extraName = ""
			Game.Objects["Temple"].onMinigame = undefined
			Game.Objects["Temple"].levelAchiev10 = undefined
			Game.Objects["Temple"].displayName = "Grandpa"
			Game.Objects["Temple"].dname = "Grandpa"
			Game.Objects["Temple"].bsingle = "grandpa"
			Game.Objects["Temple"].bplural = "grandpas"
			Game.Objects["Temple"].single = "Grandpa"
			Game.Objects["Temple"].unshackleUpgrade = "Unshackled Grandpas"
			Game.Objects["Temple"].tieredAchievs = {}
			
			Game.RebuildUpgrades()
			Game.RefreshStore();
		}
	}
	window.Eyal_interval = async function()
	{
		if(Eyal_msecNeededToPass > 1000)
			await Eyal_wait(1000);
		
		else
			await Eyal_wait(Eyal_msecNeededToPass);

		if(grandpas)
		{
			Eyal_censorBullshit();
		}
		if(Game.BigCookieState != 1 || Eyal_msecNeededToPass > 1000)
			return;

		Eyal_msecPassed = 0;
		Game.lastClick = 0
		bigCookie.click();
	}

	if(typeof Eyal_WhileTrue === "undefined")
	{
		window.Eyal_wait = function(ms)
		{
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		window.Eyal_msecPassed = 0;
		
		window.Eyal_WhileTrue = async function()
		{
			while(true)
			{
				 await Eyal_interval();
			}
		}

		Eyal_WhileTrue();
	}
}
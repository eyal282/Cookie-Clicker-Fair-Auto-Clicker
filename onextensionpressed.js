

document.addEventListener('DOMContentLoaded', function () {

	let input = document.querySelector('input[id="autoClickerSpeed"]');
	
	if(input.id == 'autoClickerSpeed')
	{
		chrome.storage.sync.get(['autoClickerSpeed'], function(result) {
		
			if(!result || result.autoClickerSpeed < 0)
				input.value = "0";
			
			else if(result.autoClickerSpeed > 50)
				input.value = "50";
			
			else
				input.value = result.autoClickerSpeed;

		});
		
		input.addEventListener('change', function () {
			chrome.storage.sync.set({autoClickerSpeed: input.value}, function() {});
		});
	}
});



document.addEventListener('DOMContentLoaded', function () {

	let checkbox = document.querySelector('input[id="grandpas"]');
	
	if(checkbox.id == 'grandpas')
	{
		chrome.storage.sync.get(['grandpas'], function(result) {
			if(result && result.grandpas == true)
				checkbox.checked = true;
			
			else
				checkbox.checked = false;

		});
		
		checkbox.addEventListener('change', function () {
			chrome.storage.sync.set({grandpas: checkbox.checked}, function() {});
		});
	}
});
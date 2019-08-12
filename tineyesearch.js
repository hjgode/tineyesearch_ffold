var contextMenu = require("sdk/context-menu");
var windows = require("sdk/windows");


function onUpdated(tab) {console.log("Updated tab: ${tab.id}");} 
function onError(error) { console.log("Error: ${error}"); } 

var menuItem = contextMenu.Item({
  label: "Search at TinEye",
  context: contextMenu.SelectorContext("a[href], img"),
  contentScript: 'self.on("click", function (node, data) {' +
                 '  console.log("Item clicked: " + node.currentSrc);' +
				 '  self.postMessage(node.currentSrc); ' +
                 '});',
    
	onMessage: function (selectionText) {
		console.log("onMessage: " + selectionText);
//		let tabs = require("sdk/tabs");
//		tabs.create("https://tineye.com/search/?pluginver=firefox-1.4.1&sort=size&order=desc&url=" + selectionText);
		if (window === null || typeof window !== "object") {
			//If you do not already have a window reference, you need to obtain one:
			//  Add a "/" to un-comment the code appropriate for your add-on type.
			/* Add-on SDK: */
			var window = require('sdk/window/utils').getMostRecentBrowserWindow();
			//*/
			/* Overlay and bootstrap (from almost any context/scope):
			var window=Components.classes["@mozilla.org/appshell/window-mediator;1"]
								 .getService(Components.interfaces.nsIWindowMediator)
								 .getMostRecentWindow("navigator:browser");        
			//*/
			console.log("window=" + window);
		}
		//OK: window.open("https://tineye.com/search/?pluginver=firefox-1.4.1&sort=size&order=desc&url=" + selectionText);
		window.gBrowser.selectedTab =  window.gBrowser.addTab("https://tineye.com/search/?pluginver=firefox-1.4.1&sort=size&order=desc&url=" + selectionText);
  }
});

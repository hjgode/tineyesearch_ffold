var contextMenu = require("sdk/context-menu");
var windows = require("sdk/windows");
var preferences = require("sdk/simple-prefs").prefs;



function onUpdated(tab) {console.log("Updated tab: ${tab.id}");} 
function onError(error) { console.log("Error: ${error}"); } 

function onPrefChange(prefName) {
  console.log("The preference " + 
              prefName + 
              " value has changed!");
}
require("sdk/simple-prefs").on("somePreference", onPrefChange);
require("sdk/simple-prefs").on("someOtherPreference", onPrefChange);

// `""` listens to all changes in the extension's branch
require("sdk/simple-prefs").on("", onPrefChange);

var menuItem = contextMenu.Item({
  label: "Search at TinEye",
  accesskey: "5",
	context: contextMenu.SelectorContext("a[href], img"),
  contentScript: 'self.on("click", function (node, data) {' +
                 '  console.log("Item clicked: " + node.currentSrc);' +
				 '  self.postMessage(node.currentSrc); ' +
                 '});',
    
	onMessage: function (selectionText) {
		console.log("onMessage: " + selectionText);
		var sortType = require('sdk/simple-prefs').prefs['TineyeSortType'];
		var sortOrder = require('sdk/simple-prefs').prefs['TineyeSortOrder'];
		var showResultAs = require('sdk/simple-prefs').prefs['ShowResultAs'];
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
		var query_string = "";
		switch(sortType) {
			case "score":
				query_string = "&sort=score";
				break;
			case "size":
				query_string = "&sort=size";
				break;
			case "crawl_date":
				query_string = "&sort=crawl_date";
				break;
			default:
				query_string = "&sort=crawl_date";
				sortType="size";
		}
		switch(sortOrder) {
			case "asc":
				query_string += "&order=asc";
				break;
			case "desc":
				query_string += "&order=desc";
				break;
			default:
				query_string += "&order=desc";
				sortOrder="desc";
		}
		console.log("sortType: " + sortType);
		console.log("sortOrder: " + sortOrder);
		console.log("showResultAs: " + showResultAs);
        //todo: https://foo.com/John Doe.jpg does not work, even with %20 replacement
        //replace existing blanks in file name: ie John Doe.jpg => John%20Doe.jpg
        var selectionTextNew = encodeURIComponent(selectionText);
        console.log("selectionTextNew="+selectionTextNew);
		var newUrl = "https://tineye.com/search/?pluginver=firefox-1.4.1" + query_string + "&url=" + selectionTextNew;
		console.log("URL="+newUrl);
		// "https://tineye.com/search/?pluginver=firefox-1.4.1&sort=size&order=desc&url=" + selectionText);
		switch(showResultAs){
			case "foreground":
				window.gBrowser.selectedTab =  window.gBrowser.addTab(newUrl); 
				break;
			case "background":
				window.gBrowser.addTab(newUrl); 
				break;
			case "current":
				window.gBrowser.loadURI(newUrl);
				break;
			default:
				window.gBrowser.selectedTab =  window.gBrowser.addTab(newUrl);
				showResultAs="foreground";
		}
    }
});

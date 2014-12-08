/**
 * @fileOverview HTML5 History Utility
 * @author <a href="mailto:brianfegan@gmail.com">Brian Fegan</a>
 * @version 0.9
 */

/**
 * @name History
 * @namespace History manager for working with history API. If API isn't supported, History.pushState performs a window.location.href redirect.
 * @description History manager for working with history API. If API isn't supported, History.pushState performs a window.location.href redirect.
 */
window.History = (function(window, undefined){
	
	var config = {
			historyApi: (history.pushState === undefined) ? false : true,
			initialized : false,
			hasPushed: false
		},
		
		/**
		 * @name History~_parseState
		 * @function
		 * @description Placeholder for parsing state data; overwritten in History.initialize.
		 */ 
		_parseState = function() {},
				
		/**
		 * @name History~_setState
		 * @function
		 * @description Update the state object
		 * @param {number} uid
		 * @param {string} path
		 * @param {string} title
		 * @param {object} data
		 */
		_setState = function(uid, path, title, data) {
			config.state = {
				uid: uid,
				path: path,
				title: title,
				data: data
			};
		},
		
		/**
		 * @name History~_setDocumentTitle
		 * @function
		 * @description Update the page title using title store in state data.
		 * @param {string} title
		 */
		_setDocumentTitle = function(title) {
			if (typeof title === 'string') document.title = state.title;
		},
		
		/**
		 * @name History~_popstate
		 * @function
		 * @description Event handler for the history api popstate event.
		 * @param {object} e The popstate event object provided by the browser.
		 */
		_popstate = function(e) {
			if (config.hasPushed) {
				var state = (e.originalEvent) ? e.originalEvent.state : e.state;
				_setState(state);
				_setDocumentTitle(state.title);
				_parseState(state, true); //true=isPopState
			}
		},
		
		/**
		 * @name History~_replaceState
		 * @exports History~_replaceState as History.replaceState
		 * @function
		 * @description Update state object with new data, and call native API.
		 * @param {object} data A key/value object of the data we want to associate with this path.
		 */
		_replaceState = function(data) {
			if (config.historyApi) {
				config.state.data = data;
				history.replaceState(config.state, null, config.state.path);
			}
		},
		
		/**
		 * @name History~_pushState
		 * @exports History~_pushState as History.pushState
		 * @function
		 * @description Calls the native API, and passes updated state object to custom _parseState function. If native API is not supported, 
		 * will redirect to path passed in.
		 * @param {object} data An object of data we want to associate with this path.
		 * @param {string} title The title to set as the new document title.
		 * @param {string} path The URL path to push to.
		 */
		_pushState = function(data, title, path) {
			if (!config.historyApi) {
				window.location.href = path;
				return;
			}
			config.hasPushed = true; // used in popstate to ensure at least one push has happened
			_setState((config.state.uid + 1), path, title, data);
			history.pushState(config.state, null, path);
			_setDocumentTitle(title);
			_parseState(state);
		},
		
		/**
		 * @name History~_initialize
		 * @exports History~_initialize as History.initialize
		 * @function
		 * @description Sets up initial state object, and the popstate event handler.
		 * @param {function} [parseState] A function to execute on all state changes.
		 */
		_initialize = function(parseState) {
			
			// abort if already initialized
			if (config.initialized) return;
			
			// only set up complete manager if history api is supported
			if (config.historyApi) {
			
				// set the parseData function if it was passed in
				if (typeof parseState === 'function') _parseState = parseState;
				
				// set our initial state object
				_setState(0, (window.location.pathname + window.location.search), document.title, {});
				
				// use the history popstate event to load the previous or next page
				// also runs when the page first loads in chrome (but not safari?)
				// so we check inside _popstate to make sure a pushState has happened at least once
				window.addEventListener('popstate', _popstate, true);
			
			}
			
			// only init once
			config.initialized = true;
			
		};
	
	/**
	 * Protected methods for the self.History subclass.
	 */
	return {
		initialize	: _initialize,
		pushState	: _pushState,
		replaceState: _replaceState
	};
	
})(window, undefined);
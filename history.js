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
		 * @name History~_doStateUpdate
		 * @function
		 * @description Update the expanded state object, the browser document title, and call parseState.
		 * @param {object} state
		 * @param {boolean} isPopState
		 */
		_doStateUpdate = function(state, isPopState) {
			config.state = state;
			if (typeof state.title === 'string') document.title = state.title;
			_parseState(state, isPopState);
		},
		
		/**
		 * @name History~_popstate
		 * @function
		 * @description Event handler for the history api popstate event.
		 * @param {object} e The popstate event object provided by the browser.
		 */
		_popstate = function(e) {
			if (config.hasPushed) {
				_doStateUpdate( ((e.originalEvent) ? e.originalEvent.state : e.state), true);
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
				history.replaceState(config.state);
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
			_doStateUpdate( { index:(config.state.index + 1), path:path, title:title, data:data }, false);
			history.pushState(config.state, title, path);
			config.hasPushed = true; // used in popstate to ensure at least one push has happened
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
				config.state = { index:0, path:(window.location.pathname + window.location.search), title:document.title, data:{} };
				
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
HTML5 History API Manager
=========================

<p>Modern browsers support the ability to update the browser URL with JavaScript, and associate state data with the updated URL.</p>
<p>There are several gaps in the native API that this utility aims to satisfy.</p>
<ul>
	<li>Define a callback method that executes when calling pushState and when onpopstate events are fired.</li>
	<li>Ensure that in browsers where a popstate event fires on page load that this first event is ignored.</li>
	<li>Increments a unique ID on every pushState call, which can determine if a popstate event is due to forward or back navigation.</li>
	<li>Updates the browser document title (part of the API but not supported by any browser), and saves that title in the state object.</li>
	<li>Saves the path associated with the state in the state object.</li>
	<li>If history API is not supported, calling pushState will redirect browser to the path passed in.</li>
</ul>

<h2>Usage</h2>
    // initialize by passing in the method to execute when the History.pushState method is called and when the onpopstate event fires.
    History.initialize(function(state) {
    	// the state object contains the following keys associated with this state...
    	// state.uid == unique id for this state
    	// state.path == url path for this state
    	// state.title == document.title
    	// state.data == an object of custom data 
    });
    
    // update the browser url, title and associate this object with this url
    History.pushState({}, 'The Browser Title', '/new-path');
    
    // replace the current object stored in state.data with the object passed in
    History.replaceState({});
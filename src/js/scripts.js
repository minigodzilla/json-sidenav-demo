var JSONSidenavDemo = JSONSidenavDemo || {};
(function ($, window, document, undefined) {

  'use strict';

  $(function () {

    JSONSidenavDemo = function () {
        // maintain a reference to self
        var self = this;

        // config object
        this.config = {
          jsonURI : '/data/nav.json'
        };

        /**
        * uses xmlhttprequest to load the JSON data for the nav
        *
        */
        this.loadNavData = function() {

          // Return a new promise.
          return new Promise(function(resolve, reject) {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('GET', self.config.jsonURI);

            req.onload = function() {
              // This is called even on 404 etc
              // so check the status
              if (req.status === 200) {
                // Resolve the promise with the response text
                resolve(req.response);
              }
              else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(req.statusText));
              }
            };

            // Handle network errors
            req.onerror = function() {
              reject(Error('Network Error'));
            };

            // Make the request
            req.send();
          });

        };

        /**
        * for mobile, toggle nav open class
        *
        */
        this.toggleNavState = function() {
            var body = document.querySelector('body');
            body.classList.toggle('nav-open');
        };

        /**
        * watch the hash in the url for changes, adjust the active 
        * classes in the nav according to their data-hash value
        *
        */
        this.onHashChange = function() {

          var hash = window.location.hash;

          // get all items with a hash value
          var activeElements = document.querySelectorAll('[data-hash]');
          
          //run through them
          for (var i = 0; i < activeElements.length; i++) {
            
            
            // add active tag to all items in the current tree
            if (hash.indexOf(activeElements[i].getAttribute('data-hash')) !== -1) {
              activeElements[i].classList.add('active');
            } else {
              // remove all active tags
              activeElements[i].classList.remove('active');
            }
          }
        };

        /**
        * adds event listeners to objects where required
        *
        */
        this.eventListeners = function() {
          var mobileNavBtn = document.getElementById('mobile-open-close-btn');
          mobileNavBtn.addEventListener('click', self.toggleNavState);
          
          window.onhashchange = self.onHashChange;
        };

        /**
        * start building the nav
        *
        * @param {object} data - the data for the nav
        */
        this.buildNav = function(data) {
          // get the nav from the dom
          var nav = document.getElementById('nav');
          // start building the nav list
          self.buildList(data.items, nav);
        };

        /**
        * recursively builds a ul structure for the nav elements
        *
        * @param {data} object - object for the current tree of the nav
        * @param {parent} object - object to append the list to
        */
        this.buildList = function(data, parent) {

           var list = document.createElement('ul');

           for (var i = 0; i < data.length; i++) {
              var itemData = data[i];
              var listItem = document.createElement('li');
              listItem.setAttribute('data-hash', itemData.url);
              var itemLink = document.createElement('a');
              itemLink.setAttribute('href', itemData.url);
              itemLink.innerHTML = itemData.label;
              var glyphSpan = document.createElement('span');
              glyphSpan.setAttribute('class', 'glyph-span');


              listItem.appendChild(itemLink);
              itemLink.appendChild(glyphSpan);

              // there is a child
              if (itemData.items && itemData.items.length > 0) {

                 // add the class
                 listItem.className = 'has-child-nav';
                 self.buildList(itemData.items, listItem);

              }
              list.appendChild(listItem);

           }
           parent.appendChild(list);
        };

        /**
        * sets up all data and events
        *
        */
        this.init = function() {
          // using promises, make sure that everything gets setup in order
          self.loadNavData()
            .then(JSON.parse) // parse the data
            .then(self.buildNav) // build the nav
            .then(self.eventListeners) // add listeners
            .then(self.onHashChange); // add any events
        };


      this.init();
   };

JSONSidenavDemo = new JSONSidenavDemo();

  });

})(jQuery, window, document);

(function() {

    var de_flag = {
        element: 'img',
        src: '/img/german-flag.jpg',
        alt: 'German flag'
    };

    var en_flag = {
        element: 'img',
        src: '/img/us-flag.jpg',
        alt: 'U.S. Flag'
    };

    var german = {
        element: 'a',
        id: 'german'
    };

    var english = {
        element: 'a',
        id: 'english'
    };

    var removeElement = function(element) {
        element.parentNode.removeChild(element);
    };

    var removeChildrenByTag = function(parentId, tag) {
        var container = document.getElementById(parentId);
        var tags = container.getElementsByTagName(tag);
        for (var i = tags.length-1; i >= 0; --i) {
            removeElement(tags[i]);
        }
    };

    var markupGenerator = function(object) {
        var element = document.createElement(object.element);
        var obj_keys = Object.keys(object);
        for (var i = 0; i < obj_keys.length; i++ ) {
            element[obj_keys[i]] = object[obj_keys[i]];
        }
        return element;
    };

    var injectLinkedFlag = function(link_obj, flag_obj) {
        var linked = markupGenerator(link_obj);
        var container = document.getElementById('languages');
        linked.appendChild(markupGenerator(flag_obj));
        container.insertBefore(linked, container.firstChild);
    };

    removeChildrenByTag('languages', 'a');
    injectLinkedFlag(english, en_flag);
    injectLinkedFlag(german, de_flag);

    //Cross browser click event
    var addEvent = function(element, type, method) {
        if ('addEventListener' in element) {
            element.addEventListener(type, method, false);
        } else if ('attachEvent' in element) {
            element.attachEvent('on' + type, method);

        // If addEventListener and attachEvent are both unavailable,
        // use inline events. This should never happen.
        } else if ('on' + type in element) {
            // If a previous inline event exists, preserve it. This isn't
            // tested, it may eat your baby
            var oldMethod = element['on' + type],
                newMethod = function(e) {
                    oldMethod(e);
                    newMethod(e);
                };
        } else {
            element['on' + type] = method;
        }
    };

    //Object that maps English language pages to German translations (and vice-a-versa
        //with the getKeyByValue method.)
    var pages = {
        '/en/index.html': '/de/index.html',
        '/en/appointments.html': '/de/arzttermin.html',
        '/en/appointments.html#forms': '/de/arzttermin.html#formular',
        'workshops.html': 'unterricht.html',
        //Returns English key from German value
        getKeyByValue: function(value) {
            for ( var prop in this ) {
                if ( this.hasOwnProperty( prop ) ) {
                    if ( this[ prop ] === value )
                        return prop;
                }
            }
        }
    };

    var switchUrl = function(lang, url, filename) {
        //Gets translation request and checks that the current page is written in the opposite language.
        //pages[filename] === English
        //pages.getKeyByValue(filename) === German
        if (lang === 'english' && pages.getKeyByValue(filename)) {
            window.location = url.replace(filename, pages.getKeyByValue(filename));
        } else if (lang === 'german' && pages[filename]) {
            window.location = url.replace(filename, pages[filename]);
        }
    };

    var en = document.getElementById('english');
    var de = document.getElementById('german');
    var url = window.location.toString();
    var filename = url.substring(url.lastIndexOf('/')-3);
    //Checks if page is written in English or German
    //pages[filename] === English
    //pages.getKeyByValue(filename) === German
    if (pages[filename]) {
        //If it's an English page, disables clicking on English link
        en.onclick = function() {return false;};
        addEvent(de, 'click', function() { switchUrl(de.id, url, filename); });
   } else if (pages.getKeyByValue(filename)) {
        //If it's a German page, disables clicking on German link
        de.onclick = function() {return false;};
        addEvent(en, 'click', function() { switchUrl(en.id, url, filename); });
   }

})();

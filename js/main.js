(function() {

    var removeFlags = function() {
        var removeElement = function(element) {
            element.parentNode.removeChild(element);
        };
        var lang_div = document.getElementById('languages');
        var links = lang_div.getElementsByTagName('a');
        for (var i = links.length-1; i >= 0; --i) {
            removeElement(links[i]);
        }
    };

    var imageMarkup= function(file, alt) {
        var img= document.createElement('img');
        img.src = file;
        img.alt = alt;
        img.title = alt;
        return img;
    };

    var injectLinkedFlag = function(id, img) {
        var link = document.createElement('a');
        link.id = id;
        link.appendChild(img);
        document.getElementById('languages').appendChild(link);
    };

    removeFlags();
    var de_flag = imageMarkup('/img/german-flag.jpg', 'German flag');
    var en_flag = imageMarkup('/img/us-flag.jpg', 'U.S. Flag');
    injectLinkedFlag('german', de_flag);
    injectLinkedFlag('english', en_flag);

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

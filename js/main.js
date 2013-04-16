//String formatting helper method
//See http://stackoverflow.com/a/4256130
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

/*(function() {
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
        if (!Object.keys) Object.keys = function(o) {
            if (o !== Object(o))
                throw new TypeError('Object.keys called on a non-object');
            var k=[],p;
            for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
            return k;
        };
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
        '/en/appointments.html': '/de/termine.html',
        '/en/appointments.html#forms': '/de/termine.html#fragebögen',
        '/en/workshops.html': '/de/workshops.html',
        '/en/workshops.html#past': '/de/workshops.html#frühere',
        '/en/about-acupuncture.html': '/de/über-akupunktur.html',
        '/en/about-acupuncture.html#videos': '/de/über-akupunktur.html#videos',
        '/en/about-acupuncture.html#readings': '/de/über-akupunktur.html#artikel-und-bücher',
        '/en/about.html': '/de/über.html',
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

    removeChildrenByTag('languages', 'a');
    injectLinkedFlag(english, en_flag);
    injectLinkedFlag(german, de_flag);

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

})();*/

$(document).ready(function() {
var url = String("https://www.google.com/calendar/feeds/40os2gpcsv7id9dnplnkbvqb7k%40group.calendar.google.com/public/full?orderby=starttime&ascending&alt=json");
var allPanels = $('.accordion > dd').hide();
var allTitles= $('.accordion > dt > a');

    //Delete "Turn on Javascript" warning
    $(".warning").remove();

    //Returns the complete markup for an event
    var event = function(title, new_date, location, description) {
        return '<div class="event">{0} {1} {2} {3}</div>'.format(title, new_date, location, description);
    };

    //Get Google Calendar Events
    $.getJSON(url, function(data) {
        //Using a try...catch...finally because if data.feed.entry is empty, it breaks horribly with a TypeError
        try {
            $.each(data.feed.entry, function(i, item) {
                var title = "<h3>{0}</h3>".format(item.title.$t);
                var date = new Date(item.gd$when[0].startTime);
                var today = new Date();
                var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                var new_date = "<p>When: {0}, {1} {2}, {3}</p>".format(days[date.getDay()], months[date.getMonth()], date.getDate(), date.getFullYear());
                var location = "<p>Where: {0}</p>".format(item.gd$where[0].valueString);
                var description = "<p>Description: {0}</p>".format(item.content.$t);

                // Limit the number displayed on the page to 10
                if (i < 10) {
                    if (date < today) {
                        $(".past-events").append(event(title, new_date, location, description));
                    } else {
                        //Prepend + insertAfter methods to display soonest upcoming event first
                        $(".future-events").prepend(function() {
                            $(event(title, new_date, location, description)).insertAfter($(".future-events > h1"));
                        });
                    }
                }
            });
        } catch(e) {
            //Still log the error
            console.log(e);
        } finally {
            var future_events = (function() {
                var length = $(".future-events").children("div").length;
                return length;
            })();

            var past_events = (function() {
                var length = $(".past-events").children("div").length;
                return length;
            })();

            //Grab number of events within in future-events and if none, display message
            if (future_events === 0) {
                $(".future-events").append("<p>There are no upcoming workshops or seminars. Check back soon.</p>");
            }

            //Grab number of events within in past-events and if none, display message
            if (past_events === 0) {
                $(".past-events").append("<p>There are no past workshops or seminars.</p>");
            }
        }
    });
    $('.accordion > dt > a').click(function() {
        $this = $(this);
        $target =  $this.parent().next();
        if ($this.hasClass('expand')) {
            allTitles.removeClass('contract');
            allTitles.addClass('expand');
            $this.removeClass('expand');
            $this.addClass('contract');
        }
        else if ($this.hasClass('contract')) {
            $this.removeClass('contract');
            $this.addClass('expand');
        }
        if (!$target.hasClass('active')) {
            allPanels.removeClass('active').slideUp();
            $target.addClass('active').slideDown();
        }
        else if ($target.addClass('active')) {
            $target.removeClass('active').slideUp();
        }
        return false;
    });
});

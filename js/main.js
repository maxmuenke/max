(function() {
    var main = document.getElementById('main');
    main.style.height = window.innerHeight - 279 + 'px';

    window.onresize = function() {
        document.body.style.overflow = 'hidden';
        main.style.height = window.innerHeight - 279 + 'px';
        document.body.style.overflow = 'visible';
    };

})();

// Can use this to set #main to the length of text
// main.style.height = main.scrollHeight + 'px';
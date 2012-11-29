(function() {
    var window_size = null;
    var getDocHeight = function() {
        return Math.max(
            Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
            Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
            Math.max(document.body.clientHeight, document.documentElement.clientHeight)
        );
    };

    var setMainHeight = function() {
        var window_size = getDocHeight() - 160 +'px';
        return document.getElementById('main').style.height = window_size;
    };

    setMainHeight();

    window.onresize = function() {
        setMainHeight();
    };

})();
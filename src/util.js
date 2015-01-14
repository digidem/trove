Trove.util = {};

Trove.util.gif = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';

Trove.util.prefixDOMProperty = function(property) {
    var prefixes = ['webkit', 'ms', 'moz', 'o'],
        i = -1,
        n = prefixes.length,
        s = document.body;

    if (property in s)
        return property;

    property = property.substr(0, 1).toUpperCase() + property.substr(1);

    while (++i < n)
        if (prefixes[i] + property in s)
            return prefixes[i] + property;

    return false;
};

Trove.util.prefixCSSProperty = function(property) {
    var prefixes = ['webkit', 'ms', 'Moz', 'O'],
        i = -1,
        n = prefixes.length,
        s = document.body.style;

    if (property.toLowerCase() in s)
        return property.toLowerCase();

    while (++i < n)
        if (prefixes[i] + property in s)
            return '-' + prefixes[i].toLowerCase() + property.replace(/([A-Z])/g, '-$1').toLowerCase();

    return false;
};

Trove.util.sanitize = function(s) {
    return s.replace(/[^a-z0-9\.]/gi, '_').toLowerCase();
};

Trove.util.subclass = (function() {
    return {}.__proto__ ?
    // Until ECMAScript supports array subclassing, prototype injection works well. 
    // See http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/

    function(object, prototype) {
        object.__proto__ = prototype;
    } :

    // And if your browser doesn't support __proto__, we'll use direct extension.

    function(object, prototype) {
        for (var property in prototype) object[property] = prototype[property];
    };
})();

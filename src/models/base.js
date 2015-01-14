// Base class inherited by other core classes
Trove.Base = function () {};

Trove.Base.prototype = {

    // Copies this 'on' method from d3_dispatch to the prototype
    on: function() { 
        var value = this.event.on.apply(this.event, arguments);
        return value === this.event ? this : value;
    }

};
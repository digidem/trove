// Collection of media items

Trove.MediaCollection = function() {
    if (!(this instanceof Trove.MediaCollection))
        return new Trove.MediaCollection();

    var arr = [];
    Trove.util.subclass(arr, Trove.MediaCollection.prototype);

    _.extend(arr, {
        _store: null,
        // Add any custom events as arguments to d3.dispatch
        event: d3.dispatch('changed')
    });

    return arr;
};  

// A collection is an instance of an array, also mixin methods of Trove.Base()
Trove.MediaCollection.prototype = Object.create(_.extend(Object.create(Array.prototype), Trove.Base.prototype));

_.extend(Trove.MediaCollection.prototype, {

    model: Trove.MediaItem,

    store: function(_) {
        if (!arguments.length) return _store;
        var self = this;
        this._store = _;
        this._store.on('progress', function(data) {
            self.add.call(self, data);
        });
        return this;
    },

    sync: function() {
        this._store && this._store.sync();
        return this;
    },

    add: function(data) {
        if (!(data instanceof Array)) data = [data];

        data.forEach(function(d) {
            if (!(d instanceof this.model)) {
                d = this.model()
                    .url(d.url)
                    .size(d.size)
                    .on('changed', this.event.changed);
            }

            this.push(d);
        }, this);

        this.event.changed();
    }
});
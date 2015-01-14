// Single MediaItem (image or video)

Trove.MediaItem = function() {
    if (!(this instanceof Trove.MediaItem))
        return new Trove.MediaItem();

    this._url = null;
    this._size = null;

    // Add any custom events as arguments to d3.dispatch
    this.event = d3.dispatch('changed');
};

Trove.MediaItem.prototype = Object.create(Trove.Base.prototype);

_.extend(Trove.MediaItem.prototype, {
    url: function(_) {
        if (!arguments.length) return this._url;
        this._url = _;
        this.event.changed(this);
        return this;
    },

    size: function(_) {
        if (!arguments.length) return this._size;
        this._size = _;
        return this;
    }
});
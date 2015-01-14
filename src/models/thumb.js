// Single Thumb (image or video)

Trove.Thumb = function() {
    if (!(this instanceof Trove.Thumb))
        return new Trove.Thumb();

    this._url = null;
    this._el = null;
    this._d = null;

    // Add any custom events as arguments to d3.dispatch
    this.event = d3.dispatch('changed');

    return this;
};

Trove.Thumb.prototype = Object.create(Trove.Base.prototype);

_.extend(Trove.Thumb.prototype, {
    url: function(_) {
        if (!arguments.length) return this._url;
        this._url = _;
        this.event.changed(this);
        return this;
    },

    el: function(_) {
        if (!arguments.length) return this._el;
        this._el = _;
        return this;
    },

    d: function(_) {
        if (!arguments.length) return this._d;
        this._d = _;
        return this;
    },

    id: function() {
        return this._d.url();
    }
});
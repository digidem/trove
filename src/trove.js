// Trove container object

window.Trove = function(options) {
    var context = {};

    var ui = Trove.ui(context);

    var mediaStore = Trove.MediaStore(context)
        .url(options.url)
        .auth(options.auth);

    var mediaCollection = Trove.MediaCollection(context)
        .store(mediaStore)
        .sync();

    var grid = Trove.ui.Grid(context);

    var thumbnails = Trove.Thumbnails();

    context.thumbnails = function() { return thumbnails; };
    context.grid = function() { return grid; };
    context.mediaCollection = function() { return mediaCollection; };
    context.ui = function() { return ui; };

    context.container = function(_) {
        if (!arguments.length) return container;
        container = _;
        container.classed('trove-container', true);
        return context;
    };

    return context;
};


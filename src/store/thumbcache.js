// Thumbnail cache

Trove.Thumbnails = function(context) {
    var timeout,
        fileStorage,
        thumbSize = 400,
        thumbQuality = 0.3,
        concurrency = 4,
        thumbsById = {},
        queued = {};

    var store = Trove.FileStorage();

    var q = async.queue(getThumbUrl, concurrency);

    q.pause();

    store.init(1024 * 1024 * 256, function(err) {
        console.log(err, "queue resuming");
        if (!err) q.resume();
    });

    var canvi = [];

    for (var i = 0; i < concurrency; i++) {
        canvi[i] = {};
        canvi[i] = document.createElement('canvas');
        canvi[i].width = thumbSize;
        canvi[i].height = thumbSize;
    }

    d3.select(window).on('scroll.thumbcache', function() {
        if (timeout) window.clearTimeout(timeout);
        q.pause();
        timeout = window.setTimeout(function() {
            q.resume();
            timeout = null;
        }, 100);
    });

    // returns a blob of the thumb

    function createThumb(url, callback) {
        var i = 0;
        var canvas;
        var ctx;

        do {
            if (!canvi[i].__inuse__) canvas = canvi[i];
            i++;
        } while (!canvas);

        canvas.__inuse__ = true;
        ctx = canvas.getContext('2d');

        var img = new Image();

        img.crossOrigin = 'anonymous';

        img.onload = function(e) {
            var w = this.width,
                h = this.height,
                sx = w > h ? (w - h) / 2 : 0,
                sy = w < h ? (h - w) / 2 : 0,
                sw = Math.min(w, h);

            this.onload = null;

            ctx.drawImage(this, sx, sy, sw, sw, 0, 0, thumbSize, thumbSize);

            canvas.toBlob(function(blob) {
                canvas.__inuse__ = false;
                callback(null, blob);
            }, 'image/jpeg', thumbQuality);
        };

        img.src = url;
    }

    function getThumbUrl(thumb, callback) {
        var imageUrl = thumb.d().url();

        store.getFileSystemURL(imageUrl, function(err, url) {
            if (!err) {
                cb(null, url);
            } else {
                createThumb(imageUrl, function(err, blob) {
                    store.saveBlob(imageUrl, blob, cb);
                });
            }
        });

        function cb(err, url) {
            thumb.url(url);
            callback(err, thumb);
        }
    }

    return {
        set: function(d) {
            if (thumbsById[d.url()]) {
                thumb = thumbsById[d.url()].el(this);
            } else {
                thumb = Trove.Thumb().el(this).d(d);
                thumbsById[thumb.id()] = thumb;
            }

            var url = thumb.url();
            if (url) {
                var el = thumb.el();
                if (el.getAttribute('src') !== url) el.setAttribute('src', url);
            } else if (!queued[thumb.id()]) {
                q.unshift(thumb, function(err, thm) {
                    if (err) console.log(err);
                    if (thm.el()) thm.el().src = thm.url();
                    delete queued[thm.id()];
                });
                queued[thumb.id()] = true;
            }
        },

        unset: function(d) {
            if (thumbsById[d.url()]) {
                thumbsById[d.url()].el(null);
            }
        }
    };
};

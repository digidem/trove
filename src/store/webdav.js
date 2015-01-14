// MediaStore for webdav backend

Trove.MediaStore = function(context) {
    var mediaStore = {},
        url,
        user,
        password,
        imageRegex = /.*\.jpg$/gi,
        event = d3.dispatch('progress');

    var q = async.queue(rreaddir, 4);

    function rreaddir(url, callback) {
        url = url.replace(/\/?$/, '/');
        var xhr = d3.xhr(url)
            .header('Depth', '1')
            .send('PROPFIND', function(err, res) {
                processProps(err, res, callback);
            });
    }

    function processProps(err, res, callback) {
        if (err) throw err;

        var items = res.responseText.split('</D:propstat>');

        var images = [];
        var folders = [];
        var urlRe = /<D:href>(.*)<\/D:href>/;

        for (var i = 0, n = items.length; ++i < n;) {
            if (/<D:getcontenttype>image/.test(items[i])) {
                images.push({
                    url: items[i].match(urlRe)[1],
                    size: items[i].match(/<D:getcontentlength>(.*)<\/D:getcontentlength>/)[1]
                });
            } else if (/<D:resourcetype><D:collection/.test(items[i])) {
                folders.push(items[i].match(urlRe)[1]);
            }
        }

        callback(images);
        q.push(folders, event.progress);
    }

    mediaStore.sync = function(callback) {
        if (!url || !user || !password) return;
        q.push(url, event.progress);
    };

    mediaStore.url = function(_) {
        if (!arguments.length) return url;
        url = _;
        return mediaStore;
    };

    mediaStore.auth = function(options) {
        user = options.user;
        password = options.password;
        return mediaStore;
    };

    return d3.rebind(mediaStore, event, 'on');

};

// MediaStore FileSystem API backend

Trove.FileStorage = function() {
    var fileStorage;
    var fsRoot;

    function init(bytes, callback) {
        navigator.webkitPersistentStorage.requestQuota(bytes, function(grantedBytes) {
            window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, function(fs) {
                fsRoot = fs.root;
                callback(null);
            });
        }, callback);
    }

    function successCallback(callback) {
        return function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(null);
            callback.apply(this, args);
        };
    }

    function saveBlob(id, blob, callback) {
        filename = Trove.util.sanitize(id);
        var fileEntry;

        var fsOptions = {
            create: true,
            exclusive: false
        };

        async.waterfall([
            function(callback) {
                fsRoot.getFile(filename, fsOptions, successCallback(callback), callback);
            },
            function(fe, callback) {
                fileEntry = fe;
                fileEntry.createWriter(successCallback(callback), callback);
            },
            function(fileWriter, callback) {
                fileWriter.onwriteend = successCallback(callback);
                fileWriter.onerror = callback;
                fileWriter.write(blob);
            }
        ], function(err, evt) {
            if (err) console.log(err);
            callback(null, fileEntry.toURL());
        });
    }

    function getFileSystemURL(id, callback) {
        filename = Trove.util.sanitize(id);
        var fsOptions = { create: false };
        fsRoot.getFile(filename, fsOptions, function(fileEntry) {
            callback(null, fileEntry.toURL());
        }, callback);
    }

    return {
        init: init,
        saveBlob: saveBlob,
        getFileSystemURL: getFileSystemURL
    };
};

// Grid view of images
Trove.ui.Grid = function(context) {

    return function(selection) {
        var transformCSS = Trove.util.prefixCSSProperty('Transform');
        var buffer = 800;
        var maxImageSize = 200;
        var dimensions, imagesPerRow, imageSize;

        var mediaCollection = context.mediaCollection()
            .on('changed', render);

        d3.select(window)
            .on('scroll.grid', render)
            .on('resize.grid', setDimensions);

        setDimensions();

        function setDimensions() {
            dimensions = d3.select(document.body).dimensions();
            imagesPerRow = Math.ceil(dimensions[0] / maxImageSize);
            imageSize = dimensions[0] / imagesPerRow;
            selection.selectAll('div')
                .style(transformCSS, function(d, i) {
                    return 'translate3d(0,' + d.key * imageSize + 'px,0)';
                });
            selection.selectAll('img')
                .style('width', imageSize - 4 + 'px')
                .style('height', imageSize - 4 + 'px');
            render();
        }

        function render() {
            var scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            var count = Math.ceil((Math.max(dimensions[1], Math.min(0, buffer - scrollY)) + dimensions[1] + buffer) / imageSize);
            var offset = Math.floor(Math.max(0, scrollY - buffer) / imageSize);

            selection.style('height', function() {
                return Math.ceil(mediaCollection.length / imagesPerRow) * imageSize + 'px';
            });

            var nest = _.groupBy(mediaCollection, function(d, i) {
                return Math.floor(i / imagesPerRow);
            });

            nest = d3.entries(nest);

            var rows = selection.selectAll('div')
                .data(nest.slice(offset, offset + count), function(d) {
                    return d.key;
                });

            var exit = rows.exit();
            var enter = rows.enter();

            reuseNodes.call(enter, enter)
                .attr('class', 'row')
                .style('position', 'absolute')
                .style('width', '100%')
                .style(transformCSS, function(d, i) {
                    return 'translate3d(0,' + d.key * imageSize + 'px,0)';
                });

            exit.remove();

            var images = rows.selectAll('img')
                .data(function(d) {
                    return d.value;
                });

            images.enter()
                .append('img')
                .attr('src', Trove.util.gif)
                .attr('class', 'thumb')
                .style('width', imageSize - 4 + 'px')
                .style('height', imageSize - 4 + 'px')
                .style('border', '2px solid white');

            images
                .each(context.thumbnails().set)
                .on('load', function() {
                    d3.select(this)
                        .transition()
                        .style('opacity', 1);
                });

            images.exit()
                .remove();

            function reuseNodes() {
                return this.select(function() {
                    var reusableNode;
                    for (var i = -1, n = exit[0].length; ++i < n;) {
                        if (reusableNode = exit[0][i]) {
                            exit[0][i] = undefined;
                            d3.select(reusableNode)
                                .selectAll('img')
                                .style('opacity', 0);
                            return reusableNode;
                        }
                    }
                    return this.appendChild(document.createElement('div'));
                });
            }
        }
    };
};

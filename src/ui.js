Trove.ui = function(context) {
    return function(container) {
        context.container(container);
        var grid = context.grid();
        container.append('div')
            .attr('class', 'grid')
            .call(grid);
    };
};
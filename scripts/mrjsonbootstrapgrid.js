(function ($) {

    $.fn.mrjsonbootstrapgridcolumn = function (options) {
        return $.extend({}, $.fn.mrjsonbootstrapgridcolumn.defaults, options);
    };

    $.fn.mrjsonbootstrapgridcolumn.defaults = {
        heading: "Heading",
        classname: "",
        data: "json_field",
        dataType: 'string',
        type: "column",
        showText: true,
        columns: [],
        sizes: [],
        rowOptions: []
    };

    $.fn.mrjsonbootstrapgrid = function (options) {

        var setupColumn = function($row, item) {
            if(item.sizes.length > 0) {
                var $col = null;
                if (item.type == 'row' && item.columns.length > 0) {
                    $col = $('<div>').addClass('row');
                    item.columns.forEach(function (column) {
                        setupColumn($col, column);
                    });
                } else if (item.type == 'column') {
                    var $col = $('<div>');
                    $col.html(item.heading);
                }
                $col.addClass(item.classname);
                item.sizes.forEach(function (size) {
                    $col.addClass('col-' + size.type + '-' + size.size);
                });
                $col.appendTo($row);
            }
        };

        var setupRow = function($row, columns, item) {
            var forColumn = function($colRow, column) {
                if(column.sizes.length > 0) {
                    var $col = null;
                    if (column.type == 'row' && column.columns.length > 0) {
                        $col = $('<div>').addClass('row');
                        column.columns.forEach(function(col) {
                            forColumn($col, col);
                        });
                    } else if (column.type == 'column') {
                        var $col = $('<div>');
                        $col.html(item[column.data]);
                    }
                    $col.addClass(column.classname);
                    column.sizes.forEach(function (size) {
                        $col.addClass('col-' + size.type + '-' + size.size);
                    });
                    $col.appendTo($colRow);
                }
            };
            columns.forEach(function(column) { forColumn($row, column); });
        };

        var opts = $.extend({}, $.fn.mrjsonbootstrapgrid.defaults, options);

        var $mrjsonbootstrapgridContainer = $("<div>", { "data-so": "A", "data-ps": opts.pageSize }).addClass("mrjt");

        var $table = $("<div>").addClass('container-fluid').addClass(opts.tableOptions.additionalClass);

        var $thead = $("<div>").addClass('row');
        var headRowOption = (!!opts.rowOptions ? opts.rowOptions[0] : undefined);
        if(!!headRowOption) {
            if(headRowOption.classname) $thead.addClass(headRowOption.classname);
        }

        opts.columns.forEach(function(item) {
            setupColumn($thead, item);
        });

        if(opts.tableOptions.displayColumnHeaders) $thead.appendTo($table);

        opts.data.forEach(function (item, idx) {
            var $tr = $('<div>').addClass('row');
            var rowOption = (!!opts.rowOptions ? opts.rowOptions[idx + 1] : undefined);
            if(!!rowOption) {
                if(rowOption.classname) $tr.addClass(rowOption.classname);
            }
            setupRow($tr, opts.columns, item);
            $tr.appendTo($table);
        });

        $mrjsonbootstrapgridContainer.append($table);


        return this.append($mrjsonbootstrapgridContainer);
    };

    $.fn.mrjsonbootstrapgrid.defaults = {
        cssClass: "table",
        columns: [],
        data: [],
        pageSize: 10,
        tableOptions: {
            allowHideColumns: true,
            displayColumnHeaders: true,
            additionalClass: ""
        }
    };
}(jQuery));

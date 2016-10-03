
/**
 * an implementation of mrjsontable that uses bootstrap grid rather than an html table.
 *
 * Columns are defined by the user, explicitly setting the number of bootstrap grid columns to give to each and every column.
 *
 * example column definition:
 *
 * var columnsExample = [
     {
         type: "row",
         sizes: [ { type: "sm", size: "6" } ],
         columns: [
             { type: "column", sizes: [ { type: "sm", size: "3" } ], heading: '', data: 'header', dataType: 'string', classname: 'side-header' },
             { type: "column", sizes: [ { type: "sm", size: "3" } ], heading: 'Column 1', data: 'col1', dataType: 'string', classname: 'column-1' },
             { type: "column", sizes: [ { type: "sm", size: "3" } ], heading: 'Column 2', data: 'col2', dataType: 'string', classname: 'column-2' },
             { type: "column", sizes: [ { type: "sm", size: "3" } ], heading: 'Column 3', data: 'col3', dataType: 'string', classname: 'column-3' }
         ]
     },
     {
         type: 'row',
         sizes: [ { type: 'sm', size: '6' }],
         columns: [
             { type: "column", sizes: [ { type: "sm", size: "3" } ], heading: 'Column 4', data: 'col4', dataType: 'string', classname: 'column-4' },
             { type: "column", sizes: [ { type: "sm", size: "3" } ], heading: 'Column 5', data: 'col5', dataType: 'string', classname: 'column-5' },
             { type: "column", sizes: [ { type: "sm", size: "3" } ], heading: 'Column 6', data: 'col6', dataType: 'string', classname: 'column-6' },
             { type: "column", sizes: [ { type: "sm", size: "3" } ], heading: 'Column 7', data: 'col7', dataType: 'string', classname: 'column-7' }
         ]
     }
 ];
 *
 *  The above example will create a column definition of 8 columns, evenly spaced accross all 12 bootstrap grid columns.
 */
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
        sizes: []
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
                    $('<span style="width:100%;height:100%;display:inline-block;">').html(item.heading).appendTo($col);
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
                        $('<span style="width:100%;height:100%;display:inline-block;">').text(item[column.data]).appendTo($col);
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

        opts.columns.forEach(function(item) {
            setupColumn($thead, item);
        });

        if(opts.tableOptions.displayColumnHeaders) $thead.appendTo($table);

        opts.data.forEach(function (item) {
            var $tr = $('<div>').addClass('row');
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

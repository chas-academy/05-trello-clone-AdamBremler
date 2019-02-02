import $ from 'jquery';
require('webpack-jquery-ui');

$.widget('jtrello.card', {
    options: {},
  
    _create: function() {
        this.element.draggable({
            helper: 'clone',
            appendTo: 'body',
            revert: function(event, ui) {
                return !event;
            },
            start: function(event, ui) {
                $('.ui-draggable-dragging').width($(this).width());
                $(this).hide();
            },
            stop: function(event, ui) {
                $(this).show();
            }
        });

        this._on(this.element, {
            click: 'displayDialog'
        });
    },

    displayDialog: function() {
        let dialog = this.options.infoDialog;

        dialog.dialog('option', 'title', this.element.find('.title').text());

        dialog.dialog('open');
    },

    _destroy: function() {
        this.element.remove();
    }
});

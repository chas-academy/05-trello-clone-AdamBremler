import $ from 'jquery';
require('webpack-jquery-ui');
import moment from 'moment';

$.widget('jtrello.card', {
    options: {
        description: '',
    },
  
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

        dialog.data('card', this);
        dialog.dialog('option', 'title', this.element.find('.title').text());
        dialog.find('.description').val(this.options.description);
        dialog.find('.datepicker').val(this.options.deadline.format('YYYY-MM-DD'));

        dialog.dialog('open');
    },

    _destroy: function() {
        this.element.remove();
    }
});

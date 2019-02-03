import $ from 'jquery';
import 'webpack-jquery-ui';
import moment from 'moment';
import 'wcolpick';
import '../../node_modules/wcolpick/wcolpick/wcolpick.css';

import '../../node_modules/jquery-ui/themes/base/all.css';
import '../css/styles.css';

import './widgets/list';
import './widgets/card';

/**
 * jtrello
 * @return {Object} [Publikt tillgänliga metoder som vi exponerar]
 */

// Här tillämpar vi mönstret reavealing module pattern:
const jtrello = (function() {
  "use strict";

  // Referens internt i modulen för DOM element
  let DOM = {};

  function captureDOMEls() {
    DOM.$board = $('.board');
    DOM.$listDialog = $('#list-creation-dialog');
    DOM.$cardInfoDialog = $('#card-info-dialog');
    DOM.$columns = $('.column');
    DOM.$lists = $('.list');
    DOM.$cards = $('.card');
    
    DOM.$newListButton = $('button#new-list');
    DOM.$deleteListButton = $('.list-header > button.delete');

    DOM.$newListForm = $('#list-creation-dialog form');
    DOM.$newCardForm = $('form.new-card');

    DOM.$cardTabs = $('#card-info-dialog-tabs');

    DOM.$cardDatepicker = $('#card-info-dialog .datepicker');

    DOM.$cardColorpicker = $('#card-info-dialog .colorpicker');
  }

  function createWidgets() {
    DOM.$cardInfoDialog.dialog({
      autoOpen: false,
      modal: true,
      buttons: [
        {
          text: 'Save',
          click: function() {
            let card = $(this).data('card');

            card.option('description', $(this).find('.description').val());
            
            let deadline = moment($(this).find('.datepicker').val());
            if(deadline.isValid()) {
              card.option('deadline', deadline);
            }

            card.option('color', DOM.$cardColorpicker.getColor('hex', false));
            card.element.css('background-color', '#' + card.options.color);

            $(this).dialog('close');
          }
        },
        {
          text: 'Cancel',
          click: function() {
            $(this).dialog('close');
          }
        }
      ],
      show: 'fade',
      hide: 'puff'
    });

    DOM.$listDialog.dialog({
      autoOpen: false,
      modal: true,
      buttons: [
        {
          text: 'Create',
          click: createList
        }
      ]
    });

    DOM.$cardTabs.tabs();

    DOM.$cardDatepicker.datepicker({ dateFormat: 'yy-mm-dd' });

    DOM.$cardColorpicker.loads({
      enableAlpha: false,
      compactLayout: true,
      layout: 'hex',
      variant: 'small'
    });

    DOM.$lists.list();
    DOM.$lists.each(function() {
      $(this).list('option', 'createCard', createCard);
    });
  }

  function bindEvents() {
    DOM.$newListButton.on('click', openListDialog);
    DOM.$newListForm.on('submit', createList);
  }

  function openListDialog() {
    DOM.$listDialog.dialog('open');
  }

  function createList(event) {
    event.preventDefault();
    
    let titleEl = DOM.$newListForm.find('input[name=title]');
    let title = titleEl.val();

    if(!title) {
      return;
    }

    let newList = $(`
      <div class="column">
        <div class="list">
          <div class="list-header">
            ${title}
            <button class="button delete">X</button>
          </div>
          <ul class="list-cards">
            <li class="add-new">
              <form class="new-card" action="index.html">
                  <input type="text" name="title" placeholder="Please name the card" required />
                  <button class="button add">Add new card</button>
              </form>
            </li>
          </ul>
        </div>
      </div>
    `);

    let newListEl = newList.find('.list');

    newListEl.list();
    newListEl.list('option', 'createCard', createCard);

    DOM.$lists.push(newListEl);

    DOM.$columns.push(newList);
    $('.column').last().before(newList);

    titleEl.val('');
    DOM.$listDialog.dialog('close');
  }

  function createCard(event) {
    event.preventDefault();

    let titleEl = $(event.target).find('input[name=title]');

    let newCard = $(`
      <li class="card">
        <span class="title">${titleEl.val()}</span>
        <button class="button delete">X</button>
      </li>
    `);
    
    $(event.target).parent().before(newCard);

    newCard.card();

    newCard.card('option', 'infoDialog', DOM.$cardInfoDialog);
    // Default deadline is one week from now
    newCard.card('option', 'deadline', moment().add(1, 'week'));

    DOM.$cards.push(newCard);

    titleEl.val('');
  }

  // Init metod som körs först
  function init() {
    console.log(':::: Initializing JTrello ::::');
    captureDOMEls();
    createWidgets();

    bindEvents();
  }

  return {
    init: init
  };
})();

//usage
$("document").ready(function() {
  jtrello.init();
});

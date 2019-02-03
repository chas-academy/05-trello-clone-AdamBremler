import $ from 'jquery';
require('webpack-jquery-ui');
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
// Mer information om det mönstret här: https://bit.ly/1nt5vXP
const jtrello = (function() {
  "use strict"; // https://lucybain.com/blog/2014/js-use-strict/

  // Referens internt i modulen för DOM element
  let DOM = {};

  /* =================== Privata metoder nedan ================= */
  function captureDOMEls() {
    DOM.$board = $('.board');
    DOM.$listDialog = $('#list-creation-dialog');
    DOM.$cardInfoDialog = $('#card-info-dialog');
    DOM.$columns = $('.column');
    DOM.$lists = $('.list');
    DOM.$cards = $('.card');
    
    DOM.$newListButton = $('button#new-list');
    DOM.$deleteListButton = $('.list-header > button.delete');

    DOM.$newCardForm = $('form.new-card');

    DOM.$cardTabs = $('#card-info-dialog-tabs');

    DOM.$cardDatepicker = $('#card-info-dialog .datepicker');

    DOM.$cardColorpicker = $('#card-info-dialog .colorpicker');
  }

  function createTabs() {}
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

    DOM.$cardTabs.tabs();

    DOM.$cardDatepicker.datepicker({ dateFormat: 'yy-mm-dd' });

    DOM.$cardColorpicker.loads({
      enableAlpha: false,
      compactLayout: true,
      layout: 'hex',
      variant: 'small'
    });

    DOM.$lists.list();
  }

  /*
  *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
  *  createList, deleteList, createCard och deleteCard etc.
  */
  function bindEvents() {
    DOM.$newListButton.on('click', createList);
    DOM.$deleteListButton.on('click', deleteList);

    DOM.$newCardForm.on('submit', createCard);
  }

  /* ============== Metoder för att hantera listor nedan ============== */
  function createList() {
    event.preventDefault();
    console.log("This should create a new list");
  }

  function deleteList() {
    $(this).closest('.list').data('jtrello-list').remove();
  }

  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(event) {
    event.preventDefault();

    let titleEl = $(event.target).find('[name=title]');

    let newCard = $(`
      <li class="card">
        <span class="title">${titleEl.val()}</span>
        <button class="button delete">X</button>
      </li>
    `);
    
    $(this).parent().before(newCard);

    newCard.card();

    newCard.card('option', 'infoDialog', DOM.$cardInfoDialog);
    // Default deadline is one week from now
    newCard.card('option', 'deadline', moment().add(1, 'week'));

    DOM.$cards.push(newCard);

    titleEl.val('');
  }

  function deleteCard() {
    $(this).closest('.card').card('remove');
  }

  // Metod för att rita ut element i DOM:en
  function render() {}

  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    console.log(':::: Initializing JTrello ::::');
    // Förslag på privata metoder
    captureDOMEls();
    createTabs();
    createWidgets();

    bindEvents();
  }

  // All kod här
  return {
    init: init
  };
})();

//usage
$("document").ready(function() {
  jtrello.init();
});

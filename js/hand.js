class Hand {

  constructor() {
    this.cardsInHand = {};
  }

  addCard(card) {
    if (this._canAdd(card)) {
      this.cardsInHand[card.id] = new CardInHand(card);
      return true;
    }
    return false;
  }

  _canAdd(newCard) {
    if (this.cardsInHand[newCard.id] !== undefined || this.size() > this._defaultLimit()) {
      return false;
    } else if (this.size() < this._limitWithoutNecromancer()) {
      return true;
    } else if (![NECROMANCER, CH_NECROMANCER].includes(newCard.id) && newCard.extraCard) {
      return true;
    } else if (this.containsId(NECROMANCER) || newCard.id === NECROMANCER) {
      var targetFound = false;
      for (const card of this.cards()) {
        if (card.card.id !== NECROMANCER && deck.getCardById(NECROMANCER).relatedSuits.includes(card.card.suit)) {
          targetFound = true;
        }
      }
      return targetFound || this.containsId(NECROMANCER) && deck.getCardById(NECROMANCER).relatedSuits.includes(newCard.suit);
    } else if (this.containsId(CH_NECROMANCER) || newCard.id === CH_NECROMANCER) {
      var targetFound = false;
      for (const card of this.cards()) {
        if (card.card.id !== CH_NECROMANCER && deck.getCardById(CH_NECROMANCER).relatedSuits.includes(card.card.suit)) {
          targetFound = true;
        }
      }
      return targetFound || this.containsId(CH_NECROMANCER) && deck.getCardById(CH_NECROMANCER).relatedSuits.includes(newCard.suit);
    } else {
      return false;
    }
  }

  _normalizeId(id) {
    if (id.match(/^[0-9+]+$/)) {
      return 'FR' + id.padStart(2, '0');
    }
    return id;
  }

  deleteCardById(id) {
    delete this.cardsInHand[this._normalizeId(id)];
  }

  getCardById(id) {
    return this.cardsInHand[this._normalizeId(id)];
  }

  contains(cardName) {
    for (const card of this.nonBlankedCards()) {
      if (card.name === cardName) {
        return true;
      }
    }
    return false;
  }

  containsId(cardId) {
    cardId = this._normalizeId(cardId);
    return this.cardsInHand[cardId] !== undefined && !this.cardsInHand[cardId].blanked;
  }

  containsSuit(suitName) {
    for (const card of this.nonBlankedCards()) {
      if (card.suit === suitName) {
        return true;
      }
    }
    return false;
  }

  containsSuitExcluding(suitName, excludingCardId) {
    for (const card of this.nonBlankedCards()) {
      if (card.suit === suitName && card.id !== excludingCardId) {
        return true;
      }
    }
    return false;
  }

  countSuit(suitName) {
    var count = 0;
    for (const card of this.nonBlankedCards()) {
      if (card.suit === suitName) {
        count++;
      }
    }
    return count;
  }

  countSuitExcluding(suitName, excludingCardId) {
    var count = 0;
    for (const card of this.nonBlankedCards()) {
      if (card.suit === suitName && card.id !== excludingCardId) {
        count++;
      }
    }
    return count;
  }

  nonBlankedCards() {
    return this.cards().filter(function(card) {
      return !card.blanked;
    });
  }

  cards() {
    return Object.values(this.cardsInHand);
  }

  cardNames() {
    return this.cards().map(function(card) {
      return card.name;
    });
  }

  score(discard) {
    var score = 0;
    this._resetHand();
    this._performCardActions();
    this._clearPenalties();
    this._applyBlanking();
    for (const card of this.nonBlankedCards()) {
      score += card.score(this, discard);
    }
    return score;
  }

  _resetHand() {
    for (const card of this.cards()) {
      this.cardsInHand[card.id] = new CardInHand(card.card, card.actionData);
    }
  }

  _performCardActions() {
    for (const cardAction of ACTION_ORDER) {
      var actionCard = this.getCardById(cardAction);
      if (actionCard !== undefined) {
        actionCard.performCardAction(this);
      }
    }
  }

  _clearPenalties() {
    for (const card of this.cards()) {
      if (card.clearsPenalty !== undefined) {
        for (const target of this.cards()) {
          if (card.clearsPenalty(target)) {
            target.penaltyCleared = true;
          }
        }
      }
    }
  }

  _applyBlanking() {
    // Demon blanking takes place before any other blanking
    if (this.containsId(CH_DEMON)) {
      const demon = this.getCardById(CH_DEMON);
      if (!demon.penaltyCleared) {
        for (const target of this.cards()) {
          if (demon.blanks(target, this) && !this._cannotBeBlanked(target)) {
            target.blanked = true;
          }
        }
      }
    }
    for (const card of this.nonBlankedCards()) {
      if (card.id !== CH_DEMON && card.blanks !== undefined && !card.penaltyCleared && !this._cardBlanked(card)) {
        for (const target of this.cards()) {
          if (card.blanks(target, this) && !this._cannotBeBlanked(target)) {
            target.blanked = true;
          }
        }
      }
    }
    for (const card of this.nonBlankedCards()) {
      if (card.blankedIf !== undefined && !card.penaltyCleared) {
        if (card.blankedIf(this) && !this._cannotBeBlanked(target)) {
          card.blanked = true;
        }
      }
    }
  }

  // a card that is blanked by another card cannot blank other cards,
  // except when they blank eachother
  _cardBlanked(card) {
    for (const by of this.nonBlankedCards()) {
      if (by.blanks !== undefined && !by.penaltyCleared) {
        if (by.blanks(card, this) && !card.blanks(by, this)) {
          return true;
        }
      }
    }
    return false;
  }

  _cannotBeBlanked(card) {
    return (card.suit === 'Undead' && (this.containsId(CH_LICH) || this.containsId(CH_NECROMANCER)))
      || card.id === CH_ANGEL
      || (card.magic && this.containsId(CH_ANGEL) && this.getCardById(CH_ANGEL).actionData[0] === card.id);
  }

  clear() {
    this.cardsInHand = {};
  }

  size() {
    return Object.keys(this.cardsInHand).length;
  }

  limit() {
    var limit = this._defaultLimit();
    for (const card of this.nonBlankedCards()) {
      if (card.extraCard) {
        limit++;
        break;
      }
    }
    return limit;
  }

  _defaultLimit() {
    return 7 + (cursedHoardSuits ? 1: 0);
  }

  _limitWithoutNecromancer() {
    var limit = this._defaultLimit();
    for (const card of this.nonBlankedCards()) {
      if (card.extraCard && ![NECROMANCER, CH_NECROMANCER].includes(card.id)) {
        limit++;
        break;
      }
    }
    return limit;
  }

  toString() {
    var stringValue = Object.keys(this.cardsInHand).join();
    var actions = [];
    for (const card of this.cards()) {
      if (card.actionData !== undefined) {
        actions.push(card.id + ':' + card.actionData.join(':'));
      }
    }
    return Object.keys(this.cardsInHand).join() + '+' + actions.join();
  }

  loadFromString(string) {
    var parts = string.split('+');
    var cardIds = parts[0].split(',');
    var cardActions = parts[1].split(',').map(action => action.split(':'));
    this.loadFromArrays(cardIds, cardActions);
  }

  loadFromArrays(cardIds, cardActions) {
    this.clear();
    for (const cardId of cardIds) {
      this.addCard(deck.getCardById(cardId));
    }
    for (const cardAction of cardActions) {
      if (cardAction.length > 1) {
        var cardId = this._normalizeId(cardAction[0]);
        var action = cardAction.slice(1);
        var actionCard = this.getCardById(cardId);
        this.cardsInHand[cardId] = new CardInHand(actionCard.card, action);
      }
    }
  }

  undoCardAction(id) {
    var actionCard = this.getCardById(id);
    this.cardsInHand[id] = new CardInHand(actionCard.card, undefined);
  }

}

var hand = new Hand();

class CardInHand {

  constructor(card, actionData) {
    this.card = card;
    this.actionData = actionData;
    // TODO: is there a better way to copy these properties
    this.id = card.id;
    this.name = card.name;
    this.suit = card.suit;
    this.strength = card.strength;
    this.bonus = card.bonus;
    this.penalty = card.penalty;
    this.bonusScore = card.bonusScore;
    this.penaltyScore = card.penaltyScore;
    this.blanks = card.blanks;
    this.blankedIf = card.blankedIf;
    this.clearsPenalty = card.clearsPenalty;
    this.action = card.action;
    this.relatedSuits = card.relatedSuits;
    this.relatedCards = card.relatedCards;
    this.extraCard = card.extraCard;
    this.referencesPlayerCount = card.referencesPlayerCount;
    this.referencesDiscardArea = card.referencesDiscardArea;

    this.blanked = false;
    this.penaltyCleared = false;
    this.penaltyPoints = 0;
    this.bonusPoints = 0;
    this.magic = false;
  }

  performCardAction(hand) {
    if (this.actionData !== undefined) {
      if (this.id === BOOK_OF_CHANGES) {
        var target = hand.getCardById(this.actionData[0]);
        if (target === undefined) {
          this.actionData = undefined;
        } else {
          var suit = this.actionData[1];
          target.suit = suit;
          target.magic = true;
        }
      } else if ([SHAPESHIFTER, CH_SHAPESHIFTER, MIRAGE, CH_MIRAGE].includes(this.id)) {
        var selectedCard = deck.getCardById(this.actionData[0]);
        this.name = selectedCard.name;
        this.suit = selectedCard.suit;
        this.magic = true;
      } else if (this.id === DOPPELGANGER) {
        var selectedCard = hand.getCardById(this.actionData[0]);
        if (selectedCard === undefined) {
          this.actionData = undefined;
        } else {
          this.name = selectedCard.name;
          this.suit = selectedCard.suit;
          this.strength = selectedCard.strength;
          this.penalty = selectedCard.penalty;
          this.penaltyScore = selectedCard.penaltyScore;
          this.blanks = selectedCard.blanks;
          this.blankedIf = selectedCard.blankedIf
          this.magic = true;
        }
      } else if (this.id === ISLAND) {
        var selectedCard = hand.getCardById(this.actionData[0]);
        if (selectedCard === undefined || !(selectedCard.suit === 'Flood' || selectedCard.suit === 'Flame')) {
          this.actionData = undefined;
        } else {
          this.clearsPenalty = function(card) {
            return card.id === selectedCard.id;
          }
          selectedCard.magic = true;
        }
      } else if (this.id === CH_ANGEL) {
        var selectedCard = hand.getCardById(this.actionData[0]);
        selectedCard.magic = true;
      }
    }
  }

  score(hand, discard) {
    if (this.blanked) {
      return 0;
    }
    if (this.bonusScore !== undefined) {
      this.bonusPoints = this.bonusScore(hand, discard);
    } else {
      this.bonusPoints = 0;
    }
    if (this.penaltyScore !== undefined && !this.penaltyCleared) {
      this.penaltyPoints = this.penaltyScore(hand, discard);
    } else {
      this.penaltyPoints = 0;
    }
    return this.strength + this.bonusPoints + this.penaltyPoints;
  }

  points() {
    return this.blanked ? 0 : (this.strength + this.bonusPoints + this.penaltyPoints);
  }

}

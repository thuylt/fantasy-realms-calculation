var base = {
  'FR01': {
    id: 'FR01',
    suit: 'Land',
    name: 'Ngọn núi',
    strength: 9,
    bonus: 'THƯỞNG: +50 nếu có đủ hai lá <span class="weather">Khói</span> và <span class="flame">Cháy rừng</span>. <br />XOÁ toàn bộ phạt của <span class="flood">LŨ LỤT</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Khói') && hand.contains('Cháy rừng') ? 50 : 0;
    },
    clearsPenalty: function(card) {
      return card.suit === 'Flood';
    },
    relatedSuits: ['Flood'],
    relatedCards: ['Khói', 'Cháy rừng']
  },
  'FR02': {
    id: 'FR02',
    suit: 'Land',
    name: 'Hang động',
    strength: 6,
    bonus: 'THƯỞNG: +25 nếu có lá <span class="army">Bộ binh người lùn</span> hoặc <span class="beast">Rồng</span>. <br />XOÁ toàn bộ phạt của <span class="weather">THỜI TIẾT</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Bộ binh người lùn') || hand.contains('Rồng') ? 25 : 0;
    },
    clearsPenalty: function(card) {
      return card.suit === 'Weather';
    },
    relatedSuits: ['Weather'],
    relatedCards: ['Bộ binh người lùn', 'Rồng']
  },
  'FR03': {
    id: 'FR03',
    suit: 'Land',
    name: 'Tháp chuông',
    strength: 8,
    bonus: 'THƯỞNG: +15 nếu có <span class="wizard">PHÁP SƯ</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.containsSuit('Wizard') ? 15 : 0;
    },
    relatedSuits: ['Wizard'],
    relatedCards: []
  },
  'FR04': {
    id: 'FR04',
    suit: 'Land',
    name: 'Rừng rậm',
    strength: 7,
    bonus: 'THƯỞNG: +12 cho mỗi lá <span class="beast">QUÁI THÚ</span> và <span class="army">Cung thủ Elven</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return 12 * hand.countSuit('Beast') + (hand.contains('Cung thủ Elven') ? 12 : 0);
    },
    relatedSuits: ['Beast'],
    relatedCards: ['Cung thủ Elven']
  },
  'FR05': {
    id: 'FR05',
    suit: 'Land',
    name: 'Nguyên tố đất',
    strength: 4,
    bonus: 'THƯỞNG: +15 cho mỗi lá <span class="land">ĐỊA HÌNH</span> khác.',
    penalty: null,
    bonusScore: function(hand) {
      return 15 * hand.countSuitExcluding('Land', this.id);
    },
    relatedSuits: ['Land'],
    relatedCards: []
  },
  'FR06': {
    id: 'FR06',
    suit: 'Flood',
    name: 'Suối nguồn sự sống',
    strength: 1,
    bonus: 'THƯỞNG: Cộng thêm điểm cơ bản từ một lá <span class="weapon">VŨ KHÍ</span>, <span class="flood">LŨ LỤT</span>, <span class="flame">NGỌN LỬA</span>, <span class="land">ĐỊA HÌNH</span> hoặc <span class="weather">THỜI TIẾT</span> mà bạn có.',
    penalty: null,
    bonusScore: function(hand) {
      var max = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'Weapon' || card.suit === 'Flood' || card.suit === 'Flame' || card.suit === 'Land' || card.suit === 'Weather') {
          if (card.strength > max) {
            max = card.strength;
          }
        }
      }
      return max;
    },
    relatedSuits: ['Weapon', 'Flood', 'Flame', 'Land', 'Weather'],
    relatedCards: []
  },
  'FR07': {
    id: 'FR07',
    suit: 'Flood',
    name: 'Đầm lầy',
    strength: 18,
    bonus: null,
    penalty: 'PHẠT: -3 cho mỗi lá <span class="army">QUÂN ĐỘI</span> và <span class="flame">NGỌN LỬA</span>.',
    penaltyScore: function(hand) {
      var penaltyCards = hand.countSuit('Flame');
      if (!(hand.containsId('FR25') || hand.containsId('CH19') || hand.containsId('FR41'))) { // these clear the word 'Army' from the penalty
        penaltyCards += hand.countSuit('Army');
      }
      return -3 * penaltyCards;
    },
    relatedSuits: ['Army', 'Flame'],
    relatedCards: []
  },
  'FR08': {
    id: 'FR08',
    suit: 'Flood',
    name: 'Đại hồng thuỷ',
    strength: 32,
    bonus: null,
    penalty: 'PHẠT: HUỶ toàn bộ <span class="army">QUÂN ĐỘI</span>, toàn bộ <span class="land">ĐỊA HÌNH</span> ngoại trừ <span class="land">Ngọn núi</span>, và toàn bộ <span class="flame">NGỌN LỬA</span> ngoại trừ <span class="flame">Sét</span>.',
    blanks: function(card, hand) {
      return (card.suit === 'Army' && !(hand.containsId('FR25') || hand.containsId('CH19') || hand.containsId('FR41'))) || // these clear the word 'Army' from the penalty
        (card.suit === 'Land' && card.name !== 'Ngọn núi') ||
        (card.suit === 'Flame' && card.name !== 'Sét');
    },
    relatedSuits: ['Army', 'Land', 'Flame'],
    relatedCards: ['Ngọn núi', 'Sét']
  },
  'FR09': {
    id: 'FR09',
    suit: 'Flood',
    name: 'Đảo',
    strength: 14,
    bonus: 'XOÁ phạt của một lá <span class="flood">LŨ LỤT</span> hoặc <span class="flame">NGỌN LỬA</span>.',
    penalty: null,
    action: 'Chọn một lá LŨ LỤT hoặc NGỌN LỬA trong tay bạn để xoá phạt.',
    relatedSuits: ['Flood', 'Flame'],
    relatedCards: []
  },
  'FR10': {
    id: 'FR10',
    suit: 'Flood',
    name: 'Nguyên tố nước',
    strength: 4,
    bonus: 'THƯỞNG: +15 cho mỗi lá <span class="flood">LŨ LỤT</span> khác.',
    penalty: null,
    bonusScore: function(hand) {
      return 15 * hand.countSuitExcluding('Flood', this.id);
    },
    relatedSuits: ['Flood'],
    relatedCards: []
  },
  'FR11': {
    id: 'FR11',
    suit: 'Weather',
    name: 'Mưa bão',
    strength: 8,
    bonus: 'THƯỞNG: +10 cho mỗi lá <span class="flood">LŨ LỤT</span>.',
    penalty: 'PHẠT: HUỶ toàn bộ lá <span class="flame">NGỌN LỬA</span> ngoại trừ <span class="flame">Sét</span>.',
    bonusScore: function(hand) {
      return 10 * hand.countSuit('Flood');
    },
    blanks: function(card, hand) {
      return card.suit === 'Flame' && card.name !== 'Sét';
    },
    relatedSuits: ['Flood', 'Flame'],
    relatedCards: ['Sét']
  },
  'FR12': {
    id: 'FR12',
    suit: 'Weather',
    name: 'Bão tuyết',
    strength: 30,
    bonus: null,
    penalty: 'PHẠT: HUỶ toàn bộ lá <span class="flood">LŨ LỤT</span>. <br />-5 cho mỗi lá <span class="army">QUÂN ĐỘI</span>, <span class="leader">THỦ LĨNH</span>, <span class="beast">QUÁI THÚ</span>, và <span class="flame">NGỌN LỬA</span>.',
    penaltyScore: function(hand) {
      var penaltyCards = hand.countSuit('Leader') + hand.countSuit('Beast') + hand.countSuit('Flame');
      if (!(hand.containsId('FR25') || hand.containsId('CH19'))) { // clears the word 'Army' from the penalty
        penaltyCards += hand.countSuit('Army');
      }
      return -5 * penaltyCards;
    },
    blanks: function(card, hand) {
      return card.suit === 'Flood';
    },
    relatedSuits: ['Leader', 'Beast', 'Flame', 'Army', 'Flood'],
    relatedCards: []
  },
  'FR13': {
    id: 'FR13',
    suit: 'Weather',
    name: 'Khói',
    strength: 27,
    bonus: null,
    penalty: 'PHẠT: TỰ HUỶ nếu không có <span class="flame">NGỌN LỬA</span>.',
    blankedIf: function(hand) {
      return !hand.containsSuit('Flame');
    },
    relatedSuits: ['Flame'],
    relatedCards: []
  },
  'FR14': {
    id: 'FR14',
    suit: 'Weather',
    name: 'Lốc xoáy',
    strength: 13,
    bonus: 'THƯỞNG: +40 nếu có đủ: <span class="weather">Mưa bão</span> và <span class="weather">Bão tuyết</span> HOẶC <span class="weather">Mưa bão</span> và <span class="flood">Đại hồng thuỷ</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Mưa bão') && (hand.contains('Bão tuyết') || hand.contains('Đại hồng thuỷ')) ? 40 : 0;
    },
    relatedSuits: ['Mưa bão'],
    relatedCards: ['Bão tuyết', 'Đại hồng thuỷ']
  },
  'FR15': {
    id: 'FR15',
    suit: 'Weather',
    name: 'Nguyên tố khí',
    strength: 4,
    bonus: 'THƯỞNG: +15 cho mỗi lá <span class="weather">THỜI TIẾT</span> khác.',
    penalty: null,
    bonusScore: function(hand) {
      return 15 * hand.countSuitExcluding('Weather', this.id);
    },
    relatedSuits: ['Weather'],
    relatedCards: []
  },
  'FR16': {
    id: 'FR16',
    suit: 'Flame',
    name: 'Cháy rừng',
    strength: 40,
    bonus: null,
    penalty: 'PHẠT: HUỶ toàn bộ bài, ngoại trừ <span class="flame">NGỌN LỬA</span>, <span class="wizard">PHÙ THUỶ</span>, <span class="weather">THỜI TIẾT</span>, <span class="weapon">VŨ KHÍ</span>, <span class="artifact">TẠO TÁC</span>, <span class="land">Ngọn núi</span>, <span class="flood">Đại hồng thuỷ</span>, <span class="flood">Đảo</span>, <span class="beast">Unicorn</span> và <span class="beast">Rồng</span>.',
    blanks: function(card, hand) {
      return !(card.suit === 'Flame' || card.suit === 'Wizard' || card.suit === 'Weather' ||
        card.suit === 'Weapon' || card.suit === 'Artifact' || card.suit === 'Wild' || card.name === 'Ngọn núi' ||
        card.name === 'Đại hồng thuỷ' || card.name === 'Đảo' || card.name === 'Unicorn' || card.name === 'Dragon');
    },
    relatedSuits: allSuits(),
    relatedCards: ['Ngọn núi', 'Đại hồng thuỷ', 'Đảo', 'Unicorn', 'Dragon']
  },
  'FR17': {
    id: 'FR17',
    suit: 'Flame',
    name: 'Ngọn nến',
    strength: 2,
    bonus: 'THƯỞNG: +100 nếu có đủ <span class="artifact">Kinh dịch</span>, <span class="land">Tháp chuông</span>, và một lá <span class="wizard">PHÁP SƯ</span> bất kì.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Kinh dịch') && hand.contains('Tháp chuông') && hand.containsSuit('Wizard') ? 100 : 0;
    },
    relatedSuits: ['Wizard'],
    relatedCards: ['Kinh dịch', 'Tháp chuông']
  },
  'FR18': {
    id: 'FR18',
    suit: 'Flame',
    name: 'Lò rèn',
    strength: 9,
    bonus: 'THƯỞNG: +9 cho mỗi lá <span class="weapon">VŨ KHÍ</span> và <span class="artifact">TẠO TÁC</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return 9 * (hand.countSuit('Weapon') + hand.countSuit('Artifact'));
    },
    relatedSuits: ['Weapon', 'Artifact'],
    relatedCards: []
  },
  'FR19': {
    id: 'FR19',
    suit: 'Flame',
    name: 'Sét',
    strength: 11,
    bonus: 'THƯỞNG: +30 nếu có lá <span class="weather">Mưa bão</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Mưa bão') ? 30 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Mưa bão']
  },
  'FR20': {
    id: 'FR20',
    suit: 'Flame',
    name: 'Nguyên tố lửa',
    strength: 4,
    bonus: 'THƯỞNG: +15 cho mỗi lá <span class="flame">NGỌN LỬA</span> khác.',
    penalty: null,
    bonusScore: function(hand) {
      return 15 * hand.countSuitExcluding('Flame', this.id);
    },
    relatedSuits: ['Flame'],
    relatedCards: []
  },
  'FR21': {
    id: 'FR21',
    suit: 'Army',
    name: 'Hiệp sĩ',
    strength: 20,
    bonus: null,
    penalty: 'PHẠT: -8 nếu không có <span class="leader">THỦ LĨNH</span>.',
    penaltyScore: function(hand) {
      return hand.containsSuit('Leader') ? 0 : -8;
    },
    relatedSuits: ['Leader'],
    relatedCards: []
  },
  'FR22': {
    id: 'FR22',
    suit: 'Army',
    name: 'Cung thủ Elven',
    strength: 10,
    bonus: 'THƯỞNG: +5 nếu không có <span class="weather">THỜI TIẾT</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.containsSuit('Weather') ? 0 : 5;
    },
    relatedSuits: ['Weather'],
    relatedCards: []
  },
  'FR23': {
    id: 'FR23',
    suit: 'Army',
    name: 'Kỵ binh nhẹ',
    strength: 17,
    bonus: null,
    penalty: 'PHẠT: -2 cho mỗi lá <span class="land">ĐỊA HÌNH</span>.',
    penaltyScore: function(hand) {
      return -2 * hand.countSuit('Land');
    },
    relatedSuits: ['Land'],
    relatedCards: []

  },
  'FR24': {
    id: 'FR24',
    suit: 'Army',
    name: 'Bộ binh người lùn',
    strength: 15,
    bonus: null,
    penalty: 'PHẠT: -2 cho mỗi lá <span class="army">QUÂN ĐỘI</span> khác.',
    penaltyScore: function(hand) {
      if (!(hand.containsId('FR25') || hand.containsId('CH19'))) { // clears the word 'Army' from the penalty
        return -2 * hand.countSuitExcluding('Army', this.id);
      }
      return 0;
    },
    relatedSuits: ['Army'],
    relatedCards: []
  },
  'FR25': {
    id: 'FR25',
    suit: 'Army',
    name: 'Cảnh binh',
    strength: 5,
    bonus: 'THƯỞNG: +10 cho mỗi lá <span class="land">ĐỊA HÌNH</span>. <br />XOÁ từ <span class="army">QUÂN ĐỘI</span> khỏi tất cả các PHẠT (ngoại trừ lá Khinh khí cầu).',
    penalty: null,
    bonusScore: function(hand) {
      return 10 * hand.countSuit('Land');
    },
    relatedSuits: ['Land', 'Army'],
    relatedCards: []
  },
  'FR26': {
    id: 'FR26',
    suit: 'Wizard',
    name: 'Chuyên gia sưu tầm',
    strength: 7,
    bonus: 'THƯỞNG: +10 cho ba lá cùng bộ, +40 cho bốn lá cùng bộ, +100 cho năm lá cùng bộ. (Không tính sao chép từ Song trùng)',
    penalty: null,
    bonusScore: function(hand) {
      var bySuit = {};
      for (const card of hand.nonBlankedCards()) {
        var suit = card.suit;
        if (bySuit[suit] === undefined) {
          bySuit[suit] = {};
        }
        bySuit[suit][card.name] = card;
      }
      var bonus = 0;
      for (const suit of Object.values(bySuit)) {
        var count = Object.keys(suit).length;
        if (count === 3) {
          bonus += 10;
        } else if (count === 4) {
          bonus += 40;
        } else if (count >= 5) {
          bonus += 100;
        }
      }
      return bonus;
    },
    relatedSuits: allSuits(),
    relatedCards: []
  },
  'FR27': {
    id: 'FR27',
    suit: 'Wizard',
    name: 'Thuần thú sư',
    strength: 9,
    bonus: 'THƯỞNG: +9 cho mỗi lá <span class="beast">QUÁI THÚ</span>. <br />XOÁ toàn bộ phạt của lá <span class="beast">QUÁI THÚ</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return 9 * hand.countSuit('Beast');
    },
    clearsPenalty: function(card) {
      return card.suit === 'Beast';
    },
    relatedSuits: ['Beast'],
    relatedCards: []
  },
  'FR28': {
    id: 'FR28',
    suit: 'Wizard',
    name: 'Triệu hồi sư',
    strength: 3,
    bonus: 'THƯỞNG: Vào cuối game, có thể lấy một lá <span class="army">QUÂN ĐỘI</span>, <span class="leader">THỦ LĨNH</span>, <span class="wizard">PHÁP SƯ</span>, hoặc <span class="beast">QUÁI THÚ</span> từ khu bài lật.',
    penalty: null,
    relatedSuits: ['Army', 'Leader', 'Wizard', 'Beast'],
    relatedCards: [],
    extraCard: true
  },
  'FR29': {
    id: 'FR29',
    suit: 'Wizard',
    name: 'Chúa tể pháp sư',
    strength: 25,
    bonus: null,
    penalty: 'PHẠT: -10 cho mỗi lá <span class="leader">THỦ LĨNH</span> và <span class="wizard">PHÁP SƯ</span> khác.',
    penaltyScore: function(hand) {
      return -10 * (hand.countSuit('Leader') + hand.countSuitExcluding('Wizard', this.id));
    },
    relatedSuits: ['Leader', 'Wizard'],
    relatedCards: []
  },
  'FR30': {
    id: 'FR30',
    suit: 'Wizard',
    name: 'Phù thuỷ',
    strength: 5,
    bonus: 'THƯỞNG: +5 cho mỗi lá <span class="land">ĐỊA HÌNH</span>, <span class="weather">THỜI TIẾT</span>, <span class="flood">LŨ LỤT</span>, hoặc <span class="flame">NGỌN LỬA</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return 5 * (hand.countSuit('Land') + hand.countSuit('Weather') + hand.countSuit('Flood') + hand.countSuit('Flame'));
    },
    relatedSuits: ['Land', 'Weather', 'Flood', 'Flame'],
    relatedCards: []
  },
  'FR31': {
    id: 'FR31',
    suit: 'Leader',
    name: 'Vua',
    strength: 8,
    bonus: 'THƯỞNG: +5 cho mỗi lá <span class="army">QUÂN ĐỘI</span>. <br /> HOẶC +20 cho mỗi lá <span class="army">QUÂN ĐỘI</span> nếu có lá <span class="leader">Hoàng hậu</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return (hand.contains('Hoàng hậu') ? 20 : 5) * hand.countSuit('Army');
    },
    relatedSuits: ['Army'],
    relatedCards: ['Hoàng hậu']
  },
  'FR32': {
    id: 'FR32',
    suit: 'Leader',
    name: 'Hoàng hậu',
    strength: 6,
    bonus: '+THƯỞNG: +5 cho mỗi lá <span class="army">QUÂN ĐỘI</span>. <br /> HOẶC +20 cho mỗi lá <span class="army">QUÂN ĐỘI</span> nếu có lá <span class="leader">Vua</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return (hand.contains('Vua') ? 20 : 5) * hand.countSuit('Army');
    },
    relatedSuits: ['Army'],
    relatedCards: ['Vua']
  },
  'FR33': {
    id: 'FR33',
    suit: 'Leader',
    name: 'Công chúa',
    strength: 2,
    bonus: 'THƯỞNG: +8 cho mỗi lá <span class="army">QUÂN ĐỘI</span>, <span class="wizard">PHÙ THUỶ</span>, và <span class="leader">THỦ LĨNH</span> khác.',
    penalty: null,
    bonusScore: function(hand) {
      return 8 * (hand.countSuit('Army') + hand.countSuit('Wizard') + hand.countSuitExcluding('Leader', this.id));
    },
    relatedSuits: ['Army', 'Wizard', 'Leader'],
    relatedCards: []
  },
  'FR34': {
    id: 'FR34',
    suit: 'Leader',
    name: 'Lãnh chúa',
    strength: 4,
    bonus: 'THƯỞNG: Cộng thêm tổng điểm cơ bản từ tất cả các lá <span class="army">QUÂN ĐỘI</span>.',
    penalty: null,
    bonusScore: function(hand) {
      var total = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'Army') {
          total += card.strength;
        }
      }
      return total;
    },
    relatedSuits: ['Army'],
    relatedCards: []
  },
  'FR35': {
    id: 'FR35',
    suit: 'Leader',
    name: 'Nữ vương',
    strength: 15,
    bonus: 'THƯỞNG: +10 cho mỗi lá <span class="army">QUÂN ĐỘI</span>.',
    PHẠT: '-5 cho mỗi lá <span class="leader">THỦ LĨNH</span> khác.',
    bonusScore: function(hand) {
      return 10 * hand.countSuit('Army');
    },
    penaltyScore: function(hand) {
      return -5 * hand.countSuitExcluding('Leader', this.id);
    },
    relatedSuits: ['Army', 'Leader'],
    relatedCards: []
  },
  'FR36': {
    id: 'FR36',
    suit: 'Beast',
    name: 'Unicorn',
    strength: 9,
    bonus: 'THƯỞNG: +30 nếu có <span class="leader">Công chúa</span>. <br />HOẶC +15 nếu có <span class="leader">Nữ vương</span>, <span class="leader">Hoàng hậu</span>, hoặc <span class="leader">Phù thuỷ</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Công chúa') ? 30 : (hand.contains('Nữ vương') || hand.contains('Hoàng hậu') || hand.contains('Phù thuỷ')) ? 15 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Công chúa', 'Nữ vương', 'Hoàng hậu', 'Phù thuỷ']
  },
  'FR37': {
    id: 'FR37',
    suit: 'Beast',
    name: 'Basilisk',
    strength: 35,
    bonus: null,
    penalty: 'PHẠT: HUỶ toàn bộ <span class="army">QUÂN ĐỘI</span>, <span class="leader">THỦ LĨNH</span>, và <span class="beast">QUÁI THÚ</span> khác.',
    blanks: function(card, hand) {
      return (card.suit === 'Army' && !(hand.containsId('FR25') || hand.containsId('CH19'))) || // clears the word 'Army' from the penalty
        card.suit === 'Leader' ||
        (card.suit === 'Beast' && card.id !== this.id);
    },
    relatedSuits: ['Army', 'Leader', 'Beast'],
    relatedCards: []
  },
  'FR38': {
    id: 'FR38',
    suit: 'Beast',
    name: 'Ngựa chiến',
    strength: 6,
    bonus: 'THƯỞNG: +14 nếu có <span class="leader">THỦ LĨNH</span> hoặc <span class="wizard">PHÁP SƯ</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.containsSuit('Leader') || hand.containsSuit('Wizard') ? 14 : 0;
    },
    relatedSuits: ['Leader', 'Wizard'],
    relatedCards: []
  },
  'FR39': {
    id: 'FR39',
    suit: 'Beast',
    name: 'Rồng',
    strength: 30,
    bonus: null,
    penalty: '-40 nếu không có <span class="wizard">PHÁP SƯ</span>.',
    penaltyScore: function(hand) {
      return hand.containsSuit('Wizard') ? 0 : -40;
    },
    relatedSuits: ['Wizard'],
    relatedCards: []
  },
  'FR40': {
    id: 'FR40',
    suit: 'Beast',
    name: 'Hydra',
    strength: 12,
    bonus: 'THƯỞNG: +28 nếu có lá <span class="flood">Đầm lầy</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Đầm lầy') ? 28 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Đầm lầy']
  },
  'FR41': {
    id: 'FR41',
    suit: 'Weapon',
    name: 'Chiến thuyền',
    strength: 23,
    bonus: 'THƯỞNG: XOÁ chữ <span class="army">QUÂN ĐỘI</span> khỏi toàn bộ phạt của các lá <span class="flood">LŨ LỤT</span>.',
    penalty: 'PHẠT: TỰ HUỶ nếu không có <span class="flood">LŨ LỤT</span>.',
    blankedIf: function(hand) {
      return !hand.containsSuit('Flood');
    },
    relatedSuits: ['Army', 'Flood'],
    relatedCards: []
  },
  'FR42': {
    id: 'FR42',
    suit: 'Weapon',
    name: 'Gậy phép',
    strength: 1,
    bonus: 'THƯỞNG: +25 nếu có <span class="wizard">PHÁP SƯ</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.containsSuit('Wizard') ? 25 : 0;
    },
    relatedSuits: ['Wizard'],
    relatedCards: []
  },
  'FR43': {
    id: 'FR43',
    suit: 'Weapon',
    name: 'Kiếm thánh',
    strength: 7,
    bonus: 'THƯỞNG: +10 nếu có <span class="leader">THỦ LĨNH</span>. <br />HOẶC +40 nếu có <span class="leader">THỦ LĨNH</span> và <span class="artifact">Khiên thánh</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.containsSuit('Leader') ? (hand.contains('Khiên thánh') ? 40 : 10) : 0;
    },
    relatedSuits: ['Leader'],
    relatedCards: ['Khiên thánh']
  },
  'FR44': {
    id: 'FR44',
    suit: 'Weapon',
    name: 'Cung Elven',
    strength: 3,
    bonus: 'THƯỞNG: +30 nếu có <span class="army">Cung thủ Elven</span>, <span class="leader">Lãnh chúa</span> hoặc <span class="wizard">Thuần thú sư</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.contains('Cung thủ Elven') || hand.contains('Lãnh chúa') || hand.contains('Thuần thú sư') ? 30 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Cung thủ Elven', 'Lãnh chúa', 'Thuần thú sư']
  },
  'FR45': {
    id: 'FR45',
    suit: 'Weapon',
    name: 'Khinh khí cầu',
    strength: 35,
    bonus: null,
    penalty: 'PHẠT: TỰ HUỶ nếu không có <span class="army">QUÂN ĐỘI</span>. <br />TỰ HUỶ nếu có <span class="weather">THỜI TIẾT</span>.',
    blankedIf: function(hand) {
      return !hand.containsSuit('Army') || hand.containsSuit('Weather');
    },
    relatedSuits: ['Army', 'Weather'],
    relatedCards: []
  },
  'FR46': {
    id: 'FR46',
    suit: 'Artifact',
    name: 'Khiên thánh',
    strength: 4,
    bonus: 'THƯỞNG: +15 nếu có <span class="leader">THỦ LĨNH</span>. <br />HOẶC +40 nếu có <span class="leader">THỦ LĨNH</span> và <span class="weapon">Kiếm thánh</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return hand.containsSuit('Leader') ? (hand.contains('Kiếm thánh') ? 40 : 15) : 0;
    },
    relatedSuits: ['Leader'],
    relatedCards: ['Kiếm thánh']
  },
  'FR47': {
    id: 'FR47',
    suit: 'Artifact',
    name: 'Ngọc trật tự',
    strength: 5,
    bonus: 'THƯỞNG: +10 cho sảnh 3, +30 cho sảnh 4, +60 cho sảnh 5, +100 cho sảnh 6, +150 cho sảnh 7. <br />(Tính theo điểm cơ bản của các lá bài.)',
    penalty: null,
    bonusScore: function(hand) {
      var strengths = hand.nonBlankedCards().map(card => card.strength);
      var currentRun = 0;
      var runs = [];
      for (var i = 0; i <= 40; i++) {
        if (strengths.includes(i)) {
          currentRun++;
        } else {
          runs.push(currentRun);
          currentRun = 0;
        }
      }
      var bonus = 0;
      for (var run of runs) {
        if (run === 3) {
          bonus += 10;
        } else if (run === 4) {
          bonus += 30;
        } else if (run === 5) {
          bonus += 60;
        } else if (run === 6) {
          bonus += 100;
        } else if (run >= 7) {
          bonus += 150;
        }
      }
      return bonus;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'FR48': {
    id: 'FR48',
    suit: 'Artifact',
    name: 'Cây thế giới',
    strength: 2,
    bonus: 'THƯỞNG: +70 nếu tất cả bài trên tay thuộc các bộ khác nhau.',
    penalty: null,
    bonusScore: function(hand) {
      var suits = [];
      for (const card of hand.nonBlankedCards()) {
        if (suits.includes(card.suit)) {
          return 0;
        }
        suits.push(card.suit);
      }
      return 70;
    },
    relatedSuits: allSuits(),
    relatedCards: []
  },
  'FR49': {
    id: 'FR49',
    suit: 'Artifact',
    name: 'Kinh dịch',
    strength: 3,
    bonus: 'THƯỞNG: Có thể đổi bộ của một lá bài khác. Tên, thưởng và phạt của lá bài đó không thay đổi.',
    penalty: null,
    action: 'Chọn một bộ sau đó chọn một lá bài trên tay bạn để đổi sang bộ đó.',
    relatedSuits: [], // empty because the main reason for relatedSuits is to determine how to use 'Kinh dịch'
    relatedCards: []
  },
  'FR50': {
    id: 'FR50',
    suit: 'Artifact',
    name: 'Đá bảo hộ',
    strength: 1,
    bonus: 'XOÁ toàn bộ phạt',
    penalty: null,
    clearsPenalty: function(card) {
      return true;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'FR51': {
    id: 'FR51',
    suit: 'Wild',
    name: 'Kẻ biến hình',
    strength: 0,
    bonus: 'Có thể biến thành tên và bộ của bất kỳ lá <span class="artifact">TẠO TÁC</span>, <span class="leader">THỦ LĨNH</span>, <span class="wizard">PHÁP SƯ</span>, <span class="weapon">VŨ KHÍ</span> hoặc <span class="beast">QUÁI THÚ</span> nào trong game. <br />Nhưng không có thưởng, phạt và điểm cơ bản.',
    penalty: null,
    action: 'Chọn một lá để sao chép.',
    relatedSuits: ['Artifact', 'Leader', 'Wizard', 'Weapon', 'Beast'].sort(),
    relatedCards: []
  },
  'FR52': {
    id: 'FR52',
    suit: 'Wild',
    name: 'Ảo ảnh',
    strength: 0,
    bonus: 'Có thể biến thành tên và bộ của bất kỳ lá <span class="army">QUÂN ĐỘI</span>, <span class="land">ĐỊA HÌNH</span>, <span class="weather">THỜI TIẾT</span>, <span class="flood">LŨ LỤT</span> hoặc <span class="flame">NGỌN LỬA</span> nào trong game. <br />Nhưng không có thưởng, phạt và điểm cơ bản.',
    penalty: null,
    action: 'Chọn một lá để sao chép.',
    relatedSuits: ['Army', 'Land', 'Weather', 'Flood', 'Flame'].sort(),
    relatedCards: []
  },
  'FR53': {
    id: 'FR53',
    suit: 'Wild',
    name: 'Song trùng',
    strength: 0,
    bonus: 'Có thể sao chép tên, bộ, điểm cơ bản, và phạt (không sao chép thưởng) của bất kỳ lá nào mà bạn đang có.',
    penalty: null,
    action: 'Chọn một lá trong tay bạn để sao chép.',
    relatedSuits: [],
    relatedCards: []
  },
  'FR54': {
    id: 'FR54',
    suit: 'Wizard',
    name: 'Chúa hề',
    strength: 3,
    bonus: 'THƯỞNG: +3 cho mỗi lá có điểm cơ bản là số lẻ. <br />HOẶC +50 nếu toàn bộ bài trên tay có điểm cơ bản là số lẻ.',
    penalty: null,
    bonusScore: function(hand) {
      var oddCount = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.strength % 2 === 1) {
          oddCount++;
        }
      }
      if (oddCount === hand.size()) {
        return 50;
      } else {
        return (oddCount - 1) * 3;
      }
    },
    relatedSuits: [],
    relatedCards: []
  }
};

var cursedHoard = {
  'CH01': {
    id: 'CH01',
    suit: 'Building',
    name: 'Dungeon',
    strength: 7,
    bonus: '+10 each for the first <span class="undead">Undead</span>, <span class="beast">Beast</span>, and <span class="artifact">Artifact</span>. <br />+5 for each additional card in any of these suits and <span class="wizard">Necromancer</span>, <span class="wizard">Warlock Lord</span>, <span class="outsider">Demon</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return (hand.containsSuit('Undead') ? 10 + (hand.countSuit('Undead') - 1) * 5: 0) +
        (hand.containsSuit('Beast') ? 10 + (hand.countSuit('Beast') - 1) * 5: 0) +
        (hand.containsSuit('Artifact') ? 10 + (hand.countSuit('Artifact') - 1) * 5: 0) +
        (hand.contains('Necromancer') ? 5: 0) +
        (hand.contains('Warlock Lord') ? 5: 0) +
        (hand.contains('Demon') ? 5: 0);
    },
    relatedSuits: ['Undead', 'Beast', 'Artifact'],
    relatedCards: ['Necromancer', 'Warlock Lord', 'Demon']
  },
  'CH02': {
    id: 'CH02',
    suit: 'Building',
    name: 'Castle',
    strength: 10,
    bonus: '+10 for the first <span class="leader">Leader</span>, <span class="army">Army</span>, <span class="land">Land</span>, and other <span class="building">Building</span>. <br />+5 for each additional <span class="building">Building</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return (hand.containsSuit('Leader') ? 10: 0) +
        (hand.containsSuit('Army') ? 10: 0) +
        (hand.containsSuit('Land') ? 10: 0) +
        (hand.containsSuitExcluding('Building', this.id) ? 10 + (hand.countSuitExcluding('Building', this.id) - 1) * 5: 0);
    },
    relatedSuits: ['Leader', 'Army', 'Land', 'Building'],
    relatedCards: []
  },
  'CH03': {
    id: 'CH03',
    suit: 'Building',
    name: 'Crypt',
    strength: 21,
    bonus: 'The sum of the base strength of all <span class="undead">Undead</span>.',
    penalty: 'BLANKs all <span class="leader">Leaders</span>.',
    bonusScore: function(hand) {
      var total = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'Undead') {
          total += card.strength;
        }
      }
      return total;
    },
    blanks: function(card, hand) {
      return card.suit === 'Leader';
    },
    relatedSuits: ['Undead', 'Leader'],
    relatedCards: []
  },
  'CH04': {
    id: 'CH04',
    suit: 'Building',
    name: 'Chapel',
    strength: 2,
    bonus: '+40 if you have exactly two cards from among these suits: <span class="leader">Leader</span>, <span class="wizard">Wizard</span>, <span class="outsider">Outsider</span>, and <span class="undead">Undead</span>.',
    penalty: null,
    bonusScore: function(hand) {
      if (hand.countSuit('Leader') + hand.countSuit('Wizard') + hand.countSuit('Outsider') + hand.countSuit('Undead') === 2) {
        return 40;
      } else {
        return 0;
      }
    },
    relatedSuits: ['Leader', 'Wizard', 'Outsider', 'Undead'],
    relatedCards: []
  },
  'CH05': {
    id: 'CH05',
    suit: 'Land',
    name: 'Garden',
    strength: 11,
    bonus: '+11 for each <span class="leader">Leader</span> and <span class="beast">Beast</span>.',
    penalty: 'BLANKED by any <span class="undead">Undead</span>, <span class="wizard">Necromancer</span>, or <span class="outsider">Demon</span>.',
    bonusScore: function(hand) {
      return 11 * (hand.countSuit('Leader') + hand.countSuit('Beast'));
    },
    blankedIf: function(hand) {
      return hand.containsSuit('Undead') || hand.contains('Necromancer') || hand.contains('Demon');
    },
    relatedSuits: ['Leader', 'Beast', 'Undead'],
    relatedCards: ['Necromancer', 'Demon']
  },
  'CH06': {
    id: 'CH06',
    suit: 'Outsider',
    name: 'Genie',
    strength: -50,
    bonus: '+10 per other player. <br />At the end of the game, look through the draw deck and put one card in your hand. <br />(Resolves after <span class="outsider">Leprechaun</span>.)',
    penalty: null,
    bonusScore: function(hand) {
      return 10 * playerCount;
    },
    relatedSuits: [],
    relatedCards: ['Leprechaun'],
    extraCard: true,
    referencesPlayerCount: true
  },
  'CH07': {
    id: 'CH07',
    suit: 'Outsider',
    name: 'Judge',
    strength: 11,
    bonus: '+10 for each card that contains a Penalty that is not CLEARED.',
    penalty: null,
    bonusScore: function(hand) {
      var bonus = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.penalty && !card.penaltyCleared) {
          bonus += 10;
        }
      }
      return bonus;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'CH08': {
    id: 'CH08',
    suit: 'Outsider',
    name: 'Angel',
    strength: 16,
    bonus: 'Prevent one other card from being BLANKED. This card can never be BLANKED.',
    action: 'Pick a target card from your hand.',
    penalty: null,
    relatedSuits: [],
    relatedCards: []
  },
  'CH09': {
    id: 'CH09',
    suit: 'Outsider',
    name: 'Leprechaun',
    strength: 20,
    bonus: 'Draw the top card from the deck at the end of the game and add it to your hand. <br />(Resolves before <span class="outsider">Genie</span>.)',
    penalty: null,
    relatedSuits: [],
    relatedCards: [],
    extraCard: true
  },
  'CH10': {
    id: 'CH10',
    suit: 'Outsider',
    name: 'Demon',
    strength: 45,
    bonus: null,
    penalty: 'For every non-<span class="outsider">Outsider</span> card: If that card is the only card you have in that suit, then that card is BLANKED. <br />This takes place before any other BLANVua.',
    blanks: function(card, hand) {
      return card.suit !== 'Outsider' && hand.countSuit(card.suit) === 1;
    },
    relatedSuits: ['Outsider'],
    relatedCards: []
  },
  'CH11': {
    id: 'CH11',
    suit: 'Undead',
    name: 'Dark Hoàng hậu',
    strength: 10,
    bonus: '+5 for each <span class="land">Land</span>, <span class="flood">Flood</span>, <span class="flame">Flame</span>, <span class="weather">Weather</span>, and <span class="beast">Unicorn</span> in the discard area.',
    penalty: null,
    bonusScore: function(hand, discard) {
      return (5 * (discard.countSuit('Land') + discard.countSuit('Flood') + discard.countSuit('Flame') + discard.countSuit('Weather')))
        + (discard.contains('Unicorn') ? 5 : 0);
    },
    relatedSuits: ['Land', 'Flood', 'Flame', 'Weather'],
    relatedCards: ['Unicorn'],
    referencesDiscardArea: true
  },
  'CH12': {
    id: 'CH12',
    suit: 'Undead',
    name: 'Ghoul',
    strength: 8,
    bonus: '+4 for each <span class="wizard">Wizard</span>, <span class="leader">Leader</span>, <span class="army">Army</span>, <span class="beast">Beast</span>, and <span class="undead">Undead</span> in the discard area.',
    penalty: null,
    bonusScore: function(hand, discard) {
      return 4 * (discard.countSuit('Wizard') + discard.countSuit('Leader') + discard.countSuit('Army') + discard.countSuit('Beast') + discard.countSuit('Undead'));
    },
    relatedSuits: ['Wizard', 'Leader', 'Army', 'Beast', 'Undead'],
    relatedCards: [],
    referencesDiscardArea: true
  },
  'CH13': {
    id: 'CH13',
    suit: 'Undead',
    name: 'Specter',
    strength: 12,
    bonus: '+6 for each <span class="wizard">Wizard</span>, <span class="artifact">Artifact</span>, and <span class="outsider">Outsider</span> in the discard area.',
    penalty: null,
    bonusScore: function(hand, discard) {
      return 6 * (discard.countSuit('Wizard') + discard.countSuit('Artifact') + discard.countSuit('Outsider'));
    },
    relatedSuits: ['Wizard', 'Artifact', 'Outsider'],
    relatedCards: [],
    referencesDiscardArea: true
  },
  'CH14': {
    id: 'CH14',
    suit: 'Undead',
    name: 'Lich',
    strength: 13,
    bonus: '+10 for <span class="wizard">Necromancer</span> and each other <span class="undead">Undead</span>. <br /><span class="undead">Undead</span> may not be BLANKED.',
    penalty: null,
    bonusScore: function(hand) {
      return (hand.contains('Necromancer') ? 10 : 0) + 10 * hand.countSuitExcluding('Undead', this.id);
    },
    relatedSuits: ['Undead'],
    relatedCards: ['Necromancer']
  },
  'CH15': {
    id: 'CH15',
    suit: 'Undead',
    name: 'Death Knight',
    strength: 14,
    bonus: '+7 for each <span class="weapon">Weapon</span> and <span class="army">Army</span> in the discard area.',
    penalty: null,
    bonusScore: function(hand, discard) {
      return 7 * (discard.countSuit('Weapon') + discard.countSuit('Army'));
    },
    relatedSuits: ['Weapon', 'Army'],
    relatedCards: [],
    referencesDiscardArea: true
  },
  'CH16': {
    id: 'CH16',
    suit: 'Building',
    name: 'Tháp chuông',
    replaces: 'FR03',
    strength: 8,
    bonus: '+15 with any one <span class="wizard">Wizard</span> or <span class="undead">Undead</span>.',
    penalty: null,
    bonusScore: function(hand) {
      return (hand.containsSuit('Wizard') || hand.containsSuit('Undead')) ? 15 : 0;
    },
    relatedSuits: ['Wizard', 'Undead'],
    relatedCards: []
  },
  'CH17': {
    id: 'CH17',
    suit: 'Flood',
    name: 'Suối nguồn sự sống',
    replaces: 'FR06',
    strength: 1,
    bonus: 'Add the base strength of any one <span class="building">Building</span>, <span class="weapon">Weapon</span>, <span class="flood">Flood</span>, <span class="flame">Flame</span>, <span class="land">Land</span> or <span class="weather">Weather</span> in your hand.',
    penalty: null,
    bonusScore: function(hand) {
      var max = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'Building' || card.suit === 'Weapon' || card.suit === 'Flood' || card.suit === 'Flame' || card.suit === 'Land' || card.suit === 'Weather') {
          if (card.strength > max) {
            max = card.strength;
          }
        }
      }
      return max;
    },
    relatedSuits: ['Building', 'Weapon', 'Flood', 'Flame', 'Land', 'Weather'],
    relatedCards: []
  },
  'CH18': {
    id: 'CH18',
    suit: 'Flood',
    name: 'Đại hồng thuỷ',
    replaces: 'FR08',
    strength: 32,
    bonus: null,
    penalty: 'BLANKS all <span class="army">Armies</span>, all <span class="building">Buildings</span>, all <span class="land">Lands</span> except <span class="land">Mountain</span>, and all <span class="flame">Flames</span> except <span class="flame">Lightning</span>.',
    blanks: function(card, hand) {
      return (card.suit === 'Army' && !(hand.containsId('FR25') || hand.containsId('CH19') || hand.containsId('FR41'))) || // these clear the word 'Army' from the penalty
        (card.suit === 'Building') ||
        (card.suit === 'Land' && card.name !== 'Ngọn núi') ||
        (card.suit === 'Flame' && card.name !== 'Sét');
    },
    relatedSuits: ['Army', 'Building', 'Land', 'Flame'],
    relatedCards: ['Ngọn núi', 'Sét']
  },
  'CH19': {
    id: 'CH19',
    suit: 'Army',
    name: 'Cảnh binh',
    replaces: 'FR25',
    strength: 5,
    bonus: '+10 for each <span class="land">Land</span> and <span class="building">Building</span>. <br />CLEARS the word <span class="army">Army</span> from all Penalties.',
    penalty: null,
    bonusScore: function(hand) {
      return 10 * (hand.countSuit('Land') + hand.countSuit('Building'));
    },
    relatedSuits: ['Land', 'Building', 'Army'],
    relatedCards: []
  },
  'CH20': {
    id: 'CH20',
    suit: 'Wizard',
    name: 'Necromancer',
    replaces: 'FR28',
    strength: 3,
    bonus: 'At the end of the game, you may take one <span class="army">Army</span>, <span class="leader">Leader</span>, <span class="wizard">Wizard</span>, <span class="beast">Beast</span>, or <span class="undead">Undead</span> from the discard pile and add it to your hand. <br /><span class="undead">Undead</span> may not be blanked.',
    penalty: null,
    relatedSuits: ['Army', 'Leader', 'Wizard', 'Beast', 'Undead'],
    relatedCards: [],
    extraCard: true
  },
  'CH21': {
    id: 'CH21',
    suit: 'Artifact',
    name: 'World Tree',
    replaces: 'FR48',
    strength: 2,
    bonus: '+70 if every non-BLANKED card is a different suit.',
    penalty: null,
    bonusScore: function(hand) {
      var suits = [];
      for (const card of hand.nonBlankedCards()) {
        if (suits.includes(card.suit)) {
          return 0;
        }
        suits.push(card.suit);
      }
      return 70;
    },
    relatedSuits: allSuits(),
    relatedCards: []
  },
  'CH22': {
    id: 'CH22',
    suit: 'Wild',
    name: 'Shapeshifter',
    replaces: 'FR51',
    strength: 0,
    bonus: '<b>Shapeshifter</b> may duplicate the name and suit of any one <span class="artifact">Artifact</span>, <span class="leader">Leader</span>, <span class="wizard">Wizard</span>, <span class="weapon">Weapon</span>, <span class="beast">Beast</span>, or <span class="undead">Undead</span> in the game. <br />Does not take the bonus, penalty, or base strength of the card duplicated.',
    penalty: null,
    action: 'Pick a target card to duplicate.',
    relatedSuits: ['Artifact', 'Leader', 'Wizard', 'Weapon', 'Beast', 'Undead'].sort(),
    relatedCards: []
  },
  'CH23': {
    id: 'CH23',
    suit: 'Wild',
    name: 'Mirage',
    replaces: 'FR52',
    strength: 0,
    bonus: '<b>Mirage</b> may duplicate the name and suit of any one <span class="army">Army</span>, <span class="building">Building</span>, <span class="land">Land</span>, <span class="weather">Weather</span>, <span class="flood">Flood</span> or <span class="flame">Flame</span> in the game. <br />Does not take the bonus, penalty, or base strength of the card duplicated.',
    penalty: null,
    action: 'Pick a target card to duplicate.',
    relatedSuits: ['Army', 'Building', 'Land', 'Weather', 'Flood', 'Flame'].sort(),
    relatedCards: []
  }
};

var cursedItems = {
  'CH24': {
    id: 'CH24',
    suit: 'Cursed Item',
    name: 'Spyglass',
    points: -1 // TODO: -10 in 2-player
  },
  'CH25': {
    id: 'CH25',
    suit: 'Cursed Item',
    name: 'Sarcophagus',
    points: 5
  },
  'CH26': {
    id: 'CH26',
    suit: 'Cursed Item',
    name: 'Blindfold',
    points: 5
  },
  'CH27': {
    id: 'CH27',
    suit: 'Cursed Item',
    name: 'Book of Prophecy',
    points: -1
  },
  'CH28': {
    id: 'CH28',
    suit: 'Cursed Item',
    name: 'Crystal Ball',
    points: -1
  },
  'CH29': {
    id: 'CH29',
    suit: 'Cursed Item',
    name: 'Market Wagon',
    points: -2
  },
  'CH30': {
    id: 'CH30',
    suit: 'Cursed Item',
    name: 'Backpack',
    points: -2
  },
  'CH31': {
    id: 'CH31',
    suit: 'Cursed Item',
    name: 'Shovel',
    points: -2
  },
  'CH32': {
    id: 'CH32',
    suit: 'Cursed Item',
    name: 'Sealed Vault',
    points: -4
  },
  'CH33': {
    id: 'CH33',
    suit: 'Cursed Item',
    name: 'Crystal Lens',
    points: -2
  },
  'CH34': {
    id: 'CH34',
    suit: 'Cursed Item',
    name: 'Larcenous Gloves',
    points: -3
  },
  'CH35': {
    id: 'CH35',
    suit: 'Cursed Item',
    name: 'Junkyard Map',
    points: -3
  },
  'CH36': {
    id: 'CH36',
    suit: 'Cursed Item',
    name: 'Winged Boots',
    points: -4
  },
  'CH37': {
    id: 'CH37',
    suit: 'Cursed Item',
    name: 'Staff of Transmutation',
    points: -4
  },
  'CH38': {
    id: 'CH38',
    suit: 'Cursed Item',
    name: 'Rake',
    points: -4
  },
  'CH39': {
    id: 'CH39',
    suit: 'Cursed Item',
    name: 'Treasure Chest',
    points: -5 // TODO: +25 if at least 3 other Cursed Items
  },
  'CH40': {
    id: 'CH40',
    suit: 'Cursed Item',
    name: 'Fishhook',
    points: -6
  },
  'CH41': {
    id: 'CH41',
    suit: 'Cursed Item',
    name: 'Repair Kit',
    points: -6
  },
  'CH42': {
    id: 'CH42',
    suit: 'Cursed Item',
    name: 'Hourglass',
    points: -7
  },
  'CH43': {
    id: 'CH43',
    suit: 'Cursed Item',
    name: 'Gold Mirror',
    points: -8
  },
  'CH44': {
    id: 'CH44',
    suit: 'Cursed Item',
    name: 'Cauldron',
    points: -9
  },
  'CH45': {
    id: 'CH45',
    suit: 'Cursed Item',
    name: 'Lantern',
    points: -10
  },
  'CH46': {
    id: 'CH46',
    suit: 'Cursed Item',
    name: 'Portal',
    points: -20,
    extraCard: true
  },
  'CH47': {
    id: 'CH47',
    suit: 'Cursed Item',
    name: 'Wishing Ring',
    points: -30
  }
}

var deck = {
  cards: {...base},
  enableCursedHoardSuits: function() {
    this.cards = {...base, ...cursedHoard};
    for (const id in cursedHoard) {
      const card = this.cards[id];
      if (card.replaces) {
        delete this.cards[card.replaces];
      }
    }
  },
  disableCursedHoardSuits: function() {
    this.cards = {...base}
  },
  getCardByName: function(cardName) {
    for (const id in this.cards) {
      const card = this.cards[id];
      if (card.name === cardName) {
        return card;
      }
    }
  },
  getCardById: function(id) {
    if (id.match(/^[0-9+]+$/)) {
      id = 'FR' + id.padStart(2, '0')
    }
    return this.cards[id];
  },
  getCardsBySuit: function(suits) {
    var cardsBySuit = {};
    for (const id in this.cards) {
      const card = this.cards[id];
      if (suits === undefined || suits.includes(card.suit)) {
        if (cardsBySuit[card.suit] === undefined) {
          cardsBySuit[card.suit] = [];
        }
        cardsBySuit[card.suit].push(card);
      }
    }
    var ordered = {};
    Object.keys(cardsBySuit).sort().forEach(function(key) {
      ordered[key] = cardsBySuit[key];
    });
    return ordered;
  },
  suits: function() {
    var suits = {};
    for (const id in this.cards) {
      const card = this.cards[id];
      suits[card.suit] = card.suit;
    }
    return Object.keys(suits).sort();
  }
};

function allSuits() {
    return ['Land', 'Flood', 'Weather', 'Flame', 'Army', 'Wizard', 'Leader', 'Beast', 'Weapon', 'Artifact', 'Wild', 'Building', 'Outsider', 'Undead'].sort();
}

var NONE = -1;
var ISLAND = 'FR09';
var NECROMANCER = 'FR28';
var BOOK_OF_CHANGES = 'FR49';
var SHAPESHIFTER = 'FR51';
var MIRAGE = 'FR52';
var DOPPELGANGER = 'FR53';

var CH_NECROMANCER = 'CH20';
var CH_SHAPESHIFTER = 'CH22';
var CH_MIRAGE = 'CH22';
var CH_DEMON = 'CH10';
var CH_LICH = 'CH14';
var CH_ANGEL = 'CH08';

var ACTION_ORDER = [DOPPELGANGER, MIRAGE, CH_MIRAGE, SHAPESHIFTER, CH_SHAPESHIFTER, BOOK_OF_CHANGES, ISLAND, CH_ANGEL];

export default {
  id: 1,
  title: 'To Be/To Have',
  note: 'Todo: Pronouns list. To say your name use ชื่อ (chêu)',
  words: [
    {
      id: 102,
      original: 'To be',
      translation: 'เป็น',
      transliteration: 'bpen',
      full: {
        original: 'I am a man',
        translation: 'ผม เป็น ผู้ชาย',
        transliteration: 'pŏm bpen pôo chaai'
      },
      explanation: [{
        original: 'ผม',
        transliteration: 'pŏm',
        translation: 'I, me (men)'
      }, {
        original: 'เป็น',
        transliteration: 'bpen',
        translation: 'be'
      }, {
        original: 'ผู้ชาย',
        transliteration: 'pôo chaai',
        translation: 'man'
      }],
      note: 'เป็น/bpen + nouns or noun phrases',
      image: require('../images/102.jpg')
    },
    {
      id: 104,
      original: 'You are not a man',
      translation: 'คุณ ไม่ใช่ ผู้ชาย',
      transliteration: 'kun mâi châi pôo chaai',
      note: 'ไม่ใช่/mâi châi /is not OR ไม่ได้เป็น/ mâi dâai bpen/ is not',
      explanation: [{
        original: 'คุณ',
        transliteration: 'kun',
        translation: 'you'
      }, {
        original: 'ไม่ใช่',
        transliteration: 'mâi châi',
        translation: 'be not, no'
      }, {
        original: 'ผู้ชาย',
        transliteration: 'pôo chaai',
        translation: 'man'
      }],
      image: require('../images/104.jpg')
    },
    {
      id: 125,
      original: 'I am French',
      translation: 'ฉัน เป็น คน ฝรั่งเศส',
      transliteration: 'chăn bpen kon fà-ràng-sàyt',
      image: require('../images/125.jpg'),
      explanation: [{
        original: 'ฉัน',
        transliteration: 'chăn',
        translation: 'I'
      }, {
        original: 'เป็น',
        transliteration: 'bpen',
        translation: 'be'
      }, {
        original: 'คน',
        transliteration: 'kon',
        translation: 'person'
      }, {
        original: 'ฝรั่งเศส',
        transliteration: 'fà-ràng-sàyt',
        translation: 'France'
      }]
    },
    {
      id: 105,
      original: 'To be',
      translation: 'คือ',
      transliteration: 'keu',
      full: {
        original: 'She is my teacher',
        translation: 'เธอ คือ ครู ของ ฉัน',
        transliteration: 'ter keu kroo kŏng chăn'
      },
      note: 'คือ/keu links 2 equal things , giving definition, explanation, clarification of things. In this example' +
      'we can also use เป็น/bpen...todo: check',
      image: require('../images/105.jpg'),
      explanation: [{
        original: 'เธอ',
        transliteration: 'ter',
        translation: 'You'
      }, {
        original: 'คือ',
        transliteration: 'keu',
        translation: 'be'
      }, {
        original: 'ครู',
        transliteration: 'kroo',
        translation: 'teacher'
      }, {
        original: 'ของ',
        transliteration: 'kŏng',
        translation: 'of'
      }, {
        original: 'ฉัน',
        transliteration: 'chăn',
        translation: 'I, me'
      }]
    },
    {
      id: 120,
      original: 'This',
      translation: 'นี่',
      transliteration: 'nêe',
      full: {
        original: 'This is a hat',
        translation: 'นี่ คือ หมวก',
        transliteration: 'nêe keu mùak'
      },
      explanation: [{
        original: 'นี่',
        transliteration: 'nêe',
        translation: 'this, these'
      }, {
        original: 'คือ',
        transliteration: 'keu',
        translation: 'be'
      }, {
        original: 'หมวก',
        transliteration: 'mùak',
        translation: 'hat'
      }],
      note: 'To indicate that you\'re referring to "this" particular person or object',
      image: require('../images/120.jpg')
    },
    {
      id: 121,
      original: 'That (not far)',
      translation: 'นั่น',
      transliteration: 'nân',
      full: {
        original: 'That is my friend',
        translation: 'นั่น เพื่อน ฉัน',
        transliteration: 'nân pêuan chăn'
      },
      explanation: [{
        original: 'นั่น',
        transliteration: 'nân',
        translation: 'that, those'
      }, {
        original: 'เพื่อน',
        transliteration: 'pêuan',
        translation: 'friend'
      }, {
        original: 'ฉัน',
        transliteration: 'chăn',
        translation: 'I, me'
      }],
      note: 'To indicate that something which is positioned right there (not far from you). Use โน้น (nohn, that' +
      'over there) to indicate someone or something that is far away from you',
      image: require('../images/121.jpg')
    },
    {
      id: 122,
      original: 'This one',
      translation: 'อันนี้',
      transliteration: 'an née',
      full: {
        original: 'I want this one',
        translation: 'ฉัน ต้องการ อันนี้',
        transliteration: 'chăn dtông gaan an née'
      },
      explanation: [{
        original: 'ฉัน',
        transliteration: 'chăn',
        translation: 'I, me'
      }, {
        original: 'ต้องการ',
        transliteration: 'dtông gaan',
        translation: 'want'
      }, {
        original: 'อันนี้',
        transliteration: 'an née',
        translation: 'this'
      }],
      image: require('../images/122.jpg')
    },
    {
      id: 106,
      original: 'To have',
      translation: 'มี',
      transliteration: 'mee',
      full: {
        original: 'I have a dog',
        translation: 'ผม มี สุนัข',
        transliteration: 'pŏm mee sù-nák'
      },
      explanation: [{
        original: 'ผม',
        transliteration: 'pŏm',
        translation: 'I, me (men)'
      }, {
        original: 'มี',
        transliteration: 'mee',
        translation: 'have, there is'
      }, {
        original: 'สุนัข',
        transliteration: 'sù-nák',
        translation: 'dog'
      }],
      image: require('../images/106.jpg')
    },
    {
      id: 107,
      original: 'There is',
      translation: 'มี',
      transliteration: 'mee',
      full: {
        original: 'There is a car',
        translation: 'มี รถ',
        transliteration: 'mee rót'
      },
      explanation: [{
        original: 'มี',
        transliteration: 'mee',
        translation: 'have, there is'
      }, {
        original: 'รถ',
        transliteration: 'rót',
        translation: 'car'
      }],
      image: require('../images/107.jpg')
    },
    {
      id: 109,
      original: 'To be (location)',
      translation: 'อยู่',
      transliteration: 'yòo',
      full: {
        original: 'I am at home',
        translation: 'อยู่ บ้าน',
        transliteration: 'yòo bâan'
      },
      explanation: [{
        original: 'อยู่',
        transliteration: 'yòo',
        translation: 'be at, live at'
      }, {
        original: 'บ้าน',
        transliteration: 'bâan',
        translation: 'home, house'
      }],
      note: 'อยู่ (yòo) means to live (at), to be situated at, to be located',
      image: require('../images/109.jpeg')
    },
    {
      id: 110,
      original: 'You',
      translation: 'คุณ',
      transliteration: 'kun',
      full: {
        original: 'You are nice',
        translation: 'คุณ เป็น คนดี',
        transliteration: 'kun bpen kon dee'
      },
      explanation: [{
        original: 'ผม',
        transliteration: 'pŏm',
        translation: 'I, me (men)'
      }, {
        original: 'เป็น',
        transliteration: 'bpen',
        translation: 'be'
      }, {
        original: 'ผู้ชาย',
        transliteration: 'pôo chaai',
        translation: 'man'
      }],
      image: require('../images/110.jpg')
    },
    {
      id: 111,
      original: 'He',
      translation: 'เขา',
      transliteration: 'kăo',
      full: {
        original: 'He likes to eat',
        translation: 'เขา ชอบ กิน',
        transliteration: 'kăo chôp gin'
      },
      explanation: [{
        original: 'เขา',
        transliteration: 'kăo',
        translation: 'he'
      }, {
        original: 'ชอบ',
        transliteration: 'chôp',
        translation: 'like'
      }, {
        original: 'กิน',
        transliteration: 'gin',
        translation: 'eat'
      }],
      note: 'เธอ (ter) is usually used to say She',
      image: require('../images/111.jpg')
    },
    {
      id: 123,
      original: 'He is rich',
      translation: 'เขา รวย',
      transliteration: 'kăo ruay',
      explanation: [{
        original: 'เขา',
        transliteration: 'kăo',
        translation: 'he'
      }, {
        original: 'รวย',
        transliteration: 'ruay',
        translation: 'rich'
      }],
      image: require('../images/123.jpg')
    },
    {
      id: 124,
      original: 'He is poor',
      translation: 'เขา เป็น คนยากจน',
      transliteration: 'kăo bpen kon yâak jon',
      explanation: [{
        original: 'เขา',
        transliteration: 'kăo',
        translation: 'he'
      }, {
        original: 'เป็น',
        transliteration: 'bpen',
        translation: 'be'
      }, {
        original: 'คนยากจน',
        transliteration: 'kon yâak jon',
        translation: 'the poor'
      }],
      note: 'todo: check',
      image: require('../images/124.jpg')
    },
    {
      id: 112,
      original: 'She',
      translation: 'เธอ',
      transliteration: 'ter',
      full: {
        original: 'She is a beautiful woman',
        translation: 'เธอ เป็น ผู้หญิง ที่ สวย',
        transliteration: 'ter bpen pôo yĭng têe sŭay'
      },
      explanation: [{
        original: 'เธอ',
        transliteration: 'ter',
        translation: 'she'
      }, {
        original: 'เป็น',
        transliteration: 'bpen',
        translation: 'be'
      }, {
        original: 'ผู้หญิง',
        transliteration: 'pôo yĭng',
        translation: 'woman'
      }, {
        original: 'ที่',
        transliteration: 'têe',
        translation: 'who, to, that, which'
      }, {
        original: 'สวย',
        transliteration: 'sŭay',
        translation: 'beautiful'
      }],
      note: 'หล่อ (lòr) is used for men (handsome), todo: check',
      image: require('../images/112.jpg')
    },
    {
      id: 113,
      original: 'It',
      translation: 'มัน',
      transliteration: 'man',
      full: {
        original: 'It’s a cat',
        translation: 'มัน เป็น แมว',
        transliteration: 'man bpen maew'
      },
      explanation: [{
        original: 'มัน',
        transliteration: 'man',
        translation: 'it'
      }, {
        original: 'เป็น',
        transliteration: 'bpen',
        translation: 'be'
      }, {
        original: 'แมว',
        transliteration: 'maew',
        translation: 'cat'
      }],
      image: require('../images/113.jpg')
    },
    {
      id: 114,
      original: 'We',
      translation: 'พวกเรา',
      transliteration: 'pûak rao',
      full: {
        original: 'We are the best',
        translation: 'พวกเรา ยอดเยี่ยม',
        transliteration: 'pûak rao yôt yîam'
      },
      explanation: [{
        original: 'พวกเรา',
        transliteration: 'pûak rao',
        translation: 'we'
      }, {
        original: 'ยอดเยี่ยม',
        transliteration: 'yôt yîam',
        translation: 'superb, excellent, best'
      }],
      note: 'เรา (rao) can also be used to say We',
      image: require('../images/114.jpg')
    },
    {
      id: 115,
      original: 'You (plural)',
      translation: 'พวกคุณ',
      transliteration: 'pûak kun',
      full: {
        original: 'You are generous (plural)',
        translation: 'พวกคุณ ใจกว้าง',
        transliteration: 'pûak kun jai gwâang'
      },
      explanation: [{
        original: 'พวกคุณ',
        transliteration: 'pûak kun',
        translation: 'you (plural)'
      }, {
        original: 'ใจกว้าง',
        transliteration: 'jai gwâang',
        translation: 'generous'
      }],
      image: require('../images/115.jpeg')
    },
    {
      id: 116,
      original: 'They',
      translation: 'พวกเขา',
      transliteration: 'pûak kăo',
      full: {
        original: 'They are Chinese',
        translation: 'พวกเขา เป็น ชาวจีน',
        transliteration: 'pûak kăo bpen chaao jeen'
      },
      explanation: [{
        original: 'พวกเขา',
        transliteration: 'pûak kăo',
        translation: 'they, them'
      }, {
        original: 'เป็น',
        transliteration: 'bpen',
        translation: 'be'
      }, {
        original: 'ชาวจีน',
        transliteration: 'chaao jeen',
        translation: 'Chinese'
      }],
      image: require('../images/116.svg')
    },
    {
      id: 117,
      original: 'It\'s raining',
      translation: 'ฝนตก',
      transliteration: 'fŏn dtòk',
      image: require('../images/117.jpg'),
      explanation: [{
        original: 'ฝนตก',
        transliteration: 'fŏn dtòk',
        translation: 'rain'
      }]
    },
    {
      id: 118,
      original: 'It\'s good',
      translation: 'ดี',
      transliteration: 'dee',
      full: {
        original: 'It\'s very good',
        translation: 'มัน ดีมาก',
        transliteration: 'dee mâak'
      },
      explanation: [{
        original: 'มัน',
        transliteration: 'man',
        translation: 'it'
      }, {
        original: 'ดีมาก',
        transliteration: 'dee mâak',
        translation: 'great'
      }],
      note: 'Can be prefixed by มัน (man) under certain conditions',
      image: require('../images/118.jpg')
    },
    {
      id: 119,
      original: 'It\'s crazy',
      translation: 'มัน บ้า',
      transliteration: 'man bâa',
      explanation: [{
        original: 'มัน',
        transliteration: 'man',
        translation: 'it'
      }, {
        original: 'บ้า',
        transliteration: 'bâa',
        translation: 'mad, crazy, insane'
      }],
      image: require('../images/119.jpg')
    }
  ]
}

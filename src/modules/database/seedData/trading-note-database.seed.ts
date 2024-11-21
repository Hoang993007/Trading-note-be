import { Database } from 'src/schemas';
import { EDatabasePropertyType } from 'src/shares/types/database.type';

export const tradingNoteDatabase: Database = {
  id: '167T-QWTRWEJYete11JRe',
  name: 'Trading Note',
  properties: [
    {
      id: 'Vzn9rTTVNSBf3FRfsOMWE',
      name: 'Date',
      type: EDatabasePropertyType.DATE,
      settings: {
        width: 118,
        dateFormat: 'DD/MM/YYYY',
        hidden: false,
      },
    },
    {
      id: 'vx6uV4OtkSbxlYI1GC4eJ',
      name: 'Day in week',
      type: EDatabasePropertyType.SELECT,
      settings: {
        width: 122,
        options: [
          { name: 'Monday', value: 'monday', color: 'red' },
          { name: 'Tuesday', value: 'tuesday', color: 'blue' },
          { name: 'Wednesday', value: 'wednesday', color: 'green' },
          { name: 'Thursday', value: 'thursday', color: 'yellow' },
          { name: 'Friday', value: 'friday', color: 'purple' },
        ],
        hidden: false,
      },
    },
    {
      id: 'PF698WM_xRM5cJHhhF8er',
      name: 'News',
      type: EDatabasePropertyType.MULTI_SELECT,
      settings: {
        width: 154,
        options: [],
        hidden: false,
      },
    },
    {
      id: 'xFrpZIut3zS5xXa9BZhBj',
      name: 'Time',
      type: EDatabasePropertyType.TIME,
      settings: {
        width: 93,
        timeFormat: 'HH:mm:ss',
        timeZone: 'America/New_York',
        hidden: false,
      },
    },
    {
      id: 'kQWLKHF6OQlfXKNv5QpZ2',
      name: '5m TF',
      type: EDatabasePropertyType.IMAGE,
      settings: {
        width: 128,
        hidden: false,
      },
    },
    {
      id: 'uvW13UaaYxHVgPq4CTkPx',
      name: '1m TF',
      type: EDatabasePropertyType.IMAGE,
      settings: {
        width: 168,
        hidden: false,
      },
    },
    {
      id: '8WEIRW-dxscGiYRUYXi94',
      name: 'Factors',
      type: EDatabasePropertyType.MULTI_SELECT,
      settings: {
        width: 193,
        options: [],
        hidden: false,
      },
    },
    {
      id: 'rJgneTwoa9X7DpazgAY0a',
      name: 'Cautious',
      type: EDatabasePropertyType.MULTI_SELECT,
      settings: {
        width: 191,
        options: [],
        hidden: false,
      },
    },
    {
      id: 'icf-fCzZ5OjjRsIe1adWY',
      name: 'Result',
      type: EDatabasePropertyType.SELECT,
      settings: {
        width: 204,
        options: [
          { name: 'Win', value: 'win', color: 'green' },
          { name: 'Lose', value: 'lose', color: 'red' },
          { name: 'Break even', value: 'break_even', color: 'yellow' },
          { name: 'Miss win', value: 'miss_win', color: 'gray' },
          { name: 'Case study: Win', value: 'Case study: Win' },
          { name: 'Case study: Consider', value: 'Case study: Consider' },
          {
            name: 'Case study: Prevent loss',
            value: 'Case study: Prevent loss',
          },
        ],
        hidden: false,
      },
    },
    {
      id: 'OfRnTqswOuSruyvBz-x5X',
      name: 'Feeling & Thoughts',
      type: EDatabasePropertyType.TEXT,
      settings: {
        width: 135,
        hidden: false,
      },
    },
    {
      id: 'cPFpBf73XH4_pKC7Zq4Zx',
      name: 'Comment',
      type: EDatabasePropertyType.TEXT,
      settings: {
        width: 177,
        hidden: false,
      },
    },
    {
      id: 'dx4QdpLQNHmD1H',
      name: 'Set-up',
      type: EDatabasePropertyType.MULTI_SELECT,
      settings: {
        width: 200,
        options: [
          {
            name: 'ST reversal',
            value: 'ST reversal',
          },
          {
            name: 'Rebounce touch',
            value: 'Rebounce touch',
          },
          {
            name: 'NY pre-market JOIN',
            value: 'NY pre-market JOIN',
          },
        ],
        hidden: false,
      },
    },
    {
      id: 'LK_BkBIXhxXtAC',
      name: 'Max RR',
      type: EDatabasePropertyType.NUMBER,
      settings: {
        width: 200,
        options: [],
        hidden: false,
      },
    },
    {
      id: '1PBeuRYWFIwXDc',
      name: 'Comparison',
      type: EDatabasePropertyType.MULTI_SELECT,
      settings: {
        width: 200,
        options: [],
        dateFormat: null,
        timeFormat: null,
        timeZone: null,
        numberFormat: null,
        hidden: false,
      },
    },
    {
      id: 'nmGZdG-GP2e1rz',
      name: 'Category',
      type: EDatabasePropertyType.MULTI_SELECT,
      settings: {
        width: 200,
        options: [
          {
            name: 'Tradable',
            value: 'Tradable',
          },
          {
            name: 'Follow',
            value: 'Follow',
          },
          {
            name: 'Reverse',
            value: 'Reverse',
          },
          {
            name: 'Not-tradable',
            value: 'Not-tradable',
          },
        ],
        dateFormat: null,
        timeFormat: null,
        timeZone: null,
        numberFormat: null,
        hidden: false,
      },
    },
    {
      id: 'KozDfEkMHGcNMQ',
      name: 'Characteristic',
      type: EDatabasePropertyType.MULTI_SELECT,
      settings: {
        width: 200,
        options: [],
        dateFormat: null,
        timeFormat: null,
        timeZone: null,
        numberFormat: null,
        hidden: false,
      },
    },
  ],
  sortBy: [
    {
      propertyId: 'Vzn9rTTVNSBf3FRfsOMWE',
      order: 'desc',
    },
    {
      propertyId: 'vx6uV4OtkSbxlYI1GC4eJ',
      order: 'asc',
    },
    {
      propertyId: 'xFrpZIut3zS5xXa9BZhBj',
      order: 'asc',
    },
  ],
};

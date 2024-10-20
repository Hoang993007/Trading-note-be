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
        dateFormat: 'DD/MM/YYYY',
        hidden: false,
      },
    },
    {
      id: 'vx6uV4OtkSbxlYI1GC4eJ',
      name: 'Day in week',
      type: EDatabasePropertyType.SELECT,
      settings: {
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
        options: [],
        hidden: false,
      },
    },
    {
      id: 'xFrpZIut3zS5xXa9BZhBj',
      name: 'Time',
      type: EDatabasePropertyType.TIME,
      settings: {
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
        hidden: false,
      },
    },
    {
      id: 'uvW13UaaYxHVgPq4CTkPx',
      name: '1m TF',
      type: EDatabasePropertyType.IMAGE,
      settings: {
        hidden: false,
      },
    },
    {
      id: '8WEIRW-dxscGiYRUYXi94',
      name: 'Factors',
      type: EDatabasePropertyType.MULTI_SELECT,
      settings: {
        options: [],
        hidden: false,
      },
    },
    {
      id: 'rJgneTwoa9X7DpazgAY0a',
      name: 'Cautious',
      type: EDatabasePropertyType.MULTI_SELECT,
      settings: {
        options: [],
        hidden: false,
      },
    },
    {
      id: 'icf-fCzZ5OjjRsIe1adWY',
      name: 'Result',
      type: EDatabasePropertyType.SELECT,
      settings: {
        options: [
          { name: 'Win', value: 'win', color: 'green' },
          { name: 'Lose', value: 'lose', color: 'red' },
          { name: 'Break even', value: 'break_even', color: 'yellow' },
          { name: 'Miss win', value: 'miss_win', color: 'gray' },
        ],
        hidden: false,
      },
    },
    {
      id: 'OfRnTqswOuSruyvBz-x5X',
      name: 'Feeling & Thoughts',
      type: EDatabasePropertyType.TEXT,
      settings: {
        hidden: false,
      },
    },
    {
      id: 'cPFpBf73XH4_pKC7Zq4Zx',
      name: 'Comment',
      type: EDatabasePropertyType.TEXT,
      settings: {
        hidden: false,
      },
    },
  ],
  sortBy: [
    {
      propertyId: 'Vzn9rTTVNSBf3FRfsOMWE', // Date
      order: 'desc',
    },
    {
      propertyId: 'vx6uV4OtkSbxlYI1GC4eJ', // Day in week
      order: 'asc',
    },
    {
      propertyId: 'xFrpZIut3zS5xXa9BZhBj', // Time
      order: 'asc',
    },
  ],
};

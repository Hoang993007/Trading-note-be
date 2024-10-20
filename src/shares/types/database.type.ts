export enum EDatabasePropertyType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  TIME = 'time',
  CHECKBOX = 'checkbox',
  SELECT = 'select',
  MULTI_SELECT = 'multi-select',
  RADIO = 'radio',
  FILE = 'file',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  LINK = 'link',
  EMAIL = 'email',
}

export type TDatabasePropertySettingsOption = {
  name: string;
  value: string;
  icon?: string;
  color?: string;
};

export type TDatabasePropertySettings = {
  options?: TDatabasePropertySettingsOption[];
  dateFormat?: string;
  timeFormat?: string;
  timeZone?: string;
  numberFormat?: string;
};

export type TDatabaseProperty = {
  id: string;
  name: string;
  type: EDatabasePropertyType;
  settings: TDatabasePropertySettings;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TDatabaseSortBy = {
  propertyId: string;
  order: 'asc' | 'desc';
};

export type TDatabase = {
  id: string;
  name: string;
  properties: TDatabaseProperty[];
  sortBy: TDatabaseSortBy[];
  createdAt: Date;
  updatedAt: Date;
};

export type TDatabaseDataValue = {
  propertyId: string;
  value: any;
}

export type TDatabaseData = {
  id: string;
  databaseId: string;
  values: TDatabaseDataValue[];
  createdAt?: Date;
  updatedAt?: Date;
};

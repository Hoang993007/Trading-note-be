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
  BOOLEAN = 'boolean',
}

export type TDatabasePropertySettingsOption = {
  name: string;
  value: string;
  icon?: string;
  color?: string;
};

export type TDatabasePropertySettings = {
  width: number;
  options?: TDatabasePropertySettingsOption[];
  dateFormat?: string;
  timeFormat?: string;
  timeZone?: string;
  numberFormat?: string;
  hidden?: boolean;
};

export type TDatabaseProperty = {
  id: string;
  name: string;
  type: EDatabasePropertyType;
  settings: TDatabasePropertySettings;
  isDeleted?: boolean;
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
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TDatabaseDataValueValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[]
  | null
  | undefined;

export type TDatabaseDataValue = {
  propertyId: string;
  value: TDatabaseDataValueValue;
};

export type TDatabaseData = {
  id: string;
  databaseId: string;
  values: TDatabaseDataValue[];
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

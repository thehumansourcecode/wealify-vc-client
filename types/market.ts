export enum CaseHardenedKeyword {
  T1 = 'T1',
  T2 = 'T2',
  T3 = 'T3',
  T4 = 'T4',
}

export enum DopplerKeyword {
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4',
  RUBY = '',
  SAPPHIRE = '',
  BLACK_PEARL = '',
}

export enum GammaDopplerKeyword {
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4',
  EMERALD = '',
}

export enum ItemCategoryGroup {
  KNIVES = 'KNIVES',
  GLOVES = 'GLOVES',
  RIFLES = 'RIFLES',
  PISTOLS = 'PISTOLS',
  SMGS = 'SMGS',
  SHOTGUNS = 'SHOTGUNS',
  MACHINEGUNS = 'MACHINEGUNS',
  STICKERS = 'STICKERS',
  OTHERS = 'OTHERS',
}

export enum ItemGroup {
  CONTRABAND = 'Contraband',
  COVERT = 'Covert',
  CLASSIFIED = 'Classified',
  RESTRICTED = 'Restricted',
  MIL_SPEC_GRADE = 'Mil-Spec Grade',
  INDUSTRIAL_GRADE = 'Industrial Grade',
  CONSUMER_GRADE = 'Consumer Grade',
  EXTRAORDINARY = 'Extraordinary',
  REMARKABLE = 'Remarkable',
  EXOTIC = 'Exotic',
  HIGH_GRADE = 'High Grade',
  BASE_GRADE = 'Base Grade',
  DISTINGUISHED = 'Distinguished',
  EXCEPTIONAL = 'Exceptional',
  SUPERIOR = 'Superior',
  MASTER = 'Master',
}

export enum ItemCategoryGroupHashed {
  'CSGO_Type_Knife',
  'CSGO_Type_Pistol',
  'CSGO_Type_Rifle',
  'CSGO_Type_SMG',
  'CSGO_Type_Shotgun',
  'CSGO_Type_Machinegun',
  'Type_Hands',
  'Other',
  'CSGO_Tool_Sticker',
  'CSGO_Type_Equipment',
  'CSGO_Tool_Keychain',
}

export enum ItemCategory {
  // KNIVES
  BUTTERFLY = 'Butterfly Knife',
  M9_BAYONET = 'M9 Bayonet',
  KARAMBIT = 'Karambit',
  KUKRI = 'Kukri',
  SKELETON = 'Skeleton',
  BAYONET = 'Bayonet',
  TALON = 'Talon',
  NOMAD = 'Nomad',
  FLIP = 'Flip',
  STILETTO = 'Stiletto',
  CLASSIC = 'Classic',
  URSUS = 'Ursus',
  HUNTSMAN = 'Huntsman',
  PARACORD = 'Paracord',
  SURVIVAL = 'Survival',
  FALCHION = 'Falchion',
  SHADOW_DAGGERS = 'Shadow Daggers',
  BOWIE = 'Bowie',
  GUT = 'Gut',
  NAVAJA = 'Navaja',

  // GLOVES
  SPORT = 'Sport Gloves',
  SPECIALIST = 'Specialist Gloves',
  MOTO = 'Moto Gloves',
  DRIVER = 'Driver Gloves',
  HAND_WRAPS = 'Hand Wraps',
  BROKEN_FANG = 'Broken Fang',
  HYDRA = 'Hydra Gloves',
  BLOODHOUND = 'Bloodhound Gloves',

  // RIFLES
  AK = 'AK-47',
  AWP = 'AWP',
  M4A1 = 'M4A1-S',
  M4A4 = 'M4A4',
  AUG = 'AUG',
  SG553 = 'SG553',
  FAMAS = 'FAMAS',
  GALIL = 'Galil AR',
  SCOUT = 'SSG 08',
  SCAR20 = 'SCAR-20',
  GS3G1 = 'GS3G1',

  // PISTOL
  DESERT_EAGLE = 'Desert Eagle',
  USP = 'USP-S',
  GLOCK = 'Glock-18',
  P2000 = 'P2000',
  P250 = 'P250',
  FN57 = 'Five-SeveN',
  R8 = 'R8 Revolver',
  TEC9 = 'Tec-9',
  DUALIES = 'Dual Berettas',
  CZ75 = 'CZ75-Auto',
  ZEUS = 'Zeus x27',

  // SMG
  MP9 = 'MP9',
  MAC10 = 'MAC-10',
  UMP45 = 'UMP-45',
  P90 = 'P90',
  MP7 = 'MP7',
  BIZON = 'PP-Bizon',
  MP5SD = 'MP5-SD',

  // SHOTGUN
  XM1014 = 'XM1014',
  MAG7 = 'MAG-7',
  SAWED = 'Sawed-Off',
  NOVA = 'Nova',

  // MACHINEGUNS
  M249 = 'M249',
  NEGEV = 'Negev',
}

export enum ItemExterior {
  NOT_PAINTED = 'NOT_PAINTED',
  FACTORY_NEW = 'FACTORY_NEW',
  MINIMAL_WEAR = 'MINIMAL_WEAR',
  FIELD_TESTED = 'FIELD_TESTED',
  WELL_WORN = 'WELL_WORN',
  BATTLE_SCARRED = 'BATTLE_SCARRED',
}

export enum ItemQuality {
  NORMAL = 'NORMAL',
  TOURNAMENT = 'TOURNAMENT',
  STRANGE = 'STRANGE',
  UNUSUAL = 'UNUSUAL',
  UNUSUAL_STRANGE = 'UNUSUAL_STRANGE',
}

export enum ItemSortBy {
  BEST_DEALS = 'BEST_DEAL',
  PRICE = 'PRICE',
  NAME = 'NAME',
}

export enum DetailItemSortBy {
  PRICE = 'PRICE',
}

export enum SortOrder {
  DESC = 'DESC',
  ASC = 'ASC',
}

export interface IGetPreviewItemListParams {
  page: number
  limit?: number
  keyword?: string
  category?: ItemCategory
  categoryGroup?: ItemCategoryGroup
  minPrice?: number
  maxPrice?: number
  exterior?: ItemExterior
  quality?: ItemQuality
  sortBy?: ItemSortBy
  sortOrder?: SortOrder
}

export interface IGetItemListParams {
  templateId?: number
  paintSeed?: number
  keyword?: string | GammaDopplerKeyword | DopplerKeyword | CaseHardenedKeyword
  minPrice?: number
  maxPrice?: number
  minAbrade?: number
  maxAbrade?: number
  minFadeVal?: number
  maxFadeVal?: number
  pendentTemplate?: string // x-y or x
}

export interface IPreviewItemData {
  itemId: number
  itemName: string
  marketHashName: string
  previewImageUrl: string
  priceRmb: number
  steamPriceUsd: null | number
  itemCount: string
  priceUsd: number
  exterior: ItemExterior
  categoryGroup: ItemCategoryGroup
  quality: ItemQuality
  buffPriceRmb: number
  buffPriceUsd: number
  youpinBuffPrice: string
  itemBuffPrice: string
  itemBuffId: string
}

export interface IDopplerItemData {
  commodityName: string
  marketHashName: string
  previewImageUrl: string
  itemBuffId: number
  itemTagId: number
  youpinPhase: string
  youpinTemplateId: number
  priceUsd: number
  priceRmb: number
  buffPriceRmb: number
  buffPriceUsd: number
  YoupinBuffPrice: number
}

export const ItemCategoryMap: Record<ItemCategory, ItemCategoryGroup> = {
  [ItemCategory.BUTTERFLY]: ItemCategoryGroup.KNIVES,
  [ItemCategory.M9_BAYONET]: ItemCategoryGroup.KNIVES,
  [ItemCategory.KARAMBIT]: ItemCategoryGroup.KNIVES,
  [ItemCategory.KUKRI]: ItemCategoryGroup.KNIVES,
  [ItemCategory.SKELETON]: ItemCategoryGroup.KNIVES,
  [ItemCategory.BAYONET]: ItemCategoryGroup.KNIVES,
  [ItemCategory.TALON]: ItemCategoryGroup.KNIVES,
  [ItemCategory.NOMAD]: ItemCategoryGroup.KNIVES,
  [ItemCategory.FLIP]: ItemCategoryGroup.KNIVES,
  [ItemCategory.STILETTO]: ItemCategoryGroup.KNIVES,
  [ItemCategory.CLASSIC]: ItemCategoryGroup.KNIVES,
  [ItemCategory.URSUS]: ItemCategoryGroup.KNIVES,
  [ItemCategory.HUNTSMAN]: ItemCategoryGroup.KNIVES,
  [ItemCategory.PARACORD]: ItemCategoryGroup.KNIVES,
  [ItemCategory.SURVIVAL]: ItemCategoryGroup.KNIVES,
  [ItemCategory.FALCHION]: ItemCategoryGroup.KNIVES,
  [ItemCategory.SHADOW_DAGGERS]: ItemCategoryGroup.KNIVES,
  [ItemCategory.BOWIE]: ItemCategoryGroup.KNIVES,
  [ItemCategory.GUT]: ItemCategoryGroup.KNIVES,
  [ItemCategory.NAVAJA]: ItemCategoryGroup.KNIVES,

  [ItemCategory.SPORT]: ItemCategoryGroup.GLOVES,
  [ItemCategory.SPECIALIST]: ItemCategoryGroup.GLOVES,
  [ItemCategory.MOTO]: ItemCategoryGroup.GLOVES,
  [ItemCategory.DRIVER]: ItemCategoryGroup.GLOVES,
  [ItemCategory.HAND_WRAPS]: ItemCategoryGroup.GLOVES,
  [ItemCategory.BROKEN_FANG]: ItemCategoryGroup.GLOVES,
  [ItemCategory.HYDRA]: ItemCategoryGroup.GLOVES,
  [ItemCategory.BLOODHOUND]: ItemCategoryGroup.GLOVES,

  [ItemCategory.AK]: ItemCategoryGroup.RIFLES,
  [ItemCategory.AUG]: ItemCategoryGroup.RIFLES,
  [ItemCategory.AWP]: ItemCategoryGroup.RIFLES,
  [ItemCategory.M4A1]: ItemCategoryGroup.RIFLES,
  [ItemCategory.M4A4]: ItemCategoryGroup.RIFLES,
  [ItemCategory.FAMAS]: ItemCategoryGroup.RIFLES,
  [ItemCategory.GALIL]: ItemCategoryGroup.RIFLES,
  [ItemCategory.SG553]: ItemCategoryGroup.RIFLES,
  [ItemCategory.SCOUT]: ItemCategoryGroup.RIFLES,
  [ItemCategory.SCAR20]: ItemCategoryGroup.RIFLES,
  [ItemCategory.GS3G1]: ItemCategoryGroup.RIFLES,

  [ItemCategory.DESERT_EAGLE]: ItemCategoryGroup.PISTOLS,
  [ItemCategory.USP]: ItemCategoryGroup.PISTOLS,
  [ItemCategory.GLOCK]: ItemCategoryGroup.PISTOLS,
  [ItemCategory.P2000]: ItemCategoryGroup.PISTOLS,
  [ItemCategory.P250]: ItemCategoryGroup.PISTOLS,
  [ItemCategory.FN57]: ItemCategoryGroup.PISTOLS,
  [ItemCategory.R8]: ItemCategoryGroup.PISTOLS,
  [ItemCategory.TEC9]: ItemCategoryGroup.PISTOLS,
  [ItemCategory.DUALIES]: ItemCategoryGroup.PISTOLS,
  [ItemCategory.CZ75]: ItemCategoryGroup.PISTOLS,
  [ItemCategory.ZEUS]: ItemCategoryGroup.PISTOLS,

  [ItemCategory.MP9]: ItemCategoryGroup.SMGS,
  [ItemCategory.MAC10]: ItemCategoryGroup.SMGS,
  [ItemCategory.UMP45]: ItemCategoryGroup.SMGS,
  [ItemCategory.P90]: ItemCategoryGroup.SMGS,
  [ItemCategory.MP7]: ItemCategoryGroup.SMGS,
  [ItemCategory.BIZON]: ItemCategoryGroup.SMGS,
  [ItemCategory.MP5SD]: ItemCategoryGroup.SMGS,
  [ItemCategory.XM1014]: ItemCategoryGroup.SHOTGUNS,
  [ItemCategory.MAG7]: ItemCategoryGroup.SHOTGUNS,
  [ItemCategory.SAWED]: ItemCategoryGroup.SHOTGUNS,
  [ItemCategory.NOVA]: ItemCategoryGroup.SHOTGUNS,

  [ItemCategory.M249]: ItemCategoryGroup.MACHINEGUNS,
  [ItemCategory.NEGEV]: ItemCategoryGroup.MACHINEGUNS,
}

export interface ICheckoutForm {
  discountCode?: string
  steamTradeUrl: string
}

export interface ICheckoutParams {
  commodityId: string
  tradeUrl: string
  joinSteamDate: string
  sellAmount: number
  paySellAmount: number
}

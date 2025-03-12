export interface IItemData {
  Id: string
  Type: number
  GameId: number
  UserId: number
  CommodityNo: string
  CommodityName: string
  TemplateId: number
  IconUrl: string
  IconUrlLarge: string
  Price: string
  HaveSticker: number
  HaveNameTag: number
  CanSold: number
  UserNickName: string
  UserAvatar: string
  IsMine: boolean
  TypeName: string
  CommodityHashName: string
  Abrade: string
  Stickers: IItemStickerData[]
  DopplerStatus: number
  DopplerName: null | string
  DopplerColor: null | string
  FadeStatus: number
  FadeName: null | string
  FadeColor: null | string
  FadeNumber: null | string
  IsHardened: number
  HardenedName: null | string
  HardenedColor: null | string
  SecondDFrontImage: string
  CommodityListType: number
  unit: string
  price_rmb: number
  price_usd: number
}

export interface IItemStickerData {
  priceV1: number
  StickerId: number
  RawIndex: number
  Name: string
  HashName: string
  Material: string
  ImgUrl: string
  Price: null | number
  Abrade: number
  TemplateHashName: string
  SteamHashName: null | string
}

export interface IItemTemplateInfo {
  id: number
  gameId: number
  commodityName: string
  commodityHashName: string
  iconUrl: string
  iconUrlLarge: string
  steamPrice: string
  steamUSDPrice: string
  haveSold: number | null
  haveLease: number | null
  typeName: string
  typeHashName: string
  rarityName: string
  rarityColor: string
  qualityName: string
  qualityColor: string
  exteriorName: string
  exteriorColor: string
  isDoppler: number
  isFade: number
  isHardened: number
  isSpecial: number
  weaponHashName: string
  sellNumber: number
  leaseNumber: number
  noLongLeaseNumber: number
  purchaseNumber: number
  supportAbrade: number
  jumpSteamLinkUrl: string
}

export interface IItemExterior {
  Name: string
  FixedVal: string
  IsSelected: boolean
  SellPrice: string
}

export interface IItemAbrade {
  MaxVal: string
  MinVal: string
  Name: string
  ShowName: string
}

export interface IItemSpecialStyle {
  ShowName: string
  Name: string
  QueryString: 'string'
  SpecialType: number
}

export interface IItemGeneralDetail {
  templateInfo: IItemTemplateInfo
  exteriorList?: IItemExterior[]
  abradeRangeList?: IItemAbrade[]
  specialStyleList?: IItemSpecialStyle[]
  //   fadeRangeList: IItemFade[]
}

export interface IItemGeneralDetailResponse {
  abradeRangeList: IItemAbrade[]
  specialStyleList: IItemSpecialStyle[]
  templateInfo: IItemTemplateInfo
  filters: {
    FilterKey: string
    Items: {
      Name: string
      FixedVal: string
      IsSelected: boolean
      SellPrice: string
    }[]
  }[]
}

export interface IItemGiftPriceData {
  commodityId: number
  commodityPriceRmb: number
  commodityPriceUsd: number
  commodityConversionPriceRmb: number
  commodityConversionPriceUsd: number
  cs2AgentFeeRmb: number
  cs2AgentFeeUsd: number
  tierDiscountRmb?: number
  tierDiscountUsd?: number
  depositAmountRmb?: number
  depositAmountUsd?: number
  partnershipDiscountRmb?: number
  partnershipDiscountUsd?: number
  finalAmountRmb?: number
  finalAmountUsd?: number
}

export interface ISteamUserData {
  personaName: string
  avatarfull: string
  playerLevel: string
  gameTime: string
  timecreated: string
  joinSteamDate: string
}

export interface IDiscountCodeData {
  result: boolean
  expiredDate: string
  amount: number
  maxUsage: number
  usageCount: number
  maxUsageCountPerUser: number
  minOrderAmount: number
}

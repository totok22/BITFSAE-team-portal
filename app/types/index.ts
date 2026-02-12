// Global type definitions

export interface Slide {
  image: string
  alt: string
}

export interface Car {
  year: string
  model: string
  image: string
  specs: CarSpecs
  features: string[]
}

export interface CarSpecs {
  frame: string
  bodyMaterial: string
  suspensionFR: string
  suspensionRR: string
  dimensions: string
  wheelbase: string
  groundClearance: string
  motor: string
  batteryBrand: string
  batteryType: string
  transmission: string
  wheel: string
  tire: string
  weight: string
  maxPower: string
  maxVoltage: string
  capacity: string
}

export interface ImageUrls {
  HERO_0: string
  HERO_1: string
  HERO_2: string
  SPONSORS: string
  WECHAT_QRCODE: string
  SOCIAL_MEDIA_QRCODE: string
  CAR_E47: string
  NEWS_2025_11_24: string
  NEWS_2025_12_11: string
  NEWS_2026_01_09: string
  NEWS_2026_01_12_1: string
  [key: string]: string
}

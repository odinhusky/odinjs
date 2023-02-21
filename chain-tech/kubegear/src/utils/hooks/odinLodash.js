export const isPrimitive = v => {
  const vTypeof = typeof v
  if(vTypeof === 'object' || vTypeof === 'function') return false
  
  return true
}

export const isNil = v => (v == null)
export const isNull = v => (v === null)
export const isUndefined = v => (typeof v === 'undefined')
export const isSymbol = v => (typeof v === 'symbol')
export const isBigInt = v => (typeof v === 'bigint')
export const isTypeofObject = v => (typeof v === 'object')
export const isArray = v => (v.constructor === Array)
export const isObject = v => (v.constructor === Object)
export const isSet = v  => (v.constructor === Set)
export const isMap = v => (v.constructor === Map)

export const isEmpty = v => {
  if(isPrimitive(v)) return false
  if(isObject(v)) return Object.keys(v) === 0
  if(isArray(v)) return v.length === 0
  if(isSet(v) || isMap(v)) return v.size === 0
}

export const isEqual = (v1, v2) => {
  const v1Typeof = typeof v1
  const v2Typeof = typeof v2

  if(v1Typeof !== 'object' && v2Typeof !== 'object') return v1 === v2

  if(v1 === v2) return true

  const v1Keys = Object.keys(v1)
  const v2Keys = Object.keys(v2)

  if(v1Keys.length !== v2Keys.length) return false

  for(const key in v1) {
    const res = isEqual(v1[key], v2[key])
    if(res === false) return false
  }

  return true
}

export const getType = v => {
  const typeofType = typeof v
  let realType = ''

  if(isNull(v)) realType = 'null'
  if(!isNil(v)) {
    if(isArray(v)) realType = 'array'
    if(isSet(v)) realType = 'set'
    if(isMap(v)) realType = 'map'
  }
  
  if(realType === '') realType = typeofType

  return {
    typeofType,
    realType,
    value: v
  }
}
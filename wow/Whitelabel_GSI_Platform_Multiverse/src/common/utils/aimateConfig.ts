const DOMAIN = "aimate.am"
const buildOrigin = (subdomain: string) => `https://${subdomain}.${DOMAIN}`

const ASSISTANT_ORIGIN = buildOrigin("dev-cs")
const ASSISTANT_PATH = "/widget/assistant.html"
const ASSISTANT_USER_ID = "f6e6a2c3-63aa-4328-8576-c3c2930bc280"

const FANS_ORIGIN = buildOrigin("dev-aifans")
const FANS_PATH = "/widget/chatroom.html"
const FANS_VERSION = "1.0.3"

const RPG_ORIGIN = buildOrigin("aigames")
const RPG_URL = `${buildOrigin("aigame")}/?v=2.0.5`

export const getAssistantOrigin = () => ASSISTANT_ORIGIN

export const getAssistantUrl = (playerId: string) => {
  if (!playerId) return ""

  return `${ASSISTANT_ORIGIN}${ASSISTANT_PATH}?user_id=${ASSISTANT_USER_ID}&player_id=${playerId}`
}

export const getFansOrigin = () => FANS_ORIGIN

export const getFansUrl = (playerId: string) => {
  if (!playerId) return ""

  return `${FANS_ORIGIN}${FANS_PATH}?player_id=${playerId}&v=${FANS_VERSION}`
}

export const getRpgOrigin = () => RPG_ORIGIN

export const getRpgUrl = () => RPG_URL

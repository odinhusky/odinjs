import type { Kol } from "src/api/response.type"

import { defineStore } from "pinia"

import {
  CAPTION_TONE_OPTS,
  FASHION_OPTS,
  FIRST_NAMES,
  LANGUAGE_STYLE_OPTS,
  LAST_NAMES,
  LOCALE_OPTIONS,
  NATIONALITY_OPTIONS,
  PERSONALITY_OPTS,
  PHOTO_TOPIC_OPTS,
  POSE_OPTS,
  SCENE_OPTS,
  TIMEZONE_OPTIONS
} from "src/utils/constants/kolOptions"

export type Gender = "female" | "male"
export type HairLength = "long" | "short"

interface BodyInfo {
  age: number
  height: number
  weight: number
  gender: "female" | "male"
}

function getRandomValues<T extends { value: string }>(arr: T[], min = 1, max = 5): string[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((item) => item.value)
}

function getRandomName() {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
  return `${first} ${last}`
}

export const useKolStore = defineStore("kol", {
  state: (): Kol => ({
    name: "",
    locale: "en_MY", // 語言地區
    timezone: "Asia/Kuala_Lumpur", // 時區
    nationality: "Malaysia", // 國籍
    visual: {
      body_info: { height: 180, weight: 50, age: 20, gender: "male" },
      body_description: [],
      clothing_styles: [],
      scenes_pref: [],
      poses_pref: []
    },
    life: {
      traits: [],
      speech_style: [],
      catchphrases: []
    },
    content_style: {
      caption_tones: [],
      photo_topics: []
    },
    cadence: {
      lambda_per_day: 0.4,
      quiet_hours: [[1, 7]]
    },
    hard_do_not: {
      topics: [],
      words: [],
      guidelines: ""
    },
    kolId: ""
  }),
  getters: {
    isValidBasicInfo: (state: Kol): boolean => {
      return !!state.name && !!state.locale && !!state.timezone && !!state.nationality
    },

    isVisualInfoFilled: (state: Kol): boolean => {
      const info = state.visual.body_info
      return info.height > 0 && info.weight > 0 && info.age > 0
    },

    isVisualInfoSelectedFilled(state: Kol): string {
      const messages: Record<string, string> = {
        clothing_styles: "services.virtualKOL.error_empty_style",
        scenes_pref: "services.virtualKOL.error_empty_view",
        poses_pref: "services.virtualKOL.error_empty_pos",
        traits: "services.virtualKOL.error_empty_personality",
        speech_style: "services.virtualKOL.error_empty_speaking",
        caption_tones: "services.virtualKOL.error_empty_tone",
        photo_topics: "services.virtualKOL.error_empty_photo"
      }

      const fields = {
        clothing_styles: state.visual.clothing_styles,
        scenes_pref: state.visual.scenes_pref,
        poses_pref: state.visual.poses_pref,
        traits: state.life.traits,
        speech_style: state.life.speech_style,
        caption_tones: state.content_style.caption_tones,
        photo_topics: state.content_style.photo_topics
      }

      const emptyField = Object.entries(fields).find(([_, value]) => value.length === 0)
      return emptyField ? messages[emptyField[0]] || "" : ""
    },

    kolDataValidInfo(): { msg: string; validate: boolean } {
      return {
        msg: this.isVisualInfoSelectedFilled,
        validate: this.isValidBasicInfo && this.isVisualInfoFilled && !this.isVisualInfoSelectedFilled
      }
    }
  },
  actions: {
    resetKolState() {
      this.$reset()
      this.name = getRandomName()
    },
    getRandomBodyInfo(): BodyInfo {
      const gender = Math.random() < 0.5 ? "male" : "female"
      const age = Math.floor(Math.random() * (80 - 18 + 1)) + 18 // 18–80
      const height = Math.floor(Math.random() * (190 - 150 + 1)) + 150 // 150–190

      const heightM = height / 100
      const bmiMin = 18.5
      const bmiMax = gender === "male" ? 25 : 23.5

      const minWeight = bmiMin * heightM ** 2
      const maxWeight = bmiMax * heightM ** 2
      const weight = Math.round(Math.random() * (maxWeight - minWeight) + minWeight)

      return {
        age,
        height,
        weight,
        gender
      }
    },
    useRandomKolInfo(stepValue: "basic" | "life" | "post") {
      if (stepValue === "basic") {
        this.locale = getRandomValues(LOCALE_OPTIONS, 1)?.[0] || "" // 語言地區
        this.timezone = getRandomValues(TIMEZONE_OPTIONS, 1)?.[0] || "" // 時區
        this.nationality = getRandomValues(NATIONALITY_OPTIONS, 1)?.[0] || "" // 國籍
        this.name = getRandomName()
        this.visual.body_info = this.getRandomBodyInfo()
      }

      if (stepValue === "life") {
        this.visual.clothing_styles = getRandomValues(FASHION_OPTS)
        this.visual.scenes_pref = getRandomValues(SCENE_OPTS)
        this.visual.poses_pref = getRandomValues(POSE_OPTS)
        this.life.traits = getRandomValues(PERSONALITY_OPTS)
        this.life.speech_style = getRandomValues(LANGUAGE_STYLE_OPTS)
        this.content_style.caption_tones = getRandomValues(CAPTION_TONE_OPTS)
        this.content_style.photo_topics = getRandomValues(PHOTO_TOPIC_OPTS)
      }
    }
  }
})

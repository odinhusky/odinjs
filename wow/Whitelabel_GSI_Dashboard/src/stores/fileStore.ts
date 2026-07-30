import { defineStore } from "pinia"

export const useFileStore = defineStore("fileStore", {
  state: () => ({
    files: new Map<string, File>() // key = file.name
  }),

  actions: {
    setFile(file: File) {
      this.files.set(file.name, file)
    },
    getFile(fileName: string): File | undefined {
      return this.files.get(fileName)
    },
    removeFile(fileName: string) {
      this.files.delete(fileName)
    },
    clearFiles() {
      this.files.clear()
    }
  }
})

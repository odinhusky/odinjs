<template>
  <div class="w-full flex-1 flex flex-col justify-center items-center">
    <div class="flex flex-col justify-center items-center gap-5">
      <img :src="svgImg('no-data')" alt="No Data" />
      <p class="font-[NotoSansTC] font-bold text-[.875rem] leading-[1.0625rem] text-[#858585]">
        {{ $t("common.no_data") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useImage } from "@/hook/useImage"

  const { svgImg } = useImage()
</script>

<style scoped lang="scss"></style>

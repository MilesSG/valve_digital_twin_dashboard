<template>
  <el-config-provider :locale="elementLocale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'

const { elementLocale } = useLocale()
</script>

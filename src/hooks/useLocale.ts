import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

export function useLocale() {
  const { locale } = useI18n()

  // Element Plus的locale
  const elementLocale = computed(() => {
    return locale.value === 'zh-CN' ? zhCn : en
  })

  // 切换语言
  const toggleLocale = () => {
    const newLocale = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  // 设置语言
  const setLocale = (lang: string) => {
    locale.value = lang
    localStorage.setItem('locale', lang)
  }

  // 当前语言显示名称
  const currentLocaleName = computed(() => {
    return locale.value === 'zh-CN' ? '中文' : 'English'
  })

  return {
    locale,
    elementLocale,
    toggleLocale,
    setLocale,
    currentLocaleName,
  }
}

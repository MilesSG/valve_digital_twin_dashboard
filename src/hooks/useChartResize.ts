import { onMounted, onUnmounted, Ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import type { ECharts } from 'echarts'

export function useChartResize(chartRef: Ref<HTMLElement | undefined>, chartInstance: Ref<ECharts | null>) {
  const handleResize = () => {
    if (chartInstance.value) {
      chartInstance.value.resize()
    }
  }

  onMounted(() => {
    if (chartRef.value) {
      useResizeObserver(chartRef.value, handleResize)
    }
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    handleResize
  }
}

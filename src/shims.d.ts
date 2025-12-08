// Type declarations for modules without TypeScript definitions

declare module 'mockjs' {
  interface MockjsRandom {
    integer(min: number, max: number): number
    float(min: number, max: number, dmin?: number, dmax?: number): number
    string(pool: string, min: number, max: number): string
    cname(): string
    cparagraph(len: number): string
    boolean(): boolean
    pick<T>(arr: T[]): T
  }

  interface Mockjs {
    Random: MockjsRandom
    mock(template: any): any
  }

  const Mock: Mockjs
  export default Mock
}

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  import type { Language } from 'element-plus/es/locale'
  const locale: Language
  export default locale
}

declare module 'element-plus/dist/locale/en.mjs' {
  import type { Language } from 'element-plus/es/locale'
  const locale: Language
  export default locale
}

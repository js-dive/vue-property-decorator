import Vue from 'vue'
import { createDecorator } from 'vue-class-component'

/**
 * decorator of a ref prop
 * @param refKey the ref key defined in template
 */
export function Ref(refKey?: string) {
  return createDecorator((options, key) => {
    options.computed = options.computed || {}

    // 被Ref装饰后，组件选项computed中将会多出与ref相关的配置，以用于获取组件/DOM引用
    options.computed[key] = {
      cache: false,
      get(this: Vue) {
        return this.$refs[refKey || key]
      },
    }
  })
}

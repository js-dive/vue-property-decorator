import Vue, { PropOptions } from 'vue'
import { createDecorator } from 'vue-class-component'
import { Constructor } from 'vue/types/options'
import { applyMetadata } from '../helpers/metadata'

/**
 * decorator of a synced prop
 * @param propName the name to interface with from outside, must be different from decorated property
 * @param options the options for the synced prop
 * @return PropertyDecorator | void
 */
export function PropSync(
  propName: string,
  options: PropOptions | Constructor[] | Constructor = {},
) {
  return (target: Vue, key: string) => {
    applyMetadata(options, target, key)
    createDecorator((componentOptions, k) => {
      // 被PropSync装饰后

      // 组件选项props中将会多出对应配置
      ;(componentOptions.props || (componentOptions.props = {} as any))[
        propName
      ] = options

      // 同时，组件选项computed中也会多出相应的、包含get/set的配置
      ;(componentOptions.computed || (componentOptions.computed = {}))[k] = {
        get() {
          // get即获取props
          return (this as any)[propName]
        },
        set(this: Vue, value) {
          // set即给父组件抛事件，让父组件改变prop
          this.$emit(`update:${propName}`, value)
        },
      }
    })(target, key)
  }
}

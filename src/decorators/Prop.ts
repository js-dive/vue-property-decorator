import Vue, { PropOptions } from 'vue'
import { createDecorator } from 'vue-class-component'
import { Constructor } from 'vue/types/options'
import { applyMetadata } from '../helpers/metadata'

/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
export function Prop(options: PropOptions | Constructor[] | Constructor = {}) {
  return (target: Vue, key: string) => {
    applyMetadata(options, target, key)
    createDecorator((componentOptions, k) => {
      // 被Prop装饰后，组件选项props配置中将会多出对应配置
      ;(componentOptions.props || ((componentOptions.props = {}) as any))[
        k
      ] = options
    })(target, key)
  }
}

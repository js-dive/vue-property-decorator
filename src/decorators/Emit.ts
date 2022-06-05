import Vue from 'vue'

// Code copied from Vue/src/shared/util.js
const hyphenateRE = /\B([A-Z])/g
const hyphenate = (str: string) => str.replace(hyphenateRE, '-$1').toLowerCase()

/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
export function Emit(event?: string) {
  return function (_target: Vue, propertyKey: string, descriptor: any) {
    const key = hyphenate(propertyKey)
    // 原始的、被装饰的函数
    const original = descriptor.value
    descriptor.value = function emitter(...args: any[]) {
      const emit = (returnValue: any) => {
        // 事件名称要么是从外面传入的事件，要么是被转化为连字符命名后的key
        const emitName = event || key

        // 如果原始函数返回值为空值
        if (returnValue === undefined) {
          if (args.length === 0) {
            this.$emit(emitName)
          } else if (args.length === 1) {
            this.$emit(emitName, args[0])
          } else {
            this.$emit(emitName, ...args)
          }
        } else {
          // 如果原始函数返回值不为空值
          // 就把该返回值作为this.$emit事件名后第一个参数进行调用
          args.unshift(returnValue)
          this.$emit(emitName, ...args)
        }
      }

      // 执行一下被装饰的函数，得到一个返回值
      const returnValue: any = original.apply(this, args)

      if (isPromise(returnValue)) {
        returnValue.then(emit)
      } else {
        emit(returnValue)
      }

      return returnValue
    }
  }
}

function isPromise(obj: any): obj is Promise<any> {
  return obj instanceof Promise || (obj && typeof obj.then === 'function')
}

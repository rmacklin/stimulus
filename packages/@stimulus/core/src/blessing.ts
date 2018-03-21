export interface BlessingConstructor {
  new(blessable: Function): Blessing
}

export class Blessing {
  readonly blessable: Function

  constructor(blessable: Function) {
    this.blessable = blessable
  }

  bless(): Function {
    const blessable = extend(this.blessable)
    Object.defineProperties(blessable.prototype, this.properties)
    return blessable
  }

  get properties(): PropertyDescriptorMap {
    const properties: PropertyDescriptorMap = {}
    const allProperties = this.allProperties
    for (const key in allProperties) {
      if (!(key in this.blessable)) {
        properties[key] = allProperties[key]
      }
    }
    return properties
  }

  get allProperties(): PropertyDescriptorMap {
    return {}
  }

  get ancestor(): this | undefined {
    const blessable: Function = Object.getPrototypeOf(this.blessable)
    if (blessable) {
      return new (this.constructor as BlessingConstructor)(blessable) as this
    }
  }
}

export function performBlessings<T extends Function>(blessable: T, blessingConstructors: BlessingConstructor[]): T {
  return blessingConstructors.reduce((blessable, constructor) => (new constructor(blessable)).bless(), blessable) as T
}

const extend = (() => {
  function extendWithReflect(constructor) {
    function anonymous() {
      return Reflect.construct(constructor, arguments, new.target)
    }

    anonymous.prototype = Object.create(constructor.prototype, {
      constructor: { value: anonymous }
    })

    Reflect.setPrototypeOf(anonymous, constructor)
    return anonymous as any
  }

  function testReflectExtension() {
    const a = function() { this.a.call(this) }
    const b = extendWithReflect(a)
    b.prototype.a = function() {}
    return new b
  }

  try {
    testReflectExtension()
    return extendWithReflect
  } catch (error) {
    return (constructor) => class anonymous extends constructor {}
  }
})()

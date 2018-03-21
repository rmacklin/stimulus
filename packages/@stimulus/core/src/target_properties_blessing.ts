import { LinkedPropertyBlessing } from "./linked_property_blessing"

export class TargetPropertiesBlessing extends LinkedPropertyBlessing {
  static propertyName = "targets"

  getPropertiesForValue(name: string): PropertyDescriptorMap {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name)
          if (target) {
            return target
          } else {
            throw new Error(`Missing target element "${this.identifier}.${name}"`)
          }
        }
      },

      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name)
        }
      },

      [`has${capitalize(name)}Target`]: {
        get() {
          return this.targets.has(name)
        }
      }
    }
  }
}

function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

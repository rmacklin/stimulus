import { Blessing } from "./blessing"

export class LinkedPropertyBlessing extends Blessing {
  static propertyName: string

  get allProperties(): PropertyDescriptorMap {
    const allProperties: PropertyDescriptorMap = {}
    for (const value of this.values) {
      Object.assign(allProperties, this.getPropertiesForValue(value))
    }
    return allProperties
  }

  getPropertiesForValue(value: string): PropertyDescriptorMap {
    return {}
  }

  get values(): string[] {
    const ancestor = this.ancestor
    const values = new Set(this.ownValues.concat(ancestor ? ancestor.values : []))
    return Array.from(values)
  }

  get ownValues(): string[] {
    const ownValues = this.blessable[this.propertyName]
    return Array.isArray(ownValues) ? ownValues : []
  }

  get propertyName(): string {
    return (this.constructor as any).propertyName as string
  }
}

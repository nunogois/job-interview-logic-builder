// Tried a more OOP approach this time.
// Not a huge fan of OOP but it applied well here, since constructors are useful for our use case.
// I think overall the code is also simpler and more readable this way.

// Used uuid for unique IDs on the args, but could have also generated some random ones.
import { v4 as uuidv4 } from 'uuid'

class Argument {
  id: string
  name: string
  value: boolean

  constructor(name: string = 'Arg #1', value: boolean = true) {
    this.id = uuidv4()
    this.name = name
    this.value = value
  }
}

class Operation {
  operator: Operator
  value: boolean
  argument: string
  group: Operation[]

  constructor(
    operator: Operator = '',
    value: boolean = true,
    argument: string = '',
    group: Operation[] = []
  ) {
    this.operator = operator
    this.value = value
    this.argument = argument
    this.group = group
  }
}

type Operator = '' | 'const' | 'arg' | 'and' | 'or'

export { Argument, Operation, Operator }

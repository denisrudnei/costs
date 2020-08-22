import { registerEnumType } from 'type-graphql'

enum CostType {
  PROFIT = 'PROFIT',
  SPENT = 'SPENT',
}

registerEnumType(CostType, {
  name: 'CostType',
})

export default CostType

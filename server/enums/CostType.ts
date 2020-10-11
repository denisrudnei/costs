import { registerEnumType } from 'type-graphql';

enum CostType {
  PROFIT = 'PROFIT',
  SPENT = 'SPENT',
  CONSOLIDATED = 'CONSOLIDATED',
}

registerEnumType(CostType, {
  name: 'CostType',
});

export default CostType;

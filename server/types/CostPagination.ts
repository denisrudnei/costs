import {
  Field, ObjectType, Int, registerEnumType,
} from 'type-graphql';
import { Cost } from '../../server/models/Cost';

export enum SortType {
  NAME = 'name',
  TYPE = 'type',
  VALUE = 'value',
  DATE = 'date'
}

export enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC'
}

registerEnumType(SortType, {
  name: 'SortType',
});

registerEnumType(OrderType, {
  name: 'OrderType',
});

@ObjectType()
export class CostPagination {
  constructor(options: CostPagination) {
    Object.assign(this, options);
  }

  @Field(() => [Cost])
  public costs!: Cost[]

  @Field(() => Int)
  public pages!: number

  @Field(() => Int)
  public page!: number

  @Field(() => Int)
  public limit: 5 | 10 | 15 | 20 | 25 = 10

  @Field(() => Int)
  public total!: number
}

export type PaginationOptions = {
  search: string
  page: number
  limit: CostPagination['limit']
  type: keyof typeof SortType
  order: keyof typeof OrderType
}

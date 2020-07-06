import { ObjectType, Field, ID } from "type-graphql";
import { Item } from "./Item";
import { User } from "./User";
@ObjectType()
export class Purchase {
  @Field(() => ID) id: string;
  @Field(() => Item) item: Item;
  @Field() itemId: string;
  @Field() isPaid: boolean;
  @Field() amount: string;
  @Field() quantity: string;
  @Field(() => User) user: User;
  @Field() userId: string;
}

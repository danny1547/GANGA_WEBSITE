import { ObjectType, Field, ID } from "type-graphql";
import { Item } from "./Item";

@ObjectType()
export class Shop {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() email: string;
  @Field() password: string;
  @Field(() => [Item], { nullable: true }) items: Item[];
}

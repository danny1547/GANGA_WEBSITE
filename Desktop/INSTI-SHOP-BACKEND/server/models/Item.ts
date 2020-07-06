import { ObjectType, Field, ID } from "type-graphql";
import { Purchase } from "./Purchase";
import { Shop } from "./Shop";

@ObjectType()
export class Item {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() imageUrl: string;
  @Field() quantity: string;
  @Field() description: string;
  @Field() price: string;
  @Field() shopId: string;
  @Field() isAvailable: boolean;
  @Field(() => [Purchase]) purchases: Purchase[];
  @Field(() => Shop) shop: Shop;
}

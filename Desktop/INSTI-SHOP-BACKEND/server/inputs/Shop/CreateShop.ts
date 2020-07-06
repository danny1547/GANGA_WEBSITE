import { InputType, Field, ID } from "type-graphql";

@InputType("CreateShopInput")
export class CreateShopInput {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() email: string;
  @Field() password: string;
}

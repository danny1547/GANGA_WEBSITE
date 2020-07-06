import { ObjectType, Field, ID } from "type-graphql";
import { Purchase } from "./Purchase";

@ObjectType()
export class User {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() email: string;
  @Field() password: string;
  @Field({ nullable: true }) rollNumber: string;
  @Field() phoneNumber: string;
  @Field(() => [Purchase]) purchase: Purchase[];
}

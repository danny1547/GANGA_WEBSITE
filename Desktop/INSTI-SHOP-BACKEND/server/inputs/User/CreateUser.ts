import { InputType, Field } from "type-graphql";

@InputType("CreateUserInput")
export class CreateUserInput {
  @Field() name: string;
  @Field() email: string;
  @Field() password: string;
  @Field() phoneNumber: string;
  @Field({ nullable: true }) rollNumber?: string;
}

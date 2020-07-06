import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { CreateUserInput } from "../../inputs/User/CreateUser";
import { prisma } from "../../prisma";
import { User } from "../../models/User";

@Resolver(User)
export class CreateUserResolver {
  @Query(() => [User])
  async getUsers() {
    return await prisma.user.findMany();
  }

  @Mutation(() => User)
  async createUser(@Arg("data") data: CreateUserInput) {
    return await prisma.user.create({
      data,
    });
  }
}

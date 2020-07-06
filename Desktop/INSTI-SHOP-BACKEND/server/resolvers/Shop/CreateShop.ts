import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { CreateShopInput } from "../../inputs/Shop/CreateShop";
import { prisma } from "../../prisma";
import { Shop } from "../../models/Shop";

@Resolver(Shop)
export class CreateShopResolver {
  @Query(() => [Shop])
  async getShops() {
    return await prisma.shop.findMany();
  }

  @Mutation(() => Shop)
  async createShop(@Arg("data") data: CreateShopInput) {
    return await prisma.shop.create({
      data,
    });
  }
}

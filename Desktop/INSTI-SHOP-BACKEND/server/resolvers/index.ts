import UserResolver from "./User";
import ShopResolver from "./Shop";
export const resolvers = [...ShopResolver, ...UserResolver];

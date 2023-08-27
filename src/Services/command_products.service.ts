// import {PrismaClient} from '@prisma/client';
// import HttpException from '../classes/httpException';
// import productService from './products.service';

// class CommandProductsService {
//   private model;

//   constructor() {
//     this.model = new PrismaClient().commandProducts;
//   }

//   public addProducts = async (
//     commandId: number,
//     products: {productId: number; quantity: number}[],
//   ) => {
//     const productList = products.map(({productId}) =>
//       productService.findById(productId),
//     );
//     await Promise.all(productList);
//     const created = products.map(({productId, quantity}) => {
//       this.model.upsert({
//         where: {
//           AND: [
//             {productId: productId},
//             {commandId: commandId}, // Replace with the actual commandId value
//           ],
//         },
//         update: {quantity: {increment: quantity}},
//         create: {commandId, productId, quantity},
//       });
//     });
//     await Promise.all(created);
//     return created;
//   };

//   public removeProducts = async (
//     commandId: number,
//     products: {productId: number; quantity: number}[],
//   ) => {
//     const checkValues = products.map(({productId}) =>
//       this.model.findUnique({
//         where: {productId_commandId: {productId, commandId}},
//       }),
//     );
//     const dataArray = products.map(({productId, quantity}) => ({
//       commandId,
//       productId,
//       quantity,
//     }));
//     const updated = dataArray.map((data) => {
//       return this.model.update({
//         where: {
//           productId_commandId: {
//             productId: data.productId,
//             commandId: data.commandId,
//           },
//         },
//         data: {quantity: {decrement: data.quantity}},
//       });
//     });
//     await Promise.all(updated);
//     return updated;
//   };
// }

// export default new CommandProductsService();

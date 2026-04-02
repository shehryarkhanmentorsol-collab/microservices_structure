
// export interface IQueryOptions {
//   entityManager?: EntityManager;
// }

// export abstract class BaseRepository {
//   constructor(protected readonly connection: DataSource) {}

//   protected parseOptions(options?: IQueryOptions): { entityManager: EntityManager } {
//     return {
//       entityManager: options?.entityManager ?? this.connection.manager,
//     };
//   }
// }
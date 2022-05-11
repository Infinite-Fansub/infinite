import { Client, Entity, Repository, Schema } from "redis-om";

export class RedisClient extends Client {
    public models: Map<string, Repository<Entity>> = new Map();

    public async model<TEntity extends Entity>(name: string, schema?: Schema<TEntity>): Promise<Repository<TEntity>> {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.models.has(name)) return this.models.get(name)! as Repository<TEntity>;

        if (!schema) throw new Error("You have to pass a schema if it doesnt exist");

        const repository = this.fetchRepository(schema);
        await repository.createIndex();

        this.models.set(name, repository);

        return repository;
    }
}
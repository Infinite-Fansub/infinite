import { Client, Entity, Repository, Schema } from "redis-om";

export class Model<TEntity extends Entity> {

    public constructor(private readonly schema: Schema<TEntity>, private readonly client: Client) { }

    public async buildModel(): Promise<Repository<TEntity>> {
        const repo = this.client.fetchRepository(this.schema);
        await repo.createIndex();
        return repo;
    }
}
import { BaseInterfaceRepository } from './base.interface.repository';
import {
    DeleteResult, Repository, FindConditions,
    FindManyOptions,
    FindOneOptions,
} from 'typeorm';

export abstract class BaseAbstractRepository<T>  {

    private repo: Repository<T>;

    protected constructor(repo: Repository<T>) {
        this.repo = repo;
    }

    public async create(data: T | any): Promise<T> {
        return await this.execute(() => this.repo.save(data));
    }

    // public async findOneById(id: number): Promise<T | undefined> {
    //     return await this.repo.findOne(id);
    // }

    public async findOne(options: FindOneOptions): Promise<T | undefined> {
        return await this.execute(() => this.repo.findOne(options));
    }

    // public async findWithRelations(relations: any): Promise<T[]> {
    //     return await this.repo.find(relations)
    // }

    public async find(options: FindManyOptions): Promise<any> {
        // return await this.execute(() =>this.repo.find(options));
        options.skip = options.skip || 0;
        // options.take = options.take || 10;
        options.take = options.take || 999

        const [items, total] = await this.execute(() => this.repo.findAndCount(options));
        return {
            total,
            page: options.skip == 0 ? 1 : options.skip / options.take + 1,
            per_page: options.take,
            items,
        }
    }

    public async delete(options: FindConditions<T>): Promise<any> {
        const result = await this.execute(() => this.repo.delete(options));
        const response = result.affected && result.affected > 0 ? { success: true, affected: result.affected } : { success: false, affected: result.affected }
        return response
    }

    public async update(data: T): Promise<T> {
        // const entity = await this.findOne({where})
        return await this.execute(() => this.repo.save(data));
    }

    protected async execute<P>(fn: () => Promise<P>) {
        try {
            return await fn();
        } catch (err) {
            console.log(err)
            throw err;
            // throw new PostgresError(err.message, err);
        }
    }

    //   public update(model: Props): Promise<Props> {
    //     return this.execute((repo) =>
    //         repo.save({
    //             ...model,
    //         } as CreateProps & Props)
    //     );
    // }

}
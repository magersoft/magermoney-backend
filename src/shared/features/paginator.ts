import { FIRST_PAGE, PER_PAGE } from '@/shared/constants';
import { PaginatedEntity } from '@/shared/entities/paginated.entity';

export type PaginateOptions = { page?: number | string; perPage?: number | string };
export type PaginateFunction = <T, K>(model: any, args?: K, options?: PaginateOptions) => Promise<PaginatedEntity<T>>;

export const usePaginator = (defaultOptions: PaginateOptions) => {
  const paginate: PaginateFunction = async (model, args: any = { where: undefined }, options) => {
    const page = Number(options?.page || defaultOptions?.page) || FIRST_PAGE;
    const perPage = Number(options?.perPage || defaultOptions?.perPage) || PER_PAGE;

    const skip = page > 0 ? perPage * (page - 1) : 0;
    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: perPage,
        skip,
      }),
    ]);

    const lastPage = Math.ceil(total / perPage);

    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  };

  return {
    paginate,
  };
};

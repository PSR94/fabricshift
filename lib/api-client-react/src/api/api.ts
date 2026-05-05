import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import type {
  AdfPipeline,
  AppConfig,
  AssetLineage,
  DataContract,
  DataDomain,
  DataProduct,
  DataProfile,
  ErrorResponse,
  HealthStatus,
  ImpactRequest,
  ImpactResult,
  InventorySummary,
  LineageGraph,
  MappingRequest,
  MappingResult,
  MappingRun,
  MigrationPacket,
  MigrationWave,
  PacketRequest,
  PowerBiReport,
  ReadinessRequest,
  ReadinessResult,
  ReadinessRun,
  ReconciliationRequest,
  ReconciliationRun,
  ReportExport,
  SqlObject,
  SynapseWorkspace,
  WavePlan,
  WavePlanRequest,
} from "./api.schemas";

import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";

type AwaitedInput<T> = PromiseLike<T> | T;

type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * @summary Health check
 */
export const getHealthCheckUrl = () => {
  return `/api/healthz`;
};

export const healthCheck = async (
  options?: RequestInit,
): Promise<HealthStatus> => {
  return customFetch<HealthStatus>(getHealthCheckUrl(), {
    ...options,
    method: "GET",
  });
};

export const getHealthCheckQueryKey = () => {
  return [`/api/healthz`] as const;
};

export const getHealthCheckQueryOptions = <
  TData = Awaited<ReturnType<typeof healthCheck>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof healthCheck>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getHealthCheckQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof healthCheck>>> = ({
    signal,
  }) => healthCheck({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof healthCheck>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type HealthCheckQueryResult = NonNullable<
  Awaited<ReturnType<typeof healthCheck>>
>;
export type HealthCheckQueryError = ErrorType<unknown>;

/**
 * @summary Health check
 */

export function useHealthCheck<
  TData = Awaited<ReturnType<typeof healthCheck>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof healthCheck>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getHealthCheckQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary App configuration
 */
export const getGetConfigUrl = () => {
  return `/api/config`;
};

export const getConfig = async (options?: RequestInit): Promise<AppConfig> => {
  return customFetch<AppConfig>(getGetConfigUrl(), {
    ...options,
    method: "GET",
  });
};

export const getGetConfigQueryKey = () => {
  return [`/api/config`] as const;
};

export const getGetConfigQueryOptions = <
  TData = Awaited<ReturnType<typeof getConfig>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getConfig>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetConfigQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getConfig>>> = ({
    signal,
  }) => getConfig({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getConfig>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetConfigQueryResult = NonNullable<
  Awaited<ReturnType<typeof getConfig>>
>;
export type GetConfigQueryError = ErrorType<unknown>;

/**
 * @summary App configuration
 */

export function useGetConfig<
  TData = Awaited<ReturnType<typeof getConfig>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getConfig>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetConfigQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Inventory summary counts and readiness overview
 */
export const getGetInventorySummaryUrl = () => {
  return `/api/inventory/summary`;
};

export const getInventorySummary = async (
  options?: RequestInit,
): Promise<InventorySummary> => {
  return customFetch<InventorySummary>(getGetInventorySummaryUrl(), {
    ...options,
    method: "GET",
  });
};

export const getGetInventorySummaryQueryKey = () => {
  return [`/api/inventory/summary`] as const;
};

export const getGetInventorySummaryQueryOptions = <
  TData = Awaited<ReturnType<typeof getInventorySummary>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getInventorySummary>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetInventorySummaryQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getInventorySummary>>
  > = ({ signal }) => getInventorySummary({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getInventorySummary>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetInventorySummaryQueryResult = NonNullable<
  Awaited<ReturnType<typeof getInventorySummary>>
>;
export type GetInventorySummaryQueryError = ErrorType<unknown>;

/**
 * @summary Inventory summary counts and readiness overview
 */

export function useGetInventorySummary<
  TData = Awaited<ReturnType<typeof getInventorySummary>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getInventorySummary>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetInventorySummaryQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary List data domains
 */
export const getListDomainsUrl = () => {
  return `/api/inventory/domains`;
};

export const listDomains = async (
  options?: RequestInit,
): Promise<DataDomain[]> => {
  return customFetch<DataDomain[]>(getListDomainsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListDomainsQueryKey = () => {
  return [`/api/inventory/domains`] as const;
};

export const getListDomainsQueryOptions = <
  TData = Awaited<ReturnType<typeof listDomains>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listDomains>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListDomainsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listDomains>>> = ({
    signal,
  }) => listDomains({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listDomains>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListDomainsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listDomains>>
>;
export type ListDomainsQueryError = ErrorType<unknown>;

/**
 * @summary List data domains
 */

export function useListDomains<
  TData = Awaited<ReturnType<typeof listDomains>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listDomains>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListDomainsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary List Synapse workspaces
 */
export const getListWorkspacesUrl = () => {
  return `/api/inventory/workspaces`;
};

export const listWorkspaces = async (
  options?: RequestInit,
): Promise<SynapseWorkspace[]> => {
  return customFetch<SynapseWorkspace[]>(getListWorkspacesUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListWorkspacesQueryKey = () => {
  return [`/api/inventory/workspaces`] as const;
};

export const getListWorkspacesQueryOptions = <
  TData = Awaited<ReturnType<typeof listWorkspaces>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listWorkspaces>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListWorkspacesQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listWorkspaces>>> = ({
    signal,
  }) => listWorkspaces({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listWorkspaces>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListWorkspacesQueryResult = NonNullable<
  Awaited<ReturnType<typeof listWorkspaces>>
>;
export type ListWorkspacesQueryError = ErrorType<unknown>;

/**
 * @summary List Synapse workspaces
 */

export function useListWorkspaces<
  TData = Awaited<ReturnType<typeof listWorkspaces>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listWorkspaces>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListWorkspacesQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary List ADF pipelines
 */
export const getListPipelinesUrl = () => {
  return `/api/inventory/pipelines`;
};

export const listPipelines = async (
  options?: RequestInit,
): Promise<AdfPipeline[]> => {
  return customFetch<AdfPipeline[]>(getListPipelinesUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListPipelinesQueryKey = () => {
  return [`/api/inventory/pipelines`] as const;
};

export const getListPipelinesQueryOptions = <
  TData = Awaited<ReturnType<typeof listPipelines>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listPipelines>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListPipelinesQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listPipelines>>> = ({
    signal,
  }) => listPipelines({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listPipelines>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListPipelinesQueryResult = NonNullable<
  Awaited<ReturnType<typeof listPipelines>>
>;
export type ListPipelinesQueryError = ErrorType<unknown>;

/**
 * @summary List ADF pipelines
 */

export function useListPipelines<
  TData = Awaited<ReturnType<typeof listPipelines>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listPipelines>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListPipelinesQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary List SQL objects
 */
export const getListSqlObjectsUrl = () => {
  return `/api/inventory/sql-objects`;
};

export const listSqlObjects = async (
  options?: RequestInit,
): Promise<SqlObject[]> => {
  return customFetch<SqlObject[]>(getListSqlObjectsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListSqlObjectsQueryKey = () => {
  return [`/api/inventory/sql-objects`] as const;
};

export const getListSqlObjectsQueryOptions = <
  TData = Awaited<ReturnType<typeof listSqlObjects>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listSqlObjects>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListSqlObjectsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listSqlObjects>>> = ({
    signal,
  }) => listSqlObjects({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listSqlObjects>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListSqlObjectsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listSqlObjects>>
>;
export type ListSqlObjectsQueryError = ErrorType<unknown>;

/**
 * @summary List SQL objects
 */

export function useListSqlObjects<
  TData = Awaited<ReturnType<typeof listSqlObjects>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listSqlObjects>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListSqlObjectsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary List Power BI reports
 */
export const getListReportsUrl = () => {
  return `/api/inventory/reports`;
};

export const listReports = async (
  options?: RequestInit,
): Promise<PowerBiReport[]> => {
  return customFetch<PowerBiReport[]>(getListReportsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListReportsQueryKey = () => {
  return [`/api/inventory/reports`] as const;
};

export const getListReportsQueryOptions = <
  TData = Awaited<ReturnType<typeof listReports>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listReports>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListReportsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listReports>>> = ({
    signal,
  }) => listReports({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listReports>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListReportsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listReports>>
>;
export type ListReportsQueryError = ErrorType<unknown>;

/**
 * @summary List Power BI reports
 */

export function useListReports<
  TData = Awaited<ReturnType<typeof listReports>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listReports>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListReportsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Run Fabric target mapping for all or selected assets
 */
export const getRunFabricMappingUrl = () => {
  return `/api/mapping/fabric-targets`;
};

export const runFabricMapping = async (
  mappingRequest?: MappingRequest,
  options?: RequestInit,
): Promise<MappingRun> => {
  return customFetch<MappingRun>(getRunFabricMappingUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(mappingRequest),
  });
};

export const getRunFabricMappingMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof runFabricMapping>>,
    TError,
    { data: BodyType<MappingRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof runFabricMapping>>,
  TError,
  { data: BodyType<MappingRequest> },
  TContext
> => {
  const mutationKey = ["runFabricMapping"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runFabricMapping>>,
    { data: BodyType<MappingRequest> }
  > = (props) => {
    const { data } = props ?? {};

    return runFabricMapping(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RunFabricMappingMutationResult = NonNullable<
  Awaited<ReturnType<typeof runFabricMapping>>
>;
export type RunFabricMappingMutationBody = BodyType<MappingRequest>;
export type RunFabricMappingMutationError = ErrorType<unknown>;

/**
 * @summary Run Fabric target mapping for all or selected assets
 */
export const useRunFabricMapping = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof runFabricMapping>>,
    TError,
    { data: BodyType<MappingRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof runFabricMapping>>,
  TError,
  { data: BodyType<MappingRequest> },
  TContext
> => {
  return useMutation(getRunFabricMappingMutationOptions(options));
};

/**
 * @summary List all mapping results
 */
export const getListMappingResultsUrl = () => {
  return `/api/mapping/results`;
};

export const listMappingResults = async (
  options?: RequestInit,
): Promise<MappingResult[]> => {
  return customFetch<MappingResult[]>(getListMappingResultsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListMappingResultsQueryKey = () => {
  return [`/api/mapping/results`] as const;
};

export const getListMappingResultsQueryOptions = <
  TData = Awaited<ReturnType<typeof listMappingResults>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listMappingResults>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListMappingResultsQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listMappingResults>>
  > = ({ signal }) => listMappingResults({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listMappingResults>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListMappingResultsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listMappingResults>>
>;
export type ListMappingResultsQueryError = ErrorType<unknown>;

/**
 * @summary List all mapping results
 */

export function useListMappingResults<
  TData = Awaited<ReturnType<typeof listMappingResults>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listMappingResults>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListMappingResultsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Get a specific mapping result
 */
export const getGetMappingResultUrl = (mappingId: string) => {
  return `/api/mapping/results/${mappingId}`;
};

export const getMappingResult = async (
  mappingId: string,
  options?: RequestInit,
): Promise<MappingResult> => {
  return customFetch<MappingResult>(getGetMappingResultUrl(mappingId), {
    ...options,
    method: "GET",
  });
};

export const getGetMappingResultQueryKey = (mappingId: string) => {
  return [`/api/mapping/results/${mappingId}`] as const;
};

export const getGetMappingResultQueryOptions = <
  TData = Awaited<ReturnType<typeof getMappingResult>>,
  TError = ErrorType<ErrorResponse>,
>(
  mappingId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getMappingResult>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetMappingResultQueryKey(mappingId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getMappingResult>>
  > = ({ signal }) =>
    getMappingResult(mappingId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!mappingId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getMappingResult>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetMappingResultQueryResult = NonNullable<
  Awaited<ReturnType<typeof getMappingResult>>
>;
export type GetMappingResultQueryError = ErrorType<ErrorResponse>;

/**
 * @summary Get a specific mapping result
 */

export function useGetMappingResult<
  TData = Awaited<ReturnType<typeof getMappingResult>>,
  TError = ErrorType<ErrorResponse>,
>(
  mappingId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getMappingResult>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetMappingResultQueryOptions(mappingId, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary List all data products
 */
export const getListDataProductsUrl = () => {
  return `/api/data-products`;
};

export const listDataProducts = async (
  options?: RequestInit,
): Promise<DataProduct[]> => {
  return customFetch<DataProduct[]>(getListDataProductsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListDataProductsQueryKey = () => {
  return [`/api/data-products`] as const;
};

export const getListDataProductsQueryOptions = <
  TData = Awaited<ReturnType<typeof listDataProducts>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listDataProducts>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListDataProductsQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listDataProducts>>
  > = ({ signal }) => listDataProducts({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listDataProducts>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListDataProductsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listDataProducts>>
>;
export type ListDataProductsQueryError = ErrorType<unknown>;

/**
 * @summary List all data products
 */

export function useListDataProducts<
  TData = Awaited<ReturnType<typeof listDataProducts>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listDataProducts>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListDataProductsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Get a specific data product
 */
export const getGetDataProductUrl = (productId: string) => {
  return `/api/data-products/${productId}`;
};

export const getDataProduct = async (
  productId: string,
  options?: RequestInit,
): Promise<DataProduct> => {
  return customFetch<DataProduct>(getGetDataProductUrl(productId), {
    ...options,
    method: "GET",
  });
};

export const getGetDataProductQueryKey = (productId: string) => {
  return [`/api/data-products/${productId}`] as const;
};

export const getGetDataProductQueryOptions = <
  TData = Awaited<ReturnType<typeof getDataProduct>>,
  TError = ErrorType<ErrorResponse>,
>(
  productId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getDataProduct>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetDataProductQueryKey(productId);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getDataProduct>>> = ({
    signal,
  }) => getDataProduct(productId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!productId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getDataProduct>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetDataProductQueryResult = NonNullable<
  Awaited<ReturnType<typeof getDataProduct>>
>;
export type GetDataProductQueryError = ErrorType<ErrorResponse>;

/**
 * @summary Get a specific data product
 */

export function useGetDataProduct<
  TData = Awaited<ReturnType<typeof getDataProduct>>,
  TError = ErrorType<ErrorResponse>,
>(
  productId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getDataProduct>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetDataProductQueryOptions(productId, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Get data contract for a product
 */
export const getGetDataProductContractUrl = (productId: string) => {
  return `/api/data-products/${productId}/contract`;
};

export const getDataProductContract = async (
  productId: string,
  options?: RequestInit,
): Promise<DataContract> => {
  return customFetch<DataContract>(getGetDataProductContractUrl(productId), {
    ...options,
    method: "GET",
  });
};

export const getGetDataProductContractQueryKey = (productId: string) => {
  return [`/api/data-products/${productId}/contract`] as const;
};

export const getGetDataProductContractQueryOptions = <
  TData = Awaited<ReturnType<typeof getDataProductContract>>,
  TError = ErrorType<ErrorResponse>,
>(
  productId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getDataProductContract>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetDataProductContractQueryKey(productId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getDataProductContract>>
  > = ({ signal }) =>
    getDataProductContract(productId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!productId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getDataProductContract>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetDataProductContractQueryResult = NonNullable<
  Awaited<ReturnType<typeof getDataProductContract>>
>;
export type GetDataProductContractQueryError = ErrorType<ErrorResponse>;

/**
 * @summary Get data contract for a product
 */

export function useGetDataProductContract<
  TData = Awaited<ReturnType<typeof getDataProductContract>>,
  TError = ErrorType<ErrorResponse>,
>(
  productId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getDataProductContract>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetDataProductContractQueryOptions(
    productId,
    options,
  );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Get sample data profile for a product
 */
export const getGetDataProductProfileUrl = (productId: string) => {
  return `/api/data-products/${productId}/profile`;
};

export const getDataProductProfile = async (
  productId: string,
  options?: RequestInit,
): Promise<DataProfile> => {
  return customFetch<DataProfile>(getGetDataProductProfileUrl(productId), {
    ...options,
    method: "GET",
  });
};

export const getGetDataProductProfileQueryKey = (productId: string) => {
  return [`/api/data-products/${productId}/profile`] as const;
};

export const getGetDataProductProfileQueryOptions = <
  TData = Awaited<ReturnType<typeof getDataProductProfile>>,
  TError = ErrorType<ErrorResponse>,
>(
  productId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getDataProductProfile>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetDataProductProfileQueryKey(productId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getDataProductProfile>>
  > = ({ signal }) =>
    getDataProductProfile(productId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!productId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getDataProductProfile>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetDataProductProfileQueryResult = NonNullable<
  Awaited<ReturnType<typeof getDataProductProfile>>
>;
export type GetDataProductProfileQueryError = ErrorType<ErrorResponse>;

/**
 * @summary Get sample data profile for a product
 */

export function useGetDataProductProfile<
  TData = Awaited<ReturnType<typeof getDataProductProfile>>,
  TError = ErrorType<ErrorResponse>,
>(
  productId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getDataProductProfile>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetDataProductProfileQueryOptions(productId, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Run migration readiness assessment
 */
export const getRunReadinessAssessmentUrl = () => {
  return `/api/readiness/assess`;
};

export const runReadinessAssessment = async (
  readinessRequest?: ReadinessRequest,
  options?: RequestInit,
): Promise<ReadinessRun> => {
  return customFetch<ReadinessRun>(getRunReadinessAssessmentUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(readinessRequest),
  });
};

export const getRunReadinessAssessmentMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof runReadinessAssessment>>,
    TError,
    { data: BodyType<ReadinessRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof runReadinessAssessment>>,
  TError,
  { data: BodyType<ReadinessRequest> },
  TContext
> => {
  const mutationKey = ["runReadinessAssessment"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runReadinessAssessment>>,
    { data: BodyType<ReadinessRequest> }
  > = (props) => {
    const { data } = props ?? {};

    return runReadinessAssessment(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RunReadinessAssessmentMutationResult = NonNullable<
  Awaited<ReturnType<typeof runReadinessAssessment>>
>;
export type RunReadinessAssessmentMutationBody = BodyType<ReadinessRequest>;
export type RunReadinessAssessmentMutationError = ErrorType<unknown>;

/**
 * @summary Run migration readiness assessment
 */
export const useRunReadinessAssessment = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof runReadinessAssessment>>,
    TError,
    { data: BodyType<ReadinessRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof runReadinessAssessment>>,
  TError,
  { data: BodyType<ReadinessRequest> },
  TContext
> => {
  return useMutation(getRunReadinessAssessmentMutationOptions(options));
};

/**
 * @summary List readiness results
 */
export const getListReadinessResultsUrl = () => {
  return `/api/readiness/results`;
};

export const listReadinessResults = async (
  options?: RequestInit,
): Promise<ReadinessResult[]> => {
  return customFetch<ReadinessResult[]>(getListReadinessResultsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListReadinessResultsQueryKey = () => {
  return [`/api/readiness/results`] as const;
};

export const getListReadinessResultsQueryOptions = <
  TData = Awaited<ReturnType<typeof listReadinessResults>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listReadinessResults>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListReadinessResultsQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listReadinessResults>>
  > = ({ signal }) => listReadinessResults({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listReadinessResults>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListReadinessResultsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listReadinessResults>>
>;
export type ListReadinessResultsQueryError = ErrorType<unknown>;

/**
 * @summary List readiness results
 */

export function useListReadinessResults<
  TData = Awaited<ReturnType<typeof listReadinessResults>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listReadinessResults>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListReadinessResultsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Get a specific readiness result
 */
export const getGetReadinessResultUrl = (assessmentId: string) => {
  return `/api/readiness/results/${assessmentId}`;
};

export const getReadinessResult = async (
  assessmentId: string,
  options?: RequestInit,
): Promise<ReadinessResult> => {
  return customFetch<ReadinessResult>(getGetReadinessResultUrl(assessmentId), {
    ...options,
    method: "GET",
  });
};

export const getGetReadinessResultQueryKey = (assessmentId: string) => {
  return [`/api/readiness/results/${assessmentId}`] as const;
};

export const getGetReadinessResultQueryOptions = <
  TData = Awaited<ReturnType<typeof getReadinessResult>>,
  TError = ErrorType<ErrorResponse>,
>(
  assessmentId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getReadinessResult>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetReadinessResultQueryKey(assessmentId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getReadinessResult>>
  > = ({ signal }) =>
    getReadinessResult(assessmentId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!assessmentId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getReadinessResult>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetReadinessResultQueryResult = NonNullable<
  Awaited<ReturnType<typeof getReadinessResult>>
>;
export type GetReadinessResultQueryError = ErrorType<ErrorResponse>;

/**
 * @summary Get a specific readiness result
 */

export function useGetReadinessResult<
  TData = Awaited<ReturnType<typeof getReadinessResult>>,
  TError = ErrorType<ErrorResponse>,
>(
  assessmentId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getReadinessResult>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetReadinessResultQueryOptions(assessmentId, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Run source-to-target reconciliation checks
 */
export const getRunReconciliationUrl = () => {
  return `/api/reconciliation/run`;
};

export const runReconciliation = async (
  reconciliationRequest?: ReconciliationRequest,
  options?: RequestInit,
): Promise<ReconciliationRun> => {
  return customFetch<ReconciliationRun>(getRunReconciliationUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(reconciliationRequest),
  });
};

export const getRunReconciliationMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof runReconciliation>>,
    TError,
    { data: BodyType<ReconciliationRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof runReconciliation>>,
  TError,
  { data: BodyType<ReconciliationRequest> },
  TContext
> => {
  const mutationKey = ["runReconciliation"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runReconciliation>>,
    { data: BodyType<ReconciliationRequest> }
  > = (props) => {
    const { data } = props ?? {};

    return runReconciliation(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RunReconciliationMutationResult = NonNullable<
  Awaited<ReturnType<typeof runReconciliation>>
>;
export type RunReconciliationMutationBody = BodyType<ReconciliationRequest>;
export type RunReconciliationMutationError = ErrorType<unknown>;

/**
 * @summary Run source-to-target reconciliation checks
 */
export const useRunReconciliation = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof runReconciliation>>,
    TError,
    { data: BodyType<ReconciliationRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof runReconciliation>>,
  TError,
  { data: BodyType<ReconciliationRequest> },
  TContext
> => {
  return useMutation(getRunReconciliationMutationOptions(options));
};

/**
 * @summary List all reconciliation results
 */
export const getListReconciliationResultsUrl = () => {
  return `/api/reconciliation/results`;
};

export const listReconciliationResults = async (
  options?: RequestInit,
): Promise<ReconciliationRun[]> => {
  return customFetch<ReconciliationRun[]>(getListReconciliationResultsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListReconciliationResultsQueryKey = () => {
  return [`/api/reconciliation/results`] as const;
};

export const getListReconciliationResultsQueryOptions = <
  TData = Awaited<ReturnType<typeof listReconciliationResults>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listReconciliationResults>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getListReconciliationResultsQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listReconciliationResults>>
  > = ({ signal }) => listReconciliationResults({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listReconciliationResults>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListReconciliationResultsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listReconciliationResults>>
>;
export type ListReconciliationResultsQueryError = ErrorType<unknown>;

/**
 * @summary List all reconciliation results
 */

export function useListReconciliationResults<
  TData = Awaited<ReturnType<typeof listReconciliationResults>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listReconciliationResults>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListReconciliationResultsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Get a specific reconciliation run
 */
export const getGetReconciliationResultUrl = (resultId: string) => {
  return `/api/reconciliation/results/${resultId}`;
};

export const getReconciliationResult = async (
  resultId: string,
  options?: RequestInit,
): Promise<ReconciliationRun> => {
  return customFetch<ReconciliationRun>(
    getGetReconciliationResultUrl(resultId),
    {
      ...options,
      method: "GET",
    },
  );
};

export const getGetReconciliationResultQueryKey = (resultId: string) => {
  return [`/api/reconciliation/results/${resultId}`] as const;
};

export const getGetReconciliationResultQueryOptions = <
  TData = Awaited<ReturnType<typeof getReconciliationResult>>,
  TError = ErrorType<ErrorResponse>,
>(
  resultId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getReconciliationResult>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetReconciliationResultQueryKey(resultId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getReconciliationResult>>
  > = ({ signal }) =>
    getReconciliationResult(resultId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!resultId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getReconciliationResult>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetReconciliationResultQueryResult = NonNullable<
  Awaited<ReturnType<typeof getReconciliationResult>>
>;
export type GetReconciliationResultQueryError = ErrorType<ErrorResponse>;

/**
 * @summary Get a specific reconciliation run
 */

export function useGetReconciliationResult<
  TData = Awaited<ReturnType<typeof getReconciliationResult>>,
  TError = ErrorType<ErrorResponse>,
>(
  resultId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getReconciliationResult>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetReconciliationResultQueryOptions(
    resultId,
    options,
  );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Get full lineage graph
 */
export const getGetLineageGraphUrl = () => {
  return `/api/lineage`;
};

export const getLineageGraph = async (
  options?: RequestInit,
): Promise<LineageGraph> => {
  return customFetch<LineageGraph>(getGetLineageGraphUrl(), {
    ...options,
    method: "GET",
  });
};

export const getGetLineageGraphQueryKey = () => {
  return [`/api/lineage`] as const;
};

export const getGetLineageGraphQueryOptions = <
  TData = Awaited<ReturnType<typeof getLineageGraph>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getLineageGraph>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetLineageGraphQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getLineageGraph>>> = ({
    signal,
  }) => getLineageGraph({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getLineageGraph>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetLineageGraphQueryResult = NonNullable<
  Awaited<ReturnType<typeof getLineageGraph>>
>;
export type GetLineageGraphQueryError = ErrorType<unknown>;

/**
 * @summary Get full lineage graph
 */

export function useGetLineageGraph<
  TData = Awaited<ReturnType<typeof getLineageGraph>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getLineageGraph>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetLineageGraphQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Get lineage for a specific asset
 */
export const getGetAssetLineageUrl = (assetId: string) => {
  return `/api/lineage/${assetId}`;
};

export const getAssetLineage = async (
  assetId: string,
  options?: RequestInit,
): Promise<AssetLineage> => {
  return customFetch<AssetLineage>(getGetAssetLineageUrl(assetId), {
    ...options,
    method: "GET",
  });
};

export const getGetAssetLineageQueryKey = (assetId: string) => {
  return [`/api/lineage/${assetId}`] as const;
};

export const getGetAssetLineageQueryOptions = <
  TData = Awaited<ReturnType<typeof getAssetLineage>>,
  TError = ErrorType<ErrorResponse>,
>(
  assetId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getAssetLineage>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetAssetLineageQueryKey(assetId);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAssetLineage>>> = ({
    signal,
  }) => getAssetLineage(assetId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!assetId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getAssetLineage>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetAssetLineageQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAssetLineage>>
>;
export type GetAssetLineageQueryError = ErrorType<ErrorResponse>;

/**
 * @summary Get lineage for a specific asset
 */

export function useGetAssetLineage<
  TData = Awaited<ReturnType<typeof getAssetLineage>>,
  TError = ErrorType<ErrorResponse>,
>(
  assetId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getAssetLineage>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetAssetLineageQueryOptions(assetId, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Run impact analysis for an asset
 */
export const getRunImpactAnalysisUrl = () => {
  return `/api/lineage/impact`;
};

export const runImpactAnalysis = async (
  impactRequest: ImpactRequest,
  options?: RequestInit,
): Promise<ImpactResult> => {
  return customFetch<ImpactResult>(getRunImpactAnalysisUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(impactRequest),
  });
};

export const getRunImpactAnalysisMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof runImpactAnalysis>>,
    TError,
    { data: BodyType<ImpactRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof runImpactAnalysis>>,
  TError,
  { data: BodyType<ImpactRequest> },
  TContext
> => {
  const mutationKey = ["runImpactAnalysis"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof runImpactAnalysis>>,
    { data: BodyType<ImpactRequest> }
  > = (props) => {
    const { data } = props ?? {};

    return runImpactAnalysis(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RunImpactAnalysisMutationResult = NonNullable<
  Awaited<ReturnType<typeof runImpactAnalysis>>
>;
export type RunImpactAnalysisMutationBody = BodyType<ImpactRequest>;
export type RunImpactAnalysisMutationError = ErrorType<unknown>;

/**
 * @summary Run impact analysis for an asset
 */
export const useRunImpactAnalysis = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof runImpactAnalysis>>,
    TError,
    { data: BodyType<ImpactRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof runImpactAnalysis>>,
  TError,
  { data: BodyType<ImpactRequest> },
  TContext
> => {
  return useMutation(getRunImpactAnalysisMutationOptions(options));
};

/**
 * @summary Plan migration waves
 */
export const getPlanMigrationWavesUrl = () => {
  return `/api/migration-waves/plan`;
};

export const planMigrationWaves = async (
  wavePlanRequest?: WavePlanRequest,
  options?: RequestInit,
): Promise<WavePlan> => {
  return customFetch<WavePlan>(getPlanMigrationWavesUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(wavePlanRequest),
  });
};

export const getPlanMigrationWavesMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof planMigrationWaves>>,
    TError,
    { data: BodyType<WavePlanRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof planMigrationWaves>>,
  TError,
  { data: BodyType<WavePlanRequest> },
  TContext
> => {
  const mutationKey = ["planMigrationWaves"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof planMigrationWaves>>,
    { data: BodyType<WavePlanRequest> }
  > = (props) => {
    const { data } = props ?? {};

    return planMigrationWaves(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PlanMigrationWavesMutationResult = NonNullable<
  Awaited<ReturnType<typeof planMigrationWaves>>
>;
export type PlanMigrationWavesMutationBody = BodyType<WavePlanRequest>;
export type PlanMigrationWavesMutationError = ErrorType<unknown>;

/**
 * @summary Plan migration waves
 */
export const usePlanMigrationWaves = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof planMigrationWaves>>,
    TError,
    { data: BodyType<WavePlanRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof planMigrationWaves>>,
  TError,
  { data: BodyType<WavePlanRequest> },
  TContext
> => {
  return useMutation(getPlanMigrationWavesMutationOptions(options));
};

/**
 * @summary List migration waves
 */
export const getListMigrationWavesUrl = () => {
  return `/api/migration-waves`;
};

export const listMigrationWaves = async (
  options?: RequestInit,
): Promise<MigrationWave[]> => {
  return customFetch<MigrationWave[]>(getListMigrationWavesUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListMigrationWavesQueryKey = () => {
  return [`/api/migration-waves`] as const;
};

export const getListMigrationWavesQueryOptions = <
  TData = Awaited<ReturnType<typeof listMigrationWaves>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listMigrationWaves>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListMigrationWavesQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listMigrationWaves>>
  > = ({ signal }) => listMigrationWaves({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listMigrationWaves>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListMigrationWavesQueryResult = NonNullable<
  Awaited<ReturnType<typeof listMigrationWaves>>
>;
export type ListMigrationWavesQueryError = ErrorType<unknown>;

/**
 * @summary List migration waves
 */

export function useListMigrationWaves<
  TData = Awaited<ReturnType<typeof listMigrationWaves>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listMigrationWaves>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListMigrationWavesQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Get a specific migration wave
 */
export const getGetMigrationWaveUrl = (waveId: string) => {
  return `/api/migration-waves/${waveId}`;
};

export const getMigrationWave = async (
  waveId: string,
  options?: RequestInit,
): Promise<MigrationWave> => {
  return customFetch<MigrationWave>(getGetMigrationWaveUrl(waveId), {
    ...options,
    method: "GET",
  });
};

export const getGetMigrationWaveQueryKey = (waveId: string) => {
  return [`/api/migration-waves/${waveId}`] as const;
};

export const getGetMigrationWaveQueryOptions = <
  TData = Awaited<ReturnType<typeof getMigrationWave>>,
  TError = ErrorType<ErrorResponse>,
>(
  waveId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getMigrationWave>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetMigrationWaveQueryKey(waveId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getMigrationWave>>
  > = ({ signal }) => getMigrationWave(waveId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!waveId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getMigrationWave>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetMigrationWaveQueryResult = NonNullable<
  Awaited<ReturnType<typeof getMigrationWave>>
>;
export type GetMigrationWaveQueryError = ErrorType<ErrorResponse>;

/**
 * @summary Get a specific migration wave
 */

export function useGetMigrationWave<
  TData = Awaited<ReturnType<typeof getMigrationWave>>,
  TError = ErrorType<ErrorResponse>,
>(
  waveId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getMigrationWave>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetMigrationWaveQueryOptions(waveId, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Generate migration readiness packet
 */
export const getGenerateMigrationPacketUrl = () => {
  return `/api/reports/migration-readiness`;
};

export const generateMigrationPacket = async (
  packetRequest?: PacketRequest,
  options?: RequestInit,
): Promise<MigrationPacket> => {
  return customFetch<MigrationPacket>(getGenerateMigrationPacketUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(packetRequest),
  });
};

export const getGenerateMigrationPacketMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof generateMigrationPacket>>,
    TError,
    { data: BodyType<PacketRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof generateMigrationPacket>>,
  TError,
  { data: BodyType<PacketRequest> },
  TContext
> => {
  const mutationKey = ["generateMigrationPacket"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof generateMigrationPacket>>,
    { data: BodyType<PacketRequest> }
  > = (props) => {
    const { data } = props ?? {};

    return generateMigrationPacket(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type GenerateMigrationPacketMutationResult = NonNullable<
  Awaited<ReturnType<typeof generateMigrationPacket>>
>;
export type GenerateMigrationPacketMutationBody = BodyType<PacketRequest>;
export type GenerateMigrationPacketMutationError = ErrorType<unknown>;

/**
 * @summary Generate migration readiness packet
 */
export const useGenerateMigrationPacket = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof generateMigrationPacket>>,
    TError,
    { data: BodyType<PacketRequest> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof generateMigrationPacket>>,
  TError,
  { data: BodyType<PacketRequest> },
  TContext
> => {
  return useMutation(getGenerateMigrationPacketMutationOptions(options));
};

/**
 * @summary Get migration packet as Markdown
 */
export const getGetReportMarkdownUrl = (reportId: string) => {
  return `/api/reports/${reportId}/markdown`;
};

export const getReportMarkdown = async (
  reportId: string,
  options?: RequestInit,
): Promise<ReportExport> => {
  return customFetch<ReportExport>(getGetReportMarkdownUrl(reportId), {
    ...options,
    method: "GET",
  });
};

export const getGetReportMarkdownQueryKey = (reportId: string) => {
  return [`/api/reports/${reportId}/markdown`] as const;
};

export const getGetReportMarkdownQueryOptions = <
  TData = Awaited<ReturnType<typeof getReportMarkdown>>,
  TError = ErrorType<ErrorResponse>,
>(
  reportId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getReportMarkdown>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetReportMarkdownQueryKey(reportId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getReportMarkdown>>
  > = ({ signal }) =>
    getReportMarkdown(reportId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!reportId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getReportMarkdown>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetReportMarkdownQueryResult = NonNullable<
  Awaited<ReturnType<typeof getReportMarkdown>>
>;
export type GetReportMarkdownQueryError = ErrorType<ErrorResponse>;

/**
 * @summary Get migration packet as Markdown
 */

export function useGetReportMarkdown<
  TData = Awaited<ReturnType<typeof getReportMarkdown>>,
  TError = ErrorType<ErrorResponse>,
>(
  reportId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getReportMarkdown>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetReportMarkdownQueryOptions(reportId, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Get migration packet as JSON
 */
export const getGetReportJsonUrl = (reportId: string) => {
  return `/api/reports/${reportId}/json`;
};

export const getReportJson = async (
  reportId: string,
  options?: RequestInit,
): Promise<ReportExport> => {
  return customFetch<ReportExport>(getGetReportJsonUrl(reportId), {
    ...options,
    method: "GET",
  });
};

export const getGetReportJsonQueryKey = (reportId: string) => {
  return [`/api/reports/${reportId}/json`] as const;
};

export const getGetReportJsonQueryOptions = <
  TData = Awaited<ReturnType<typeof getReportJson>>,
  TError = ErrorType<ErrorResponse>,
>(
  reportId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getReportJson>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetReportJsonQueryKey(reportId);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getReportJson>>> = ({
    signal,
  }) => getReportJson(reportId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!reportId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getReportJson>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetReportJsonQueryResult = NonNullable<
  Awaited<ReturnType<typeof getReportJson>>
>;
export type GetReportJsonQueryError = ErrorType<ErrorResponse>;

/**
 * @summary Get migration packet as JSON
 */

export function useGetReportJson<
  TData = Awaited<ReturnType<typeof getReportJson>>,
  TError = ErrorType<ErrorResponse>,
>(
  reportId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getReportJson>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetReportJsonQueryOptions(reportId, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

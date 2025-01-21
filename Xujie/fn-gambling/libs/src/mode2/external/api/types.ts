import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export type ExternalEndpoint = EndpointBuilder<BaseQueryFn, string, string>;

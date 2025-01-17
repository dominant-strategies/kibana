/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { PropsWithChildren } from 'react';
import React, { memo } from 'react';
import { Provider as ReduxStoreProvider } from 'react-redux';
import type { Store } from 'redux';
import { NavigationProvider } from '@kbn/security-solution-navigation';
import { UpsellingProvider } from '../../../../../../../common/components/upselling_provider';
import { UserPrivilegesProvider } from '../../../../../../../common/components/user_privileges/user_privileges_context';
import type { SecuritySolutionQueryClient } from '../../../../../../../common/containers/query_client/query_client_provider';
import { ReactQueryClientProvider } from '../../../../../../../common/containers/query_client/query_client_provider';
import { SecuritySolutionStartDependenciesContext } from '../../../../../../../common/components/user_privileges/endpoint/security_solution_start_dependencies';
import { CurrentLicense } from '../../../../../../../common/components/current_license';
import type { StartPlugins } from '../../../../../../../types';
import { useKibana } from '../../../../../../../common/lib/kibana';
import type { UpsellingService } from '../../../../../../..';

export type RenderContextProvidersProps = PropsWithChildren<{
  store: Store;
  depsStart: Pick<StartPlugins, 'data' | 'fleet'>;
  upsellingService: UpsellingService;
  queryClient?: SecuritySolutionQueryClient;
}>;

export const RenderContextProviders = memo<RenderContextProvidersProps>(
  ({ store, depsStart, queryClient, upsellingService, children }) => {
    const services = useKibana().services;
    const {
      application: { capabilities },
    } = services;
    return (
      <ReduxStoreProvider store={store}>
        <ReactQueryClientProvider queryClient={queryClient}>
          <SecuritySolutionStartDependenciesContext.Provider value={depsStart}>
            <UserPrivilegesProvider kibanaCapabilities={capabilities}>
              <NavigationProvider core={services}>
                <CurrentLicense>
                  <UpsellingProvider upsellingService={upsellingService}>
                    {children}
                  </UpsellingProvider>
                </CurrentLicense>
              </NavigationProvider>
            </UserPrivilegesProvider>
          </SecuritySolutionStartDependenciesContext.Provider>
        </ReactQueryClientProvider>
      </ReduxStoreProvider>
    );
  }
);
RenderContextProviders.displayName = 'RenderContextProviders';

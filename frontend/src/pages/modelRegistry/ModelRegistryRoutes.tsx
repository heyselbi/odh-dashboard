import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ModelRegistrySelectorContextProvider } from '~/concepts/modelRegistry/context/ModelRegistrySelectorContext';
import ModelRegistryCoreLoader from './ModelRegistryCoreLoader';
import ModelRegistry from './screens/ModelRegistry';
import { ModelVersionsTab } from './screens/ModelVersions/const';
import ModelVersions from './screens/ModelVersions/ModelVersions';
import ModelVersionsDetails from './screens/ModelVersionDetails/ModelVersionDetails';
import { ModelVersionDetailsTab } from './screens/ModelVersionDetails/const';

const ModelRegistryRoutes: React.FC = () => (
  <ModelRegistrySelectorContextProvider>
    <Routes>
      <Route
        path={'/:modelRegistry?/*'}
        element={
          <ModelRegistryCoreLoader
            getInvalidRedirectPath={(modelRegistry) => `/modelRegistry/${modelRegistry}`}
          />
        }
      >
        <Route index element={<ModelRegistry />} />
        <Route path="registeredModels/:registeredModelId">
          <Route index element={<Navigate to={ModelVersionsTab.VERSIONS} />} />
          <Route
            path={ModelVersionsTab.VERSIONS}
            element={<ModelVersions tab={ModelVersionsTab.VERSIONS} empty={false} />}
          />
          <Route
            path={ModelVersionsTab.DETAILS}
            element={<ModelVersions tab={ModelVersionsTab.DETAILS} empty={false} />}
          />
          <Route path="versions/:modelVersionId">
            <Route index element={<Navigate to={ModelVersionDetailsTab.DETAILS} />} />
            <Route
              path={ModelVersionDetailsTab.DETAILS}
              element={<ModelVersionsDetails tab={ModelVersionDetailsTab.DETAILS} empty={false} />}
            />
            <Route
              path={ModelVersionDetailsTab.REGISTERED_DEPLOYMENTS}
              element={
                <ModelVersionsDetails
                  tab={ModelVersionDetailsTab.REGISTERED_DEPLOYMENTS}
                  empty={false}
                />
              }
            />
            <Route path="*" element={<Navigate to="." />} />
          </Route>
          <Route path="*" element={<Navigate to="." />} />
        </Route>
        <Route path="*" element={<Navigate to="." />} />
      </Route>
    </Routes>
  </ModelRegistrySelectorContextProvider>
);

export default ModelRegistryRoutes;

// Copyright 2024 SoftServe Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import addAuthInterceptors from 'ui/src/api/client/auth-interceptors';
import { useAuthStore } from '@/features/Auth/state/store';
import { pingToConsole } from './services/api';
import App from './App';
import { AUTH_TOKEN_KEY } from './constants';

import 'ui/src/assets/styles/global.scss';
import '@/assets/styles/global.scss';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Item with id //root was not found on the page');
}

const { logout } = useAuthStore.getState();

addAuthInterceptors(AUTH_TOKEN_KEY, logout);
pingToConsole();

createRoot(container).render(
  <StrictMode>
    <App />,
  </StrictMode>,
);


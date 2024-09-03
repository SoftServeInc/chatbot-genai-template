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

import {
  Route,
  RouterProvider,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { ProtectedRoute, ToolsPageLayout } from '@/components/templates';
import { KnowledgeBasePage } from '@/features/App/pages/KnowledgeBase';
import { AuthLayout } from './features/Auth';
import { SignInPage, ConfigureBotExplorer } from './features/Auth/pages';

import { AppLayout } from './features/App';
import {
  ContentsPage,
  InlayPage,
  OverlayPage,
  InlaySmallPage,
  OverlaySmallPage,
  BotExplorer,
  ConfigureTools,
} from './features/App/pages';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navigate to="/app" />} />
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/sign-in" />} />
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="configure-bot" element={<ConfigureBotExplorer />} />
      </Route>
      <Route path="/app" element={<ProtectedRoute />}>
        <Route index element={<Navigate to="/app/contents" />} />
        <Route path="contents" element={<AppLayout />}>
          <Route index element={<ContentsPage />} />
        </Route>
        <Route path="inlay" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/inlay/big" />} />
          <Route path="big" element={<InlayPage />} />
          <Route path="small" element={<InlaySmallPage />} />
        </Route>
        <Route path="overlay" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/overlay/big" />} />
          <Route path="big" element={<OverlayPage />} />
          <Route path="small" element={<OverlaySmallPage />} />
        </Route>
        <Route path="tools" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/tools/configure" />} />
          <Route path="configure" element={<ConfigureTools />} />
          <Route path="bot-explorer" element={<BotExplorer />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="knowledge-base" element={<KnowledgeBasePage />} />
        </Route>
      </Route>
      <Route path="tools" element={<ToolsPageLayout />}>
        <Route index element={<Navigate to="/tools/bot-explorer" />} />
        <Route path="bot-explorer" element={<BotExplorer />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </>,
  ),
);

export default function Routes() {
  return <RouterProvider router={router} />;
}

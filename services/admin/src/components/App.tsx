import { Outlet } from "react-router-dom"
import {UserCard} from '@packages/shared/src/components/UserCard';
import { deepMerge } from '@packages/shared/src/utils/deepMerge';

export const App = () => {
  return (
    <div data-testid={'App.DataTestId'}>
      <h1 onClick={deepMerge}>Admin module</h1>
      <Outlet />
      <UserCard username="from admin" />
    </div>
  )
}
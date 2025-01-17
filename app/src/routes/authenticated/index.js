import React from 'react';
import { Route, Switch } from 'react-router-dom';
import GameLobby from '../../components/lobby/gameLobby';

const AuthenticatedRoutes = () => (
  <Switch>
    <Route exact path="/dashboard" component={() => <div>Welcome to the dashboard</div>} />
  </Switch>
);

export default AuthenticatedRoutes;

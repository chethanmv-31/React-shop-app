import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreType } from '../types';
const PrivateRoute: React.FC<RouteProps> = ( { component, ...rest } ) => {
    const isAuthenticated = useSelector<StoreType>( ( store ) => !!store.userSession.user );
    
    const RouterComponent = component as React.FunctionComponent;

  // extracting component prop & whatever is remaining is kept inside
  let auth = true; // get the auth status
  const RoutedComponent = component as React.FunctionComponent;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          <RoutedComponent />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location.pathname },
            }}
          />
        )
      }
    />
  );
};
export default PrivateRoute;

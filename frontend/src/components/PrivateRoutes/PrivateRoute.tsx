import React, { useState, useEffect } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthProvider";

interface PrivateRouteProps extends Omit<RouteProps, "component"> {
  component: React.ComponentType<any>;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for auth state to be restored
    if (user || isAuthenticated) {
      setIsLoading(false);
    } else {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setIsLoading(false);
      }
    }
  }, [user, isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

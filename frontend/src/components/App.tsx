import React, { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import "../styles/App.css";
import { fetchRoot } from "../utilities/api";
import Header from "./Header/Header";
import Home from "./Home/Home";
import About from "./About/About";
import Contact from "./Contact/Contact";
import Mealplans from "./MealPlans/Mealplans";
import Login from "./Login/Login";
import Register from "./Register/Register";
import { PrivateRoute } from "./PrivateRoutes/PrivateRoute";

export default function App() {
  const [message, setMessage] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const getMessage = async () => {
      const data = await fetchRoot();
      if (data && data.message) {
        setMessage(data.message);
      }
    };
    getMessage();
  }, []);

  return (
    <div className="App">
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Header />
      )}
      <Switch>
        {/* Public Routes */}
        <Route exact path="/login" render={(props) => <Login />} />
        <Route exact path="/register" render={(props) => <Register />} />
        <Route
          exact
          path="/"
          render={(props) => <Home {...props} message={message} />}
        />
        <Route path="/about" render={(props) => <About />} />

        {/* Protected Routes */}
        <PrivateRoute path="/contact" component={Contact} />
        <PrivateRoute path="/mealplans" component={Mealplans} />
      </Switch>
    </div>
  );
}

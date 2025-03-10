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

export default function App() {
  const [message, setMessage] = useState<string>("");

  //used location to figure out what page is where, used for hiding header on login page for me - JB
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
      {location.pathname !== "/login" && <Header />}
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={() => <Home message={message} />} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/mealplans" component={Mealplans} />
      </Switch>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import "../styles/App.css";
import { fetchRoot } from "../utilities/api";
import Header from "./Header/Header";
import Home from "./Home/Home";
import About from "./About/About";
import Contact from "./Contact/Contact";
import Mealplans from "./MealPlans/Mealplans";

export default function App() {
  const [message, setMessage] = useState<string>("");

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
      <title>FitnessPal</title>
      <Header />
      <Switch>
        <Route exact path="/" component={() => <Home message={message} />} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/mealplans" component={Mealplans} />
      </Switch>
    </div>
  );
}

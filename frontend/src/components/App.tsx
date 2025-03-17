import { Route, Switch, useLocation } from "react-router-dom";
import "../styles/App.css";
import Header from "./Header/Header";
import Home from "./Home/Home";
import About from "./About/About";
import Contact from "./Contact/Contact";
import Mealplans from "./MealPlans/Mealplans";
import MyPlans from "./MyPlans/MyPlans";
import Login from "./Login/Login";
import Register from "./Register/Register";
import ImageUpload from "./ImageUpload/ImageUpload";
import Plan from "./MyPlans/Plan";
import NotFound from "./NotFound/NotFound";
import { PrivateRoute } from "./PrivateRoutes/PrivateRoute";

export default function App() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Header />
      )}
      <Switch>
        {/* Public Routes */}
        <Route exact path="/login" render={(props) => <Login />} />
        <Route exact path="/register" render={(props) => <Register />} />
        <Route exact path="/" render={(props) => <Home />} />
        <Route path="/about" render={(props) => <About />} />
        <Route path="/myplans" render={(props) => <MyPlans/>} />

        {/* Protected Routes */}
        <PrivateRoute path="/contact" component={Contact} />
        <PrivateRoute path="/mealplans" component={Mealplans} />
        <PrivateRoute path="/calculate-calories" component={ImageUpload} />
        <PrivateRoute path="/myplans" component={MyPlans} />
        <PrivateRoute path="/plan/:id" component={Plan} />

        {/* 404 Route */}
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
}

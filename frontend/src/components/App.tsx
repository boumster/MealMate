import { Route, Switch, useLocation } from "react-router-dom";
import "../styles/App.css";
import Header from "./Header/Header";
import Home from "./Home/Home";
import About from "./About/About";
import Contact from "./Contact/Contact";
import Mealplans from "./MealPlans/Mealplans";
import MyPlans from "./MyPlans/MyPlans";
import Register from "./Register/Register";
import ImageUpload from "./ImageUpload/ImageUpload";
import Plan from "./MyPlans/Plan";
import NotFound from "./NotFound/NotFound";
import Login from "./Login/Login";
import Profile from "./Profile/Profile";
import { PrivateRoute } from "./PrivateRoutes/PrivateRoute";
import ChatBubble from "./ChatBubble/ChatBubble";
import { ThemeProvider } from "../context/ThemeContext/ThemeContext";

export default function App() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Header />
      )}
      <Switch>
        {/* Public Routes */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />

        {/* Protected Routes */}
        <PrivateRoute path="/contact" component={Contact} />
        <PrivateRoute path="/mealplans" component={Mealplans} />
        <PrivateRoute path="/calculate-calories" component={ImageUpload} />
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/myplans" component={MyPlans} />
        <PrivateRoute path="/plan/:id" component={Plan} />

        {/* 404 Route */}
        <Route path="*" component={NotFound} />
      </Switch>

      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <ChatBubble />
      )}
    </div>
  );
}

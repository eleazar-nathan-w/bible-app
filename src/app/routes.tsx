import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/pages/Home";
import { BibleReader } from "./components/pages/BibleReader";
import { Plans } from "./components/pages/Plans";
import { PlanDetail } from "./components/pages/PlanDetail";
import { Search } from "./components/pages/Search";
import { Profile } from "./components/pages/Profile";
import { NotFound } from "./components/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "bible/:book?/:chapter?", Component: BibleReader },
      { path: "plans", Component: Plans },
      { path: "plans/:planId", Component: PlanDetail },
      { path: "search", Component: Search },
      { path: "profile", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);

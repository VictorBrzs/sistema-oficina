import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Clients } from "./pages/Clients";
import { ServiceOrders } from "./pages/ServiceOrders";
import { Inventory } from "./pages/Inventory";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "clients", Component: Clients },
      { path: "service-orders", Component: ServiceOrders },
      { path: "inventory", Component: Inventory },
    ],
  },
]);
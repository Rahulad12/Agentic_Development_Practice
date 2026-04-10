import {
  createBrowserRouter,
} from "react-router";
import { publicRouter } from "./public-routes";

export const router = createBrowserRouter([
  ...publicRouter,
]);



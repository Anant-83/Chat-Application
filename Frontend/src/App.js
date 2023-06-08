import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./page/Deshbord";
import { Notifications } from "react-notifications";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import {
  action as roomAction,
  loader as interestsLoader,
} from "./components/Form/AddToRoomForm";
import ChatRoom from "./page/Room/ChatRoom";
import Error from "./page/error/Error";
import Wraper from "./components/Ui/Wraper";
import PrivateRoom from "./page/Room/PrivateRoom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Wraper />} errorElement={<Error />}>
      <Route index element={<Navigate to="/dashbord" />} />
      <Route
        path="/dashbord"
        element={<Dashboard />}
        action={roomAction}
        loader={interestsLoader}
      />
      <Route path="/chat" element={<ChatRoom />} />
      {/* <Route path="/room/:id" element={<PrivateRoom />} /> */}
    </Route>
  )
);

function App() {
  return (
  <RouterProvider router={router} />
  
  );
}

export default App;

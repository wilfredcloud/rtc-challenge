import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Room from "./pages/Room";
import RoomSession from "./pages/RoomSession";
function App() {
  return (
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/:roomId" element={<Room/>}/>
        <Route path="/:roomId/join" element={<RoomSession/>}/>
      </Routes>
    );
}

export default App;

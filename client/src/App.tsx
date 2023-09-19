import { io } from "socket.io-client";
function App() {
  const SERVER_URL = process.env.REACT_APP_SERVER_BASE_URL as string
  const createMeeting = () => {
    const ws = io(SERVER_URL);
  }
  return (
    <div className="App">
     <button onClick={createMeeting}>Create meeting</button>
    </div>
  );
}

export default App;

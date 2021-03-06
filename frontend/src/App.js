import "./style/App.css";
import Pusher from "pusher-js";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import GuestHome from "./components/GuestHome";
import axios from "./axios";
import {useEffect, useState} from "react";
import {Route, Switch} from "react-router-dom";
import {useStateValue} from "./StateProvider";

function App() {
  const [{user}, dispatch] = useStateValue();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("/messages/sync").then((res) => {
      setMessages(res.data);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("1b880ea365d7733fc7e7", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (newMessage) {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  return (
    <div className="App">
      {!user ? (
        <Switch>
          <Route path="/" exact>
            <GuestHome />
          </Route>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/register" exact>
            <Register />
          </Route>
        </Switch>
      ) : (
        <div className="app__body">
          <Sidebar messages={messages} />
          <Switch>
            <Route path="/" exact></Route>
            <Route path="/rooms/:roomId" exact>
              <Chat messages={messages} />
            </Route>
          </Switch>
        </div>
      )}
    </div>
  );
}

export default App;

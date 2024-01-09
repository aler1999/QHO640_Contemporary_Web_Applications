import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';

import './App.css';

import Home from './views/Home';
import SignUp from './views/SignUp';
import Login from './views/Login';
import NewEvent from './views/NewEvent';
import Event from './views/Event';
import MyEvents from './views/MyEvents';
import EditEvent from './views/EditEvent';
import Schedule from './views/Schedule';

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/newevent" element={<NewEvent />} />

            <Route path="/event/:eventId" element={<Event />}></Route>

            <Route path="/myevents" element={<MyEvents />} />
            <Route path="/myevents/edit/:eventId" element={<EditEvent />} />

            <Route path="/schedule" element={<Schedule />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );

}

export default App;
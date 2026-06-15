import Nav from "./components/Nav";
import MyBookings from "./pages/MyBookings";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Agent from "./pages/Agent";
import { Routes, Route } from "react-router-dom";
import AgentDashboard from "./pages/AgentDashboard";
import HotelDetails from "./pages/HotelDetails";
import SearchResults from "./pages/SearchResults";
import SearchBar from "./pages/SearchBar";
import BookingDetails from "./pages/BookingDetails";
import BookingPreview from "./pages/BookingPreview";
import AgentBookings from "./AgentBookings";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 3000,
          style: {
            background: "white",
            color: "#1f2937",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
          },
        }}
      />
      <Nav />
      <Routes>
        <Route path="/MyBookings" element={<MyBookings />} /> 
        <Route path="/Favorites" element={<Favorites />} />
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Agent" element={<Agent />} />
        <Route path="/Agent-Dashboard" element={<AgentDashboard />} />
       <Route path="/Agent-Bookings" element={<AgentBookings />} />
       <Route path="/search"element={<SearchResults />}/>
       <Route path="/hotel/:id" element={<HotelDetails />}/>
       <Route path="/booking-details"element={<BookingDetails/>}/>
       <Route path="/booking-preview"element={ <BookingPreview /> }/>
  

       </Routes>
    </>
  );
}
export default App;
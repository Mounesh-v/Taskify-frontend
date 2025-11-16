import "./input.css";
import Home from "./Home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <>
      <ToastContainer 
        autoClose={3000}
        pauseOnHover={false}
        closeOnClick
      />
      <Home/>
    </>
  );
}

export default App;

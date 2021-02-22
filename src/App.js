import './styles/App.css';
import react from "react";
import routes from "./routes";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";



function App(props) {


  return (
    <div className="App">
      {routes}
      <div className='footer-component'>
        <Footer />
      </div>
    </div>
  );
}



export default App;

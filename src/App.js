import "./App.css";
import react from "react";
import routes from "./routes";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";



function App(props) {
   

  return (
    <div className="App">
      <Header />
      {routes}
      <div></div>
      <Footer />
    </div>
  );
}



export default App;

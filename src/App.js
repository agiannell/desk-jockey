import './styles/App.css';
import routes from "./routes";
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

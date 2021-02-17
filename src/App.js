import './App.css';
import routes from './routes'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'

function App() {
  return (
    <div className="App">
      <Header />
      {routes}
      <Footer />
    </div>
  );
}

export default App;

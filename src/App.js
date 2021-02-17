import './App.css';
import routes from './routes'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import axios from 'axios';

function App() {

  const testButton = () => {
    axios.get('/login')
    .then(res => {
      console.log(res.data)
    })
    .catch(err => console.log(err))
  }

  return (
    <div className="App">
      <Header />
      {routes}
      <button onClick={() => testButton()}>
        Testing
      </button>
      <Footer />
    </div>
  );
}

export default App;
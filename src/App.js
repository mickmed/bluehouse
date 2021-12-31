import { Route } from 'react-router-dom'
import Header from './Components/Header.jsx'
import Home from './Components/Home.jsx'
import Layout from './Components/Layout.jsx'
import './App.scss';




function App() {
  return (
    <div className="App">
      <Header className="App-header" />
      
      <main>
        <Layout>
          <Route exact path='/'>
            <Home/>
          </Route>
        </Layout>


      </main>
    </div>
  );
}

export default App;

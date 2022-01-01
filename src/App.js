import { Route } from 'react-router-dom'
import Header from './Components/Header.jsx'
import Home from './Components/Home.jsx'
import Layout from './Components/Layout.jsx'
import './App.scss';

function App() {
  let username = prompt('username')
  let pass
  if (username === process.env.REACT_APP_USERNAME) {
    pass = prompt('password')
    if (pass === process.env.REACT_APP_USERPW) {
      return (
        <div className="App">
          <Header className="App-header" />
          <main>
            <Layout>
              <Route exact path='/'>
                <Home />
              </Route>
            </Layout>
          </main>
        </div>
      );
    }
  } else {
    return <div>your login failed</div>
  }
}

export default App;

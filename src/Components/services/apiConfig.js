import Axios from 'axios'

// Grab the JSON Web Token (JWT) from localStorage and set to a variable so we can send the token in the HTTP Header

let apiUrl

const apiUrls = {
  production: 'https://sei-items-api.herokuapp.com/api',
  development: process.env.REACT_APP_AIRTABLE_BASE_URL
}

if (window.location.hostname === 'localhost') {
  apiUrl = apiUrls.development
} else {
  apiUrl = apiUrls.production
}

const api = Axios.create({
  baseURL: apiUrl,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    'Authorization': `Bearer ${process.env.REACT_APP_BEARER_KEY}`
  }
})
export default api

import api from './apiConfig'

export const signUp = async credentials => {
  // Create an Axios POST call to the /sign-up route on the server include the user credentials in the request body
  // Store the server's response, which will be a JSON Web Token (JWT) unique to that user, in localStorage
}

export const signInUser = async credentials => {
  // Create an Axios POST call to the /sign-in route on the server include the user credentials in the request body
  // Store the server's response, which will be a JSON Web Token (JWT) unique to that user, in localStorage
}

export const signOut = async user => {
  try {
    await localStorage.clear()
    return true
  } catch (error) {
    throw error
  }
}

export const changePassword = async (passwords, user) => {
  try {
    // Bonus
    const resp = await api.post('/')
    return resp.data
  } catch (error) {
    throw error
  }
}

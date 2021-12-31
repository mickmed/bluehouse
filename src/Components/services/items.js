import api from './apiConfig'


export const getCategories = async () => {
  console.log(process.env.REACT_APP_AIRTABLE_BASE_URL)
  try {
    const resp = await api.get(`/Categories`);
    return resp;
  }
  catch (error) {
    throw error;
  }
}



export const getItems = async (offset) => {
  try {
    // const resp = await api.get('/items')
    const resp = await api.get(`/Expense?view=Grid%20view`);
    return resp
  } catch (error) {
    throw error
  }
}

export const getItemsWithOffset = async (offset) => {
  try {
    // const resp = await api.get('/items')
    const resp = await api.get(`/Expense?offset=${offset}`);
    return resp
  } catch (error) {
    throw error
  }
}

export const getItemById = async id => {
  console.log(id)
  try {
    const resp = await api.get(`/Expense/${id}`);
    // const resp = await api.get(`/items/${id}`)
    return resp.data
  } catch (error) {
    throw error
  }
}

export const createItem = async item => {
  console.log(item)

  try {
    const resp = await api.post(`/Expense`,
      {
        "records": [
          {
            "fields": item
          }
        ]
      }
    )
    return resp.data
  } catch (error) {
    throw error
  }
}

export const updateItem = async (item, id) => {
  try {
    const resp = await api.put(`/Expense`,
      {
        "records": [
          {
            "id": id,
            "fields": item
          }
        ]
      })


    return resp.data.records
  } catch (error) {
    throw error
  }
}

export const deleteItem = async id => {
  console.log(id)
  try {
    const resp = await api.delete(`/Expense?&records[]=${id} `)
    return resp.data
  } catch (error) {
    throw error
  }
}

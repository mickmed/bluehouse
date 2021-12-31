
import { useEffect, useState } from 'react'
import { getItemById, createItem, updateItem, deleteItem, getItems, getItemsWithOffset, getCategories } from './services/items'

const Home = () => {
    const [item, setItem] = useState({})
    // const [amount, setAmount] = useState('')
    const [categories, setCategories] = useState([])
    const [checked, setChecked] = useState({})
    const [items, setItems] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [currentItem, setCurrentItem] = useState({})
    const [selected, setSelected] = useState()
    const [sortKey, setSortKey] = useState('')
    const [sortDir, setSortDir] = useState(true)
    const [offset, setOffset] = useState(' ')
    const [filteredItems, setFilteredItems] = useState([])
    const [attTotals, setAttTotals] = useState({})

    useEffect(() => {
        const getAllCategories = async () => {
            await getCategories()
                .then(res =>
                    res.status === 200
                        ? setCategories([...categories, ...res.data.records])
                        : null
                )
                .catch(console.error)
        }
        getAllCategories()
    }, []);

    useEffect(() => {

        getAllItems()
    }, [])

    useEffect(() => {
        const getAllItems = async () => {

            if (items.length % 100 === 0) {
                let resp = await getItemsWithOffset(offset)
                setItems([...items, ...resp.data.records])

                if (resp.data.records.length === 100) {
                    setOffset(resp.data.offset)
                }
            }
        }
        getAllItems()
    }, [offset])

    const getAllItems = async () => {
        let resp = await getItems()
        if (resp.data.records.length === 100) {
            setItems(resp.data.records)
            setOffset(resp.data.offset)
            setFilteredItems([])
            setAttTotals({})
        }
    }

    const handleChange = (e) => {
        let key, value, newItem
        if (e.target.type === 'checkbox') {
            newItem = { ...currentItem }
            if (editMode) {

                if ('categories' in newItem.fields) {
                    if (e.target.checked) {
                        newItem.fields.categories.push(e.target.id)
                    } else {
                        console.log('false')
                        const index = newItem.fields.categories.indexOf(e.target.id)
                        newItem.fields.categories.splice(index, 1)
                    }
                } else {
                    newItem.fields.categories = [e.target.id]
                }
            } else {
                newItem = { ...item }
                console.log('not edit')
                if ('categories' in newItem) {
                    console.log('remove nw')
                    e.target.checked ? newItem.categories.push(e.target.id) :
                        newItem.categories.splice(newItem.categories.indexOf(e.target.id), 1)

                } else {
                    console.log('new')
                    newItem.categories = [e.target.id]
                }

                console.log(newItem)
            }

            editMode ?
                setCurrentItem(newItem) :
                setItem(newItem)

        } else {
            key = e.target.name
            value = e.target.value

            editMode ?
                setCurrentItem({ ...currentItem, fields: { ...currentItem.fields, [key]: value } }) :
                setItem({ ...item, [key]: value })
        }
    }

    const handleUpdate = async (e, id, i) => {
        const current = await getItemById(id)
        setCurrentItem(current)
        setSelected(i)
        setEditMode(true)
    }

    const handleSubmit = async (e, id) => {
        e.preventDefault()
        const { name, amount, vendor, categories, date, purchaser } = editMode ? currentItem.fields : item
        const newItem = {
            name: name,
            amount: parseFloat(amount),
            vendor: vendor,
            categories: categories,
            date: date,
            purchaser: purchaser
        }
        if (editMode) {
            const updatedItem = await updateItem(newItem, id)
            const newItems = [...items.map((el, i) => el.id === id ? updatedItem[0] : el)]
            setItems(newItems)
            setEditMode(false)
            setItem({})
            setSelected()
        } else {
            const postedItem = await createItem(newItem)
            setItems([...items, ...postedItem.records])

        }
    }

    const handleDelete = (e, id) => {
        e.preventDefault()
        deleteItem(id)
        let filteredItems = [...items].filter(el => el.id !== id)
        setItems(filteredItems)
    }
    const alphaSort = (array, sortParam) => {
        const compare = (a, b) => {
            let paramA
            let paramB
            if (sortParam === 'date') {
                paramA = Date.parse(a.fields[sortParam])
                paramB = Date.parse(b.fields[sortParam])

            } else {

                paramA = a.fields[sortParam]
                paramB = b.fields[sortParam]
            }
            if (sortDir) {

                if (paramA < paramB) {
                    return -1;
                }
                if (paramA > paramB) {
                    return 1;
                }
            } else if (Object.keys(array[0].fields).includes('vendor')) {

                if (paramA > paramB) {
                    return -1;
                }
                if (paramA < paramB) {
                    return 1;
                }

            }
            return 0;

        }
        array.sort(compare)
        return array

    }

    const sortObject = (obj, att) => {
        if (att !== 'amount') {
            let sortedObj = Object.keys(obj).sort().reduce(function (result, key) {
                result[key] = obj[key];
                return result;
            }, {});
            setAttTotals(sortedObj)

        } else {
            let sortable = [];
            for (let amount in obj) {
                sortable.push([amount, obj[amount]]);
            }
            sortable.sort(function (a, b) {
                return a[1] - b[1];
            });

            let objSorted = {}
            sortable.forEach(function(item){
                objSorted[item[0]]=item[1]
            })
            setAttTotals(objSorted)
            setSortDir(!sortDir)
        }







    }



    const sortByHeader = (key) => {
        setSortKey(key)
        setSortDir(!sortDir)
    }

    const filterResults = async (key) => {
        let filterItems = items.filter((e, i) => {
            return e.fields.purchaser === key
        })
        setFilteredItems(filterItems)
    }

    const filterNames = (key) => {

        let obj = {}
        let keys = items.map((e) => {
            return key === 'categories' ? e.fields[key][0] : e.fields[key]
        })

        let uniqueItems = [...new Set(keys)]
        let totalAtt
        uniqueItems.map(e => {
            if (key === 'categories') {
                totalAtt = categories.filter(g => e === g.id)
                totalAtt = totalAtt[0].fields.name
            } else {
                totalAtt = e
            }
            obj[totalAtt] = 0
            items.map(f => {
                if (key === 'categories') {
                    if (f.fields[key][0] === e) {
                        obj[totalAtt] += f.fields.amount
                    }
                } else {
                    if (f.fields[key] === e) {
                        obj[totalAtt] += f.fields.amount
                    }
                }



            })
        })
        setAttTotals(obj)
    }



    const { date, vendor, name, amount, purchaser } = editMode ? currentItem.fields || '' : item
    const cats = editMode ? currentItem.fields.categories || [] : item.categories || []
    let total = 0
    let lyssieTotal = 0
    let marcaTotal = 0


    return (
        <div>
            <div className='home'>

                <form style={editMode ? { background: '#f9c3c3' } : {}} onSubmit={(e) => handleSubmit(e, editMode ? currentItem.id : null)}>
                    <label for={item.date}>Date</label>
                    <input
                        className='date'
                        name='date'
                        id={item.date}
                        type='date'
                        value={date || ''}
                        onChange={handleChange}

                    />
                    <label for={item.vendor}>Vendor</label>
                    <input
                        className='vendor'
                        name='vendor'
                        id={item.vendor}
                        type='text'
                        value={vendor || ''}
                        onChange={handleChange}

                    />
                    <label for={item.name}>Item</label>
                    <input
                        className='name'
                        name='name'
                        id={item.name}
                        type='text'
                        value={name || ''}
                        onChange={handleChange}

                    />
                    <label for={item.amount}>Amount</label>
                    <input
                        className='amount'
                        name='amount'
                        id={item.amount}
                        type='number'
                        step='0.01'
                        value={amount || ''}
                        onChange={handleChange}
                    />
                    <div>
                        <label for={item.purchaser}>Lyssie</label>
                        <input
                            className='purchaser'
                            name='purchaser'
                            id={item.purchaser}
                            type='radio'
                            value={'Lyssie'}
                            onChange={handleChange}
                            checked={purchaser === 'Lyssie'}

                        />
                    </div>
                    <div>
                        <label for={item.purchaser}>Marca</label>
                        <input
                            className='purchaser'
                            name='purchaser'
                            id={item.purchaser}
                            type='radio'
                            value={'Marca'}
                            onChange={handleChange}
                            checked={purchaser === 'Marca'}

                        />
                    </div>
                    <div className='categories'>
                        {alphaSort(categories, 'name').map((e, i) => (
                            <div key={i} className='category'>
                                {/* {console.log(cats.includes(e.fields.name))}
                            {console.log('e', e.fields.name)} */}
                                {/* {console.log('here', cats.map(e=>Object.keys(e).toString() === e.fields.name))} */}
                                <input
                                    index={i}
                                    className='category'
                                    name={e.fields.name}
                                    id={e.id}
                                    type='checkbox'
                                    checked={cats.includes(e.id) || false}
                                    // onChange={e => setChecked({ ...checked, [e.target.id]: e.target.checked })}
                                    onChange={handleChange}
                                />
                                <label key={i} for={e.id}>{e.fields.name}</label>

                            </div>

                        ))}
                    </div>
                    <input
                        type='submit'
                        value='submit'
                    />
                </form>
                <div className='content'>
                    <div className='details-header'>
                        {
                            Object.keys(attTotals).length ?
                                <>
                                    <p onClick={() => sortObject(attTotals, 'category')}>category</p>
                                    <p onClick={() => sortObject(attTotals, 'amount')}>amount</p>

                                </> :
                                <>
                                    <p onClick={() => sortByHeader('date')}>Date</p>
                                    <p onClick={() => sortByHeader('vendor')}>Vendor</p>
                                    <p onClick={() => sortByHeader('name')}>Name</p>
                                    <p onClick={() => sortByHeader('amount')} className='amount'>Amount</p>
                                    <p onClick={() => sortByHeader('purchaser')}>Purchaser</p>
                                    <p>Categories</p>
                                    <p>delete</p>
                                </>
                        }

                    </div>



                    <div className='results'>

                        {Object.keys(attTotals).length ?
                            Object.keys(attTotals).map(e => {
                                total += parseInt(attTotals[e].toFixed(2))
                                // lyssieTotal += parseFloat(e.fields.purchaser === 'Lyssie' ? e.fields.amount : 0)
                                // marcaTotal += parseFloat(e.fields.purchaser === 'Marca' ? e.fields.amount : 0)
                                return (
                                    <div className='details'>
                                        <p>{e}</p>
                                        <p>{attTotals[e].toFixed(2)}</p>
                                    </div>
                                )

                            }) :
                            alphaSort(filteredItems.length ? filteredItems : items, sortKey).map((e, i) => {
                                total += parseFloat(e.fields.amount)
                                lyssieTotal += parseFloat(e.fields.purchaser === 'Lyssie' ? e.fields.amount : 0)
                                marcaTotal += parseFloat(e.fields.purchaser === 'Marca' ? e.fields.amount : 0)

                                let date = new Date(e.fields.date);
                                date = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
                                return (
                                    <div
                                        className='details'
                                        onClick={(evt) => handleUpdate(evt, e.id, i)}
                                        style={selected === i ? { background: '#f9c3c3' } : {}
                                        }>

                                        <p>{new Date(date).toLocaleDateString()}</p>
                                        <p>{e.fields.vendor}</p>
                                        <p>{e.fields.name}</p>
                                        <p className='amount'>{e.fields.amount.toFixed(2)}</p>
                                        <p>{e.fields.purchaser}</p>

                                        <div className='cats'>{categories.filter(el => e.fields.categories.includes(el.id)).map(f => <p>{f.fields.name}</p>)}</div>
                                        <p onClick={(evt) => handleDelete(evt, e.id)}>X</p>

                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className='total-and-filters'>

                        <div className='filters'>

                            <div className='filters-buttons'>
                                <button onClick={() => getAllItems()}>List</button>
                                <button onClick={() => filterNames('vendor')}>Vendors</button>
                                <button onClick={() => filterNames('categories')}>Categories</button>





                            </div>
                            {/* <div className='totals'>
                                <div className='att-totals-list'>
                                    {Object.keys(attTotals).sort().map(e => (
                                        <div className='attTotals'><span>{e}</span><span>{attTotals[e].toFixed(2)}</span></div>
                                    ))}
                                </div>
                            </div> */}
                        </div>
                        <div className='total'>
                            <div><span onClick={() => filterResults('Lyssie')}>Lyssie</span><span>{lyssieTotal.toFixed(2)}</span></div>
                            <div><span onClick={() => filterResults('Marca')}>Marca</span><span>{marcaTotal.toFixed(2)}</span></div>
                            <div><span onClick={() => getAllItems()}>Total</span><span>{total.toFixed(2)}</span></div>
                        </div>
                    </div>



                </div>


            </div>

        </div>
    )
}

export default Home
import React, { useState, useEffect } from 'react';

import * as firebase from 'firebase/app'
import 'firebase/database'

const config = {
  apiKey: "AIzaSyBbC69-D5LAOzM35SOhe5FUTFkoQzQkmcg",
  authDomain: "pcad-44a81.firebaseapp.com",
  databaseURL: "https://pcad-44a81.firebaseio.com",
  projectId: "pcad-44a81",
  storageBucket: "pcad-44a81.appspot.com",
  messagingSenderId: "764635075221",
  appId: "1:764635075221:web:7268bc2d70c452c436419c",
  measurementId: "G-3K6LW8BLNX"
}

firebase.initializeApp(config)

const db = firebase.database();
const ref = db.ref('Data')

const Search = () => {
  const [data, setData] = useState([])
  const [patients, setPatients] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    ref.on('value', response => {
      const temp = []
      Object.entries(response.val()).map((element, index) => (
        temp.push(element[0])
      ))
      setData(temp)
      setPatients(temp)
    })
  }, [])

  useEffect(() => {
    console.log(data)
    const filterData = () => {
      const regex = new RegExp(filter, 'i')
      const result = data.filter(entry => {
        return (
          regex.test(entry)
        )
      })
      setPatients(result)
    }
    filterData()
  }, [filter, data])

  return (
    <div className="content">
      <input
        type='text'
        onChange={(e) => {
          setFilter(e.target.value)
        }}
        placeholder='Buscar paciente...'
        value={filter} />
      {
        patients.map((element, index) => (
          <div key={index}>
            {element}
          </div>
        ))
      }
    </div>
  );
}

export default Search;

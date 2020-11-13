import React, { useState, useEffect } from 'react';

import * as firebase from 'firebase/app'
import 'firebase/database'

import Table from '../Table';


const Search = (props) => {

  const db = firebase.database();

  const [data, setData] = useState([])
  const [patients, setPatients] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    db.ref('Data').on('value', response => {
      const temp = []
      Object.entries(response.val()).map((element, index) => (
        temp.push({element})
      ))
      setData(temp)
      setPatients(temp)
    })
  }, [db])

  useEffect(() => {
    const filterData = () => {
      const regex = new RegExp(filter, 'i')
      const result = data.filter(entry => {
        return (
          regex.test(entry.element[0])
        )
      })
      setPatients(result)
    }
    filterData()
  }, [filter, data])


  const columns = [
    {
      name:'Nombre',
      selector: 'name',
      cell: row => (row.element[0])
    }
  ]

  return (
    <section className="container-fluid">
      <section className="row justify-content-center">
        <section className="col-12 col-sm-6 col-md-4">
          <div className="content">
            <input
              type='text'
              onChange={(e) => {
                setFilter(e.target.value)
              }}
              placeholder='Buscar paciente...'
              value={filter} />
              <Table
                onRowClicked={(row) => window.location = `/paciente?name=${row.element[0]}`}
                className='table'
                columns={columns}
                data={patients} />
          </div>
        </section>
      </section>
    </section>
  );
}

export default Search;

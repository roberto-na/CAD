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

  // console.log(patients)

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

  const columnsDateExpanded = [
    {
      name: 'Fecha',
      selector: 'date',
      cell: row => (
        row.element[0]
      )
    },
  ]

  const columnsTimeExpanded = [
    {
      name: 'Hora',
      selector: 'time',
      cell: row => (
        row.element[0]
      )
    }
  ]

  const columns = [
    {
      name:'Nombre',
      selector: 'name',
      cell: row => (row.element[0])
    }
  ]

  const ExpandedTimeSection = (data) => {
    const temp = []
    Object.entries(data.data.element[1]).map((element, index) => (
      temp.push({name: data.data.name, date: data.data.element, element})
    ))
    return (
      <Table
        className='no-header'
        onRowClicked={(data) => window.location = `/paciente?name=${data.name}&date=${data.date[0]}&time=${data.element[0]}`}
        columns={columnsTimeExpanded}
        data = {temp} />
    )
  }

  const ExpandedDateSection = (data) => {
    const temp = []
    Object.entries(data.data.element[1]).map((element, index) => (
      temp.push({name: data.data.element[0],
      element})
    ))

    return (
      <Table
        className='no-header'
        expandableRows
        expandableRowsComponent={<ExpandedTimeSection />}
        columns={columnsDateExpanded}
        data={temp} />
    )
  }


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
                className='table'
                expandableRows
                expandableRowsComponent={<ExpandedDateSection />}
                columns={columns}
                data={patients} />
          </div>
        </section>
      </section>
    </section>
  );
}

export default Search;

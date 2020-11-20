import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2'
import regression from 'regression';
import baselineCorrection from 'ml-baseline-correction-regression';
import Dropdown from '../Dropdown';

import * as firebase from 'firebase/app'
import 'firebase/database'
import 'chartjs-plugin-zoom';

import deleteIcon from './icons/Delete-icon.png'

import styles from './index.module.css';

const Graph = (props) => {

  const db = firebase.database();
  const [sidebarOptions, setSidebarOptions] = useState({})
  const [dates, setDates] = useState([])
  const [selected, setSelected] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [times, setTimes] = useState([])
  const [selectedTime, setSelectedTime] = useState('')
  const [disableTimes, setDisableTimes] = useState(false)
  const [disableButton, setDisableButton] = useState(false)
  const [filters, setFilters] = useState([])
  const [data, setData] = useState({})
  const [linearRegression, setLinearRegression] = useState({
    r2: null,
    formula: null,
  })
  const [selectedGraph, setSelectedGraph] = useState(null)

  const urlParams = new URLSearchParams(window.location.search)

  useEffect(() => {
    db.ref(`Data/${urlParams.get('name')}`)
    .on('value', response => {
      setSidebarOptions(response.val())
    })
  }, [db])

  useEffect(() => {
    const getLinearRegression = () => {
      const concatValues = []
      data.datasets.map((element, i) => {
        if(selectedGraph && selectedGraph.id === i) return;
        concatValues.push([parseFloat(element.description), element.max])
      })
      concatValues.sort((a, b) => a[0] - b[0]);
      const lr = getRegression(concatValues)
      setLinearRegression({
        r2: lr.r2,
        formula: lr.string
      })
    }
    getLinearRegression()
  }, [data])

  const options = {
    zoom: {
      enabled: true,
      mode: 'x',
    },
    pan: {
      enabled: true,
      mode: 'x',
    },
  }

  const getData = (folder) => {
    setSelected(folder)
    db.ref(`Data/${urlParams.get('name')}/${folder}`)
    .on('value', response => {
      const options = []
      Object.keys(response.val()).forEach((key) => {
        options.push({
          value: key,
          label: key,
        })
      });
      setDates(options)
    })
  }

  const getTimes = (value) => {
    setDisableTimes(true)
    db.ref(`Data/${urlParams.get('name')}/${selected}/${value.value}`)
    .on('value', response => {
      const options = []
      Object.keys(response.val()).forEach((key) => {
          options.push({
            value: key,
            label: key,
          })
      });
      setTimes(options)
    })
  }

const getRegression = (data) => {
    return regression.linear(data, {precision: 5})
  };

  const addFilter = (selectedToGraph) => {
    const filter = [...filters, {date: selectedDate, time:selectedTime}]
    setFilters(filter)
    db.ref(`Data/${urlParams.get('name')}/${selected}/${selectedDate}/${selectedTime}`)
    .on('value', response => {
      const current = response.val().Corriente.replace(/ /g,'').split(',').map(Number)
      const voltage = response.val().Voltaje.replace(/ /g,'').split(',').map(Number)
      const {corrected, delta, iteration, baseline} = baselineCorrection(voltage, current); //baseline correction
      let max = corrected[0]
      let mean = 0;
      let sd = 0;
      for(let i = 0; i < current.length; i++) {
        max = Math.max(max, corrected[i])
        mean += corrected[i]
      }
      mean = mean / current.length;
      const concatValuesData = []
      for(let i = 0; i < current.length; i++) {
        sd += (Math.pow((corrected[i] - mean), 2) / current.length)
        concatValuesData.push({x: voltage[i], y: corrected[i]})
      }
      sd = Math.sqrt(sd)
      const r = Math.floor(Math.random() * Math.floor(256))
      const g = Math.floor(Math.random() * Math.floor(256))
      const b = Math.floor(Math.random() * Math.floor(256))
      const dataToGraph = {
        id: data.datasets ? data.datasets.length : 0,
        typeToDisplay: 'original',
        label: selectedDate + " " + selectedTime,
        data: concatValuesData,
        fill: false,
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
        borderColor: `rgb(${r}, ${g}, ${b})`,
        showLine: true,
        description: response.val().Descripcion,
        max: max,
        sd: sd,
      }
      const newData = [...data.datasets, dataToGraph]
      setData(prevState => ({
        datasets: newData,
      }))
      if(selectedToGraph) {
        const concatValues = []
        for(let i = 0; i < current.length; i++) {
          const temp = []
          temp.push(voltage[i])
          temp.push(corrected[i])
          concatValues.push(temp)
        }
        const lr = getRegression(concatValues)
        dataToGraph.lr = lr
        setSelectedGraph(dataToGraph)
      }
    })
    setDisableButton(false)
    setDisableTimes(false)
  }

  const removeFilter = (index) => {
    setFilters(filters.filter((value, i) => i !== index))
    const newData = []
    Object.keys(data.datasets).forEach((key) => {
      if(key != index) {
        newData.push(data.datasets[key])
      }
    });
    setData(prevState => ({
      datasets: newData
    }))
    if(selectedGraph && index === selectedGraph.id) {
      setSelectedGraph(null)
    }
  }

  console.log(selectedGraph)

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {Object.keys(sidebarOptions).map((key) => (
          <button key={key} onClick={() => {getData(key)}}
          className={styles.nav}>{key}</button>
        ))}
      </div>
      <div className={styles.graphContainer}>
        <div className={styles.graphContent}>
          <h1 className={styles.title}>{selected}{selected && ' - '}{urlParams.get('name')}</h1>
          <div className={styles.graphInformation}>
            <div className={styles.graph}>
              <div className={styles.header}>
                {selected && (
                  <div className={styles.graphFilters}>
                    <Dropdown
                      className={styles.dropdown}
                      label='Selecciona una fecha'
                      selected={selectedDate}
                      onChange={(value) => {setSelectedDate(value.value); getTimes(value)}}
                      options={dates}/>
                    <Dropdown
                    className={styles.dropdown}
                      label='Selecciona una hora'
                      selected={selectedTime}
                      disabled={!disableTimes}
                      onChange={(value) => {setSelectedTime(value.value); setDisableButton(true)}}
                      options={times}/>
                    <button disabled={!disableButton} onClick={() => addFilter(false)} style={{marginRight: '12px'}}>
                      Añadir fecha
                    </button>
                    <button disabled={!disableButton} onClick={() => addFilter(true)}>
                      Regresión lineal
                    </button>
                  </div>
                )}
                <div className={styles.displayFilters}>
                  {
                    filters.map((filter, i) => (
                      <div className={`${styles.filter} ${selectedGraph && i === selectedGraph.id && styles.selected}`} key={i}>
                        {`${filter.date} ${filter.time}`}
                        <div className={styles.delete}
                        onClick={() => removeFilter(i)}>
                          <img src={deleteIcon} alt='delete' style={{height: '10px'}}/>
                        </div>
                      </div>
                    ))
                  }
                </div>
                {data && (
                  <div className={styles.graphLine}>
                    <Scatter data={data} options={options}/>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.stadistics}>
              <h3>Estadísticas</h3>
              <table>
                <thead>
                  <tr>
                    <th>Concentración</th>
                    <th>Pico máximo</th>
                    <th>Desviación estandar</th>
                  </tr>
                </thead>
                {data.datasets && data.datasets.map((element, i) => {
                  if(selectedGraph && selectedGraph.id === i) {
                    return null
                  }
                  return (
                    <tbody key={i}>
                      <tr>
                        <th style={{display: 'flex', alignItems: 'center'}}>
                          <div className={styles.color} style={{backgroundColor: element.backgroundColor}} />
                          {element.description}
                        </th>
                        <th>{element.max}</th>
                        <th>{element.sd.toFixed(4)}</th>
                      </tr>
                    </tbody>)
                })}
              </table>
              <table style={{marginTop: '12px'}}>
                <tbody>
                  <tr>
                    <th>Regresión lineal</th>
                    <th>R2</th>
                  </tr>
                  <tr>
                    {linearRegression.formula && <th>{linearRegression.formula}</th>}
                    {linearRegression.r2 && <th>{linearRegression.r2}</th>}
                  </tr>
                </tbody>
              </table>
              <h6 style={{marginTop: '24px'}}>Evaluación de regresión lineal</h6>
              <table>
                <thead>
                  <tr>
                    <th>Concentración</th>
                    <th>Pico máximo</th>
                    <th>Desviación estandar</th>
                  </tr>
                </thead>
                {
                  selectedGraph && (
                    <tbody>
                      <tr>
                        <th style={{display: 'flex', alignItems: 'center'}}>
                        <div className={styles.color} style={{backgroundColor: selectedGraph.backgroundColor}} />
                        {selectedGraph.description}
                        </th>
                        <th>{selectedGraph.max}</th>
                        <th>{selectedGraph.sd.toFixed(4)}</th>
                      </tr>
                    </tbody>
                  )
                }
              </table>
              {selectedGraph && (
                <div>
                  <p style={{marginTop: '12px'}}><strong>Fórmula:&nbsp;</strong>{selectedGraph.lr.string}</p>
                  <p>y = {selectedGraph.lr.equation[0] * parseFloat(selectedGraph.max) + selectedGraph.lr.equation[1]}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Graph

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'

import Dropdown from '../Dropdown';

import * as firebase from 'firebase/app'
import 'firebase/database'

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    db.ref(`Data/${urlParams.get('name')}`)
    .on('value', response => {
      setSidebarOptions(response.val())
    })
  }, [db])

  const getData = (folder) => {
    setSelected(folder)
    const urlParams = new URLSearchParams(window.location.search)
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
    const urlParams = new URLSearchParams(window.location.search)
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

  const addFilter = () => {
    const filter = [...filters, {date: selectedDate, time:selectedTime}]
    setFilters(filter)
    const urlParams = new URLSearchParams(window.location.search)
    db.ref(`Data/${urlParams.get('name')}/${selected}/${selectedDate}/${selectedTime}`)
    .on('value', response => {
      const current = response.val().Corriente.replace(/ /g,'').split(',').map(Number)
      const r = Math.floor(Math.random() * Math.floor(256))
      const g = Math.floor(Math.random() * Math.floor(256))
      const b = Math.floor(Math.random() * Math.floor(256))
      const dataToGraph = {
        label: selectedDate + " " + selectedTime,
        data: current,
        fill: false,
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
        borderColor: `rgb(${r}, ${g}, ${b}, 0.2)`
      }
      const newData = [...data.datasets, dataToGraph]
      const voltage = response.val().Voltaje.replace(/ /g,'').split(',')
      let newLabels = []
      let i = 0, j = 0;
      while(i < data.labels.length && j < voltage.length) {
          if(data.labels[i] < voltage[j]) {
            newLabels.push(data.labels[i]);
            i++;
          } else if(data.labels[i] === voltage[j]) {
            newLabels.push(data.labels[i]);
            i++;
            j++;
          } else {
            newLabels.push(voltage[j]);
            j++;
          }
      }
      if(i < data.labels.length) {
        for(let k = i; k < data.labels.length; k++) {
          newLabels.push(data.labels[k])
        }
      }
      if(j < voltage.length) {
        for(let k = i; k < voltage.length; k++) {
          newLabels.push(voltage[k])
        }
      }
      setData(prevState => ({
        labels: newLabels,
        datasets: newData,
      }))
    })
    setSelectedDate('')
    setSelectedTime('')
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
  }

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
          <h1 className={styles.title}>{selected}</h1>
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
                    <button disabled={!disableButton} onClick={() => addFilter()}>
                      Añadir fecha
                    </button>
                  </div>
                )}
                <div className={styles.displayFilters}>
                  {
                    filters.map((filter, i) => (
                      <div className={styles.filter} key={i}>
                        {`${filter.date} ${filter.time}`}
                        <div className={styles.delete} onClick={() => removeFilter(i)}>
                          <img src={deleteIcon} alt='delete' style={{height: '10px'}}/>
                        </div>
                      </div>
                    ))
                  }
                </div>
                {data && (
                  <div className={styles.graphLine}>
                    <Line data={data}/>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.stadistics}>
              <h3>Estadísticas</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Graph

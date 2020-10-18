import React, { useEffect, useState } from 'react';

import * as firebase from 'firebase/app'
import 'firebase/database'

const Graph = (props) => {

  const db = firebase.database();
  const [data, setData] = useState({
    file: '',
    current: '',
    description: '',
    time: '',
    voltage: '',
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    db.ref(`Data/${urlParams.get('name')}/${urlParams.get('date')}/${urlParams.get('time')}`)
    .on('value', response => {
      setData({
        file: response.val().Archivo,
        current: response.val().Corriente,
        description: response.val().Descripción,
        time: response.val().Tiempo,
        voltage: response.val().Voltaje,
      })
    })
  }, [])

  console.log(data)

  return (
    <div>
      owo
    </div>
  )
}

export default Graph

import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import { geolocated } from "react-geolocated";
import * as d3 from "d3";
function App() {
  const [latitud, setLatitud] = useState(0)
  const [longitud, setLongitud] = useState(0)
  const [color, setColor] = useState('')
  const [result, setResult] = useState('')
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  useEffect(() => {


    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;

      setLatitud(crd.latitude)
      setLongitud(crd.longitude)
    };

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  })
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setColor('')
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }


  const handleSubmit = () => {


    var myInit = {
      method: 'POST',
    }
    async function postData() {
      var myRequest = new Request(`http://ec2-34-204-101-3.compute-1.amazonaws.com/data?latitud=${latitud}&longitud=${longitud}`, myInit);
      const response = await fetch(`http://ec2-34-204-101-3.compute-1.amazonaws.com/data?latitud=${latitud}&longitud=${longitud}`, {
        method: 'POST'
      })
      return response.json();
    }
    postData()
      .then(data => {
        // alert(data.result); // JSON data parsed by `data.json()` call
        setColor(Object.values(data.result)[1]);
        setResult(Object.values(data.result)[0]);
      });

  }
  const handleClose = (e) => {
    e.preventDefault()
    setColor('')
  }
  return (
    <div className="App">

      <h4>Calidad del Aire Medellín</h4>
      <button onClick={handleSubmit}>Consulta en tu ubicación</button>
      <iframe name="I1" id="if1"
        src="http://ec2-34-204-101-3.compute-1.amazonaws.com"></iframe>
      {color != '' && <div className="container" onClick={handleClose}>
        <div className="container-result" style={{ borderColor: color, color: color, borderWidth: '10px', borderStyle: 'solid', backgroundColor: 'white' }}>La calidad del aire en tu ubicación es:<br/><br/> <b>{result}</b>`</div></div>}
    </div>
  );
}

export default App;

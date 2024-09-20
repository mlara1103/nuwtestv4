import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./add.css";
import toast from 'react-hot-toast';

const Add = () => {

  const users = {
    nboletas:"",
    vcefectivo:"",
    vsefectivo:"",
    email:"",
    password:""
  }

  const [user, setUser] = useState(users);
  const navigate = useNavigate();

  const inputHandler = (e) =>{
      const {name, value} = e.target;
      setUser({...user, [name]:value});
  }

  const submitForm = async(e) =>{
    e.preventDefault();
    await axios.post("http://localhost:8000/api/create", user)
    .then((response)=>{
      toast.success("Boleta Agregada correctamente", { position: 'top-right' });

       navigate("/")
    })
    .catch(error => console.log(error))
  }


  return (
    <div className='addUser'>
        <Link to={"/"}>Volver atrás</Link>
        <h3>Añade tu nuevo dia de Boletas</h3>
        <form className='addUserForm' onSubmit={submitForm}>
            <div className="inputGroup">
                <label htmlFor="nboletas">Numero de Boletas</label>
                <input type="text" onChange={inputHandler} id="nboletas" name="nboletas" autoComplete='off' placeholder='Ingrese Numero de Boletas' />
            </div>
            <div className="inputGroup">
                <label htmlFor="vcefectivo">Ventas con Efectivo</label>
                <input type="number" onChange={inputHandler} id="vcefectivo" name="vcefectivo" autoComplete='off' placeholder='Ingrese las ventas con efectivo' />
            </div>
            <div className="inputGroup">
                <label htmlFor="vsefectivo">Ventas con Tarjeta</label>
                <input type="number" onChange={inputHandler} id="vsefectivo" name="vsefectivo" autoComplete='off' placeholder='Ingrese las ventas con tarjeta' />
            </div>
            {/* <div className="inputGroup">
                <label htmlFor="email">Email</label>
                <input type="email" onChange={inputHandler} id="email" name="email" autoComplete='off' placeholder='Email' />
            </div>
            <div className="inputGroup">
                <label htmlFor="password">Password</label>
                <input type="password" onChange={inputHandler} id="password" name="password" autoComplete='off' placeholder='password' />
            </div>*/}
            <div className="inputGroup">
                <button type="submit">Añadir Boleta Diaria</button>
            </div>
        </form>
    </div>
  )
}

export default Add
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import "../adduser/add.css";
import toast from 'react-hot-toast';

const Edit = () => {

 const users = {
    nboletas: "",
    vcefectivo: "",
    vsefectivo:"",
    email: ""
 }

 const {id} = useParams();
 const navigate = useNavigate();
 const [user, setUser] = useState(users);

 const inputChangeHandler = (e) =>{
    const {name, value} = e.target;
    setUser({...user, [name]:value});
    console.log(user);
 }

 useEffect(()=>{
    axios.get(`http://localhost:8000/api/getone/${id}`)
    .then((response)=>{
        setUser(response.data)
    })
    .catch((error)=>{
        console.log(error);
    })
 },[id])


 const submitForm = async(e)=>{
    e.preventDefault();
    await axios.put(`http://localhost:8000/api/update/${id}`, user)
    .then((response)=>{
       toast.success(response.data.msg, {position:"top-right"})
       navigate("/")
    })
    .catch(error => console.log(error))
 }

  return (
    <div className='addUser'>
        <Link to={"/"}>Volver atrás</Link>
        <h3>Estas editando la boleta seleccionada</h3>
        <form className='addUserForm' onSubmit={submitForm}>
            <div className="inputGroup">
                <label htmlFor="nboletas">Numero de Boletas</label>
                <input type="text" value={user.nboletas} onChange={inputChangeHandler} id="nboletas" name="nboletas" autoComplete='off' placeholder='Ingrese numero de boletas' />
            </div>
            <div className="inputGroup">
                <label htmlFor="vcefectivo">Ventas con Efectivo</label>
                <input type="number" value={user.vcefectivo} onChange={inputChangeHandler} id="vcefectivo" name="vcefectivo" autoComplete='off' placeholder='Ingrese la venta con efectivo' />
            </div>
            <div className="inputGroup">
                <label htmlFor="email">Ventas con Tarjeta</label>
                <input type="number" value={user.vsefectivo} onChange={inputChangeHandler} id="vsefectivo" name="vsefectivo" autoComplete='off' placeholder='Ingrese las ventas con tarjeta' />
            </div>
            {/* <div className="inputGroup">
                <label htmlFor="email">Email</label>
                <input type="email" value={user.email} onChange={inputChangeHandler} id="email" name="email" autoComplete='off' placeholder='Email' />
            </div>*/}
            <div className="inputGroup">
                <button type="submit">Actualizar dia</button>
            </div>
        </form>
    </div>
  )
}

export default Edit
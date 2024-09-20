import React, { useEffect, useState } from 'react';
import axios from "axios";
import toast from "react-hot-toast";
import "./user.css";
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/getall");
        setUsers(response.data);
      } catch (error) {
        toast.error("Error al cargar los usuarios", { position: 'top-right' });
      }
    };

    fetchData();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete/${userId}`);
      setUsers((prevUser) => prevUser.filter((user) => user._id !== userId));
      toast.success("Usuario eliminado correctamente", { position: 'top-right' });
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar el usuario", { position: 'top-right' });
    }
  };

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  let totalEfectivo = 0;
  let totalTarjeta = 0;
  let totalVentas = 0;

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte de Ventas Septiembre 2024", 14, 16);
    doc.setFontSize(10);

    const tableData = users.map((user, index) => {
      const efectivo = parseFloat(user.vcefectivo) || 0;
      const tarjeta = parseFloat(user.vsefectivo) || 0;
      const total = efectivo + tarjeta;

      return [
        index + 1,
        user.nboletas || 0,
        formatCurrency(efectivo),
        formatCurrency(tarjeta),
        formatCurrency(total),
      ];
    });

    const tableColumn = ["Día", "Números de Boletas", "Ventas en Efectivo", "Ventas con Tarjeta", "Total Ventas"];

    doc.autoTable({
      head: [tableColumn],
      body: tableData,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: '#4e73df', textColor: '#ffffff' },
      styles: { cellPadding: 2, fontSize: 10 },
    });

    totalEfectivo = users.reduce((sum, user) => sum + (parseFloat(user.vcefectivo) || 0), 0);
    totalTarjeta = users.reduce((sum, user) => sum + (parseFloat(user.vsefectivo) || 0), 0);
    totalVentas = totalEfectivo + totalTarjeta;

    const totalRow = [
      '', // Espacio vacío para la columna de "Septiembre"
      'Total', 
      formatCurrency(totalEfectivo),
      formatCurrency(totalTarjeta),
      formatCurrency(totalVentas),
    ];

    doc.autoTable({
      head: [["", "Total", "Ventas en Efectivo", "Ventas con Tarjeta", "Total Ventas"]],
      body: [totalRow],
      startY: doc.autoTable.previous.finalY + 10,
      theme: 'grid',
      headStyles: { fillColor: '#4e73df', textColor: '#ffffff' },
      styles: { cellPadding: 2, fontSize: 10, fontStyle: 'bold' },
    });

    doc.save("reporte_ventas.pdf");
  };

  const sendReportToWhatsApp = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte de Ventas Septiembre 2024", 14, 16);
    doc.setFontSize(10);

    const tableData = users.map((user, index) => {
      const efectivo = parseFloat(user.vcefectivo) || 0;
      const tarjeta = parseFloat(user.vsefectivo) || 0;
      const total = efectivo + tarjeta;

      return [
        index + 1,
        user.nboletas || 0,
        formatCurrency(efectivo),
        formatCurrency(tarjeta),
        formatCurrency(total),
      ];
    });

    const tableColumn = ["Día", "Números de Boletas", "Ventas en Efectivo", "Ventas con Tarjeta", "Total Ventas"];

    doc.autoTable({
      head: [tableColumn],
      body: tableData,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: '#4e73df', textColor: '#ffffff' },
      styles: { cellPadding: 2, fontSize: 10 },
    });

    totalEfectivo = users.reduce((sum, user) => sum + (parseFloat(user.vcefectivo) || 0), 0);
    totalTarjeta = users.reduce((sum, user) => sum + (parseFloat(user.vsefectivo) || 0), 0);
    totalVentas = totalEfectivo + totalTarjeta;

    const totalRow = [
      '', // Espacio vacío para la columna de "Septiembre"
      'Total', 
      formatCurrency(totalEfectivo),
      formatCurrency(totalTarjeta),
      formatCurrency(totalVentas),
    ];

    doc.autoTable({
      head: [["", "Total", "Ventas en Efectivo", "Ventas con Tarjeta", "Total Ventas"]],
      body: [totalRow],
      startY: doc.autoTable.previous.finalY + 10,
      theme: 'grid',
      headStyles: { fillColor: '#4e73df', textColor: '#ffffff' },
      styles: { cellPadding: 2, fontSize: 10, fontStyle: 'bold' },
    });

    // Guardar PDF
    const pdfOutput = doc.output('blob'); // Obtener el PDF como blob
    const pdfUrl = URL.createObjectURL(pdfOutput); // Crear una URL del blob

    // Enlace de WhatsApp
    const whatsappNumber = '+56999338158'; // Cambia esto por el número de WhatsApp deseado
    const message = 'Aquí está el reporte de ventas: ';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)} ${encodeURIComponent(pdfUrl)}`;

    // Abrir WhatsApp con el mensaje
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className='userTable'>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Link to={"/add"} className='addButton'>Añadir nueva boleta diaria</Link>
        <button onClick={sendReportToWhatsApp} className="reportButton" style={{ backgroundColor: '#25D366', color: 'white' }}>
          Enviar Reporte por WhatsApp
        </button>
      </div>
      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>Septiembre</th>
            <th>Números de Boletas</th>
            <th>Ventas en Efectivo</th>
            <th>Ventas con Tarjeta</th>
            <th>Total Ventas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map((user, index) => {
              const efectivo = parseFloat(user.vcefectivo) || 0;
              const tarjeta = parseFloat(user.vsefectivo) || 0;
              const total = efectivo + tarjeta;

              totalEfectivo += efectivo;
              totalTarjeta += tarjeta;
              totalVentas += total;

              return (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.nboletas}</td>
                  <td>{formatCurrency(efectivo)}</td>
                  <td>{formatCurrency(tarjeta)}</td>
                  <td>{formatCurrency(total)}</td>
                  <td className='actionButtons'>
                    <button onClick={() => deleteUser(user._id)}><i className="fa-solid fa-trash"></i></button>
                    <Link to={`/edit/` + user._id}><i className="fa-solid fa-pen-to-square"></i></Link>
                  </td>
                </tr>
              );
            })
          }
          <tr>
            <td colSpan={2}><strong>Total</strong></td>
            <td><strong>{formatCurrency(totalEfectivo)}</strong></td>
            <td><strong>{formatCurrency(totalTarjeta)}</strong></td>
            <td><strong>{formatCurrency(totalVentas)}</strong></td>
            <td>
              <button onClick={generateReport} className="reportButton" style={{ backgroundColor: '#FF3D00', color: 'white' }}>
                Generar Reporte
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default User;
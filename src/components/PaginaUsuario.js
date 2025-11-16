import { Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from "./DashboardLayout";

export default function PaginaUsuario() {
  const { user } = useContext(AuthContext);
  const [nomeCliente, setNomeCliente] = useState('');

  useEffect(() => {
    const fetchNome = async () => {
      const res = await fetch(`http://52.14.133.217/api/Cliente/email/${user.email}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setNomeCliente(data.nome);
      }
    };
    fetchNome();
  }, [user]);

  return (
    <DashboardLayout user={user} nomeCliente={nomeCliente}>
      <Outlet />
    </DashboardLayout>
  );
}


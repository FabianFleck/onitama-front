"use client";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { BattleCreate } from "./battle/battle-create"; 
import PagesHeader from "./dynamic-header";
import { ToastContainer, toast } from "react-toastify";

export default function PagesLayout({ children }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [session, setSession] = useState(null);
  const theme = localStorage.getItem('theme') 

  useEffect(() => {
    async function loadSession() {
      console.log(theme)
      const sessionData = await getSession();
      if (!sessionData) {
        redirect("/auth/login");
      }
      setSession(sessionData);
    }

    loadSession();
  }, []);

  const handleModalClose = (result?) => {
    setModalOpen(false);
    if (result) {
      toast(
        <div>
          <strong>{result.message}</strong>
          <div>{result.info}</div>
        </div>,
        {
          type: result.type,
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          pauseOnHover: true,
          progress: undefined,
          theme: theme ? theme : "light",
        }
      );
    }
  };

  return (
    <div>
      <ToastContainer />
      {session && <PagesHeader session={session} setModalOpen={setModalOpen} />}
      {children}
      {isModalOpen && <BattleCreate onClose={handleModalClose} />}
    </div>
  );
}

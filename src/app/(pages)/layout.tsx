"use client";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BattleCreate } from "./battle/battle-create";
import PagesHeader from "./dynamic-header";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "next-themes"

export default function PagesLayout({ children }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [session, setSession] = useState(null);
  const { theme } = useTheme()
  const router = useRouter();

  useEffect(() => {
    async function loadSession() {
      try {
        const sessionData = await getSession();
        if (!sessionData) {
          router.push("/auth/login"); // Redireciona usando o useRouter
        } else {
          setSession(sessionData);
        }
      } catch (error) {
        console.error("Failed to load session", error);
        router.push("/auth/login"); // Garante redirecionamento em caso de erro
      }
    }

    loadSession();
  }, [router]);

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
          theme: theme,
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

import Link from "next/link";

export default function Home() {

  return (
    <div className="flex justify-center items-center bg-slate-800 text-slate-50">
        <h1>Pagina inicial</h1>
        <Link href="/battle">
          Ir para batalhas
        </Link>
    </div>
  );
}

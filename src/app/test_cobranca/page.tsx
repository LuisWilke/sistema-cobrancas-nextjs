"use client";

import { useEffect, useState } from "react";

interface Cobranca {
  codigo_cliente: string;
  documento_cliente: string;
  nome_cliente: string;
  emissao: string;
  vencimento: string;
  status: string;
  valor: string;
  juros: string;
  valor_pendente: string;
}

export default function CobrancasPage() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCobrancas = async () => {
      try {
        const response = await fetch("http://localhost:5000/cobrancas?status=pendente&page=1&per_page=10");
        if (!response.ok) {
          throw new Error("Erro ao buscar cobranças");
        }
        const data = await response.json();
        setCobrancas(data.cobrancas || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCobrancas();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de Cobranças</h1>
      {cobrancas.length === 0 ? (
        <p>Nenhuma cobrança encontrada</p>
      ) : (
        <table border={1} cellPadding={10} style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Código Cliente</th>
              <th>Nome</th>
              <th>Documento</th>
              <th>Emissão</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Valor</th>
              <th>Juros</th>
              <th>Valor Pendente</th>
            </tr>
          </thead>
          <tbody>
            {cobrancas.map((cobranca, index) => (
              <tr key={index}>
                <td>{cobranca.codigo_cliente}</td>
                <td>{cobranca.nome_cliente}</td>
                <td>{cobranca.documento_cliente}</td>
                <td>{cobranca.emissao}</td>
                <td>{cobranca.vencimento}</td>
                <td>{cobranca.status}</td>
                <td>{cobranca.valor}</td>
                <td>{cobranca.juros}</td>
                <td>{cobranca.valor_pendente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
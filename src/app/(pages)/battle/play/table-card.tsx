import { Card } from '@/components/ui/card';
import React from 'react';

const TableCard = ({ card }) => {
  if (!card) return null; // Não renderiza se não houver carta

  return (
    <div className="card">
      <h3>Carta da mesa</h3>
      <Card className="card-style">
          {/* Implementação da exibição de card */}
          {card.name}
        </Card>
    </div>
  );
};

export default TableCard;
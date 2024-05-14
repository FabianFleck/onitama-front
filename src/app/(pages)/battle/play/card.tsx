import { cn } from "@/lib/utils";

const PlayerCards = ({
  cards,
  onCardClick,
  className = "",
  isInverted = false,
  selectCard = null,
}) => {
  return (
    <div
      className={cn(
        "flex justify-center gap-[20px] mt-3 text-center items-center",
        className
      )}
    >
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="board-card"
          onClick={() => onCardClick(card.id)}
        >
          <div
            className={`cell ${
              selectCard && selectCard === card.id ? "highlight" : ""
            }`}
          >
            <div className="cell">
              <img
                src={`/images/cards/${card.name}.jpg`}
                alt={card.name}
                style={{
                  width: "210px",
                  height: "115px",
                  transform: isInverted ? "rotate(180deg)" : "none",
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerCards;

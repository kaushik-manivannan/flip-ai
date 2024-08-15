import { FC, HTMLAttributes } from "react";
import { Card, CardContent } from "./ui/card";
import SaveDialog from "./SaveDialog";

interface FlashcardsListProps extends HTMLAttributes<HTMLDivElement> {
  flashcards: any[]
  handleCardClick: (index: number) => void
  flipped: boolean[]
}
 
const FlashcardsList: FC<FlashcardsListProps> = ({className, flashcards, handleCardClick, flipped, ...props}) => {
  return (
    <>
    <div className={className} {...props}>
      {flashcards.length > 0 && flashcards.map((flashcard: any, index: number) => (
        <Card key={index} onClick={() => handleCardClick(index)} className="h-[200px]">
          <CardContent className="h-full p-0" style={{perspective: '1000px'}}>
              <div 
                className="relative w-full h-full rounded-lg" 
                style={{
                  transition: 'transform 0.6s',
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                  transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                <div 
                  className="absolute w-full h-full flex justify-center items-center p-4 box-border" 
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <p>{flashcard.front}</p>
                </div>
                <div 
                  className="absolute w-full h-full flex justify-center items-center p-4 box-border"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <p>{flashcard.back}</p>
                </div>
              </div>
          </CardContent>
        </Card>
      ))}
    </div>
    </>
  );
}
 
export default FlashcardsList;
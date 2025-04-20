import { Radio } from "@mui/material";
import "./quiz_card.scss";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface QuizCardProps {
    question?: string;
    options?: string[];
    onEdit?: () => void;
    onDelete?: () => void;
    correctAnswer?: string;
   
    }
    
const QuizCard: React.FC<QuizCardProps> = ({ question, options=[],onDelete,onEdit,correctAnswer}) => {
 


  return (
    <div id="quiz-card">
      <p>{question}</p>
      <ul className="options-list">
        {options.map((option, index) => (
          <li key={index} className="option-item">
            <label>
              <Radio
                checked={option === correctAnswer}
            
                value={option}
                name="radio-buttons"
               
              />
              {option}
            </label>
          </li>
        ))}
      </ul>

      <div className="actions">
      <Trash2 onClick={ onDelete} />
      <Pencil onClick={onEdit}/>
      </div>
    </div>
  );
};
export default QuizCard;

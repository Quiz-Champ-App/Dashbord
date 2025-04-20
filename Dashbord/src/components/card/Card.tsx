import React from "react";
import {CircleGauge, Pencil, Trash2, Award, Clock, Target } from "lucide-react";
import "./card.scss";

const availableColors = [
  "subject-math",
  "subject-cs",
  "subject-lit",
  "subject-chem",
  "subject-bio",
  "subject-geo",
  "subject-music",
  "subject-art",
];

interface CardProps {
  title: string;
  color?: string;
  index?: number;
  onClick?: (event: React.MouseEvent<Element,MouseEvent>) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  unlockPoints?: number;
  passingMarks?: number;
  timeLimit?: number;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  color, 
  index = 0, 
  onClick, 
  onEdit, 
  onDelete,
  unlockPoints,
  passingMarks,
  timeLimit
}) => {
  
  const getSubjectColor = (idx: number) => {
    const colorIndex = idx % availableColors.length;
    return availableColors[colorIndex];
  };
  // if color is provided, use it; otherwise, calculate from index
  const cardColor = color || getSubjectColor(index);
  
 

  return (
    <div className={`subject-card ${cardColor}`} onClick={onClick}>
      <div className="subject-icon-wrapper">
        <Trash2 onClick={ onDelete} />
        <Pencil onClick={onEdit}/>
      </div>
      <div className="subject-icon">
        <CircleGauge/>
      </div>
      <h3 className="subject-title">{title}</h3>
      
     
      <div className="card-metrics">
        {unlockPoints !== undefined && (
          <div className="metric-item">
            <Award size={16} />
            <span>{unlockPoints} points</span>
          </div>
        )}
        {passingMarks !== undefined && (
          <div className="metric-item">
            <Target size={16} />
            <span>{passingMarks} to pass</span>
          </div>
        )}
        {timeLimit !== undefined && (
          <div className="metric-item">
            <Clock size={16} />
            <span>{timeLimit} min</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
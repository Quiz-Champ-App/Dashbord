import { ArrowLeft } from "lucide-react";
import "./screen-header.scss";

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  onClick?: () => void;
  btn?: React.ReactNode;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  onClick,
  btn,
}) => {
  return (
    <div id="screen-header">
      <div>
        {onBack && <ArrowLeft className="back-arrow" onClick={onBack} />}
      </div>
      <div className="title">
        <h1 className="">{title}</h1>
      </div>
      <div className="button">{btn}</div>
    </div>
  );
};

export default ScreenHeader;

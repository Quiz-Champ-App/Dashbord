import { X } from "lucide-react";
import "./popup.scss";
import PrimaryBtn from "../buttons/PrimaryBtn";

interface PopupProps {
  isOpen?: boolean;
  handleClose?: () => void;
  title?: string;
  content?: React.ReactNode;
  onClick?: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, title, content,handleClose,onClick }) => {

 


  return (
  <>
    {isOpen && (
          <div id="popup">
        
          <div className="popup-close" onClick={handleClose}>
            <X />
          </div>
          <div className="popup-header">
            <h2>{title}</h2>
          </div>
          <div className="popup-content">{content}
          <PrimaryBtn
              variant="contained"
              color="primary"
              size="medium"
              onClick={onClick}
              
            />

          </div>
        
            
           
              
         
        </div>
    )}
  </>
  );
};
export default Popup;

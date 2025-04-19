import { Button } from "@mui/material";
import { SendIcon } from "lucide-react";

interface PrimaryBtnProps {
    variant?: "text" | "outlined" | "contained";
    color?: "default" | "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    onClick?: () => void;
    loading?: boolean;
    }
const PrimaryBtn:React.FC<PrimaryBtnProps> = ({variant,color,size,disabled,onClick,loading}) => {
  return (
    <div>
      <Button variant={variant} endIcon={<SendIcon /> } color={color} size={size} disabled={disabled} onClick={onClick} loading={loading}>
        Send
      </Button>
    </div>
  );
};
export default PrimaryBtn;

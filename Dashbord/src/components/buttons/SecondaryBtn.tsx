import { Button } from "@mui/material";
import { PlusIcon} from "lucide-react";

interface PrimaryBtnProps {
    variant?: "text" | "outlined" | "contained";
    color?: "default" | "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    onClick?: () => void;
    loading?: boolean;
    }
const SecondaryBtn:React.FC<PrimaryBtnProps> = ({variant,color,size,disabled,onClick,loading}) => {
  return (
    <div>
      <Button variant={variant} startIcon={<PlusIcon/> } color={color} size={size} disabled={disabled} onClick={onClick} loading={loading}>
        {loading ? "Loading..." : "Add"}
      </Button>
    </div>
  );
};
export default SecondaryBtn;

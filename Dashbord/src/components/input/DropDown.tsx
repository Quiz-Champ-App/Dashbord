
import { MenuItem, TextField } from "@mui/material";

interface TextInputProps {
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    touched?: boolean;
    error?: boolean;
    options?: Array<{ value: string; label: string }>;
    helperText?: string;
    name?: string;
}

const DropDown:React.FC<TextInputProps> = ({value,onChange,label,touched,error,options=[],helperText,name}) => {

    return (
        <div id="text-input">
          <TextField
        id="fullWidth"
        fullWidth
        name={name}
        select
        helperText={helperText}
        label={label}
        value={value}
        onChange={onChange}
        variant="outlined"
      >
       {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </TextField>
        {touched && error && (
            <div className="error-message">{error}</div>
            )}
        </div>
    );
    }
export default DropDown;

import { MenuItem, TextField } from "@mui/material";

interface TextInputProps {
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    touched?: boolean;
    error?: boolean | string;
    options?: Array<{ value: string; label: string }>;
    helperText?: string;
    name?: string;
    type?: string;
}

const DropDown:React.FC<TextInputProps> = ({value,onChange,label,touched,error,options=[],helperText,name,type}) => {

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
        type={type}
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
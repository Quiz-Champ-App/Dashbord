import { TextField } from "@mui/material";


interface TextInputProps {
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    touched?: boolean;
    error?: boolean;
    name?: string;
}

const TextInput:React.FC<TextInputProps> = ({name,value,onChange,label,touched,error}) => {

    return (
        <div id="text-input">
          <TextField
        id="fullWidth"
        name={name}
        fullWidth
        label={label}
        value={value}
        onChange={onChange}
        variant="outlined"
      />
        {touched && error && (
            <div className="error-message">{error}</div>
            )}
        </div>
    );
    }
export default TextInput;
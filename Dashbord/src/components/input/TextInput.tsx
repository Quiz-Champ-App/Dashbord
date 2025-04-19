import { TextField } from "@mui/material";


interface TextInputProps {
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    touched?: boolean;
    error?: boolean | string;
    name?: string;
    type?: string;
}

const TextInput:React.FC<TextInputProps> = ({name,value,onChange,label,touched,error,type}) => {

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
        type={type}
      />
        {touched && error && (
            <div className="error-message">{error}</div>
            )}
        </div>
    );
    }
export default TextInput;
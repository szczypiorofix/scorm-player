import {Button, type ButtonProps } from "@mui/material";

interface CustomButtonProps extends ButtonProps {
    label?: string;
}

export const CustomButton = ({ children, label, ...props }: CustomButtonProps) => {
    return (
        <Button variant='contained' {...props}>
            {label || children}
        </Button>
    );
};

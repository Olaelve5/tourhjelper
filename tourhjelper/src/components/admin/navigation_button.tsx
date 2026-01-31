import { Button, useMantineTheme } from "@mantine/core";

interface NavigationButtonProps {
  url_to_admin: boolean;
  label: string;
}

const NavigationButton = ({ url_to_admin, label }: NavigationButtonProps) => {
  const theme = useMantineTheme();

  const handleClick = () => {
    if (url_to_admin) {
      window.location.href = "/admin";
    } else {
      window.location.href = "/";
    }
  };

  return (
    <Button
      variant="filled"
      radius="md"
      bg={theme.colors.pink[8]}
      onClick={handleClick}
      m={"10px 0 2rem 0"}>
      {label}
    </Button>
  );
};

export default NavigationButton;

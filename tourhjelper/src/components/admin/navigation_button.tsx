import { Button, useMantineTheme } from "@mantine/core";
import { IconLockFilled, IconFileNeutral } from "@tabler/icons-react";

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
      bg={theme.colors.teal[8]}
      onClick={handleClick}
      leftSection={
        url_to_admin ? (
          <IconLockFilled size={18} />
        ) : (
          <IconFileNeutral size={18} />
        )
      }
      m={"10px 0 0rem 0"}>
      {label}
    </Button>
  );
};

export default NavigationButton;

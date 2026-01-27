import {
  TextInput,
  PasswordInput,
  Title,
  Container,
  Button,
  Stack,
} from "@mantine/core";
import { IconLogin2 } from "@tabler/icons-react";

import classes from "@/styles/Admin/login.module.css";

export default function LoginForm() {
  return (
    <Container size="xs" mt={60} className={classes.container}>
      <Title ta="center" order={2} mb="xl">
        Tourhjelper Admin
      </Title>

      <Stack gap="md">
        <TextInput
          label="E-post"
          placeholder="din@epost.no"
          required
          classNames={classes}
        />

        <PasswordInput
          label="Passord"
          placeholder="Ditt passord"
          required
          classNames={{ input: classes.input }}
        />

        <Button
          fullWidth
          mt="lg"
          variant="outlined"
          rightSection={<IconLogin2 />}
          bg="var(--header-color)">
          Logg inn
        </Button>
      </Stack>
    </Container>
  );
}

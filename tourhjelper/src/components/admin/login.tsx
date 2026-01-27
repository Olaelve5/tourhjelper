import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Title,
  Container,
  Button,
  Stack,
  Alert,
} from "@mantine/core";
import { IconLogin2, IconAlertCircle } from "@tabler/icons-react";
import { supabase } from "@/utils/supabase";

import classes from "@/styles/Admin/login.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError("Feil e-post eller passord.");
      setLoading(false);
    } else {
      // Success! We don't need to do anything else.
      // Supabase updates the session, and your Parent component (Admin.tsx)
      // detects this change instantly and switches to the Dashboard.
    }
  };

  return (
    <Container size="xs" mt={60} className={classes.container}>
      <Title ta="center" order={2} mb="xl">
        Tourhjelper Admin
      </Title>

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Feil"
          color="red"
          mb="md">
          {error}
        </Alert>
      )}

      <Stack gap="md">
        <TextInput
          label="E-post"
          placeholder="din@epost.no"
          required
          classNames={classes}
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />

        <PasswordInput
          label="Passord"
          placeholder="Ditt passord"
          required
          classNames={{ input: classes.input }}
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />

        <Button
          fullWidth
          mt="lg"
          variant="outlined"
          rightSection={<IconLogin2 />}
          bg="var(--header-color)"
          onClick={handleLogin}
          loading={loading}>
          Logg inn
        </Button>
      </Stack>
    </Container>
  );
}

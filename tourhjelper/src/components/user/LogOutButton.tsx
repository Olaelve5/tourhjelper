import React from "react";

import { Button, Menu } from "@mantine/core";
import { useAuth } from "@/providers/AuthProvider";
import { IconLogout2 } from "@tabler/icons-react";

export function LogOutButton() {
    const { user } = useAuth();

    return (
        <Button
        leftSection={<IconLogout2 size={20} />}
        >
            Logg ut
        </Button>
    );
}
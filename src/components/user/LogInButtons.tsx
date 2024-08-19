import React from "react";

import { Button, Menu } from "@mantine/core";
import { useAuth } from "@/providers/AuthProvider";
import { IconChevronDown } from "@tabler/icons-react";
import classes from '@/styles/User.module.css';
import { useRouter } from "next/router";
import { auth } from "@/firebase/firebaseConfig";
import { signOut } from "firebase/auth";


export function LogInButtons() {
    const { user } = useAuth();
    const router = useRouter();

    const handleLogOut = async () => {
        try {
            await signOut(auth);
            window.location.reload();
        } catch {
            console.error('Failed to log out');
        }
    };

    const handleClick = (method: string) => {
        router.push(`/${method}`);
    }

    return (
        <div>
            {user ? (
                <Menu width='target'>
                    <Menu.Target>
                        <div className={classes.loggedInText}>
                            Innlogget som {user.displayName}
                            <IconChevronDown size={20} stroke={1.5} className={classes.downIcon}/>
                        </div>
                    </Menu.Target>
                    <Menu.Dropdown className={classes.dropDown}>
                        <Menu.Item className={classes.dropItem} onClick={handleLogOut}>Logg ut</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            ) : (
                <div style={{display: 'flex', gap: '1rem', width: '100%'}}>
                    <Button className={classes.logInButton} onClick={() => handleClick('login')}>Logg in</Button>
                    <Button className={classes.registerButton} onClick={() => handleClick('register')}>Registrer deg</Button>
                </div>
            )}
        </div>
    );
};
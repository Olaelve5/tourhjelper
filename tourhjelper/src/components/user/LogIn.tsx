import React, {useState} from 'react';

import { Container, TextInput, PasswordInput, Group, Button } from '@mantine/core';
import { IconUserFilled, IconKeyFilled, IconLogin2 } from '@tabler/icons-react';
import classes from '@/styles/User.module.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig'
import { useRouter } from 'next/router';

export function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogInClick = async (e: any) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (error) {
            console.error(error);
        }
        
    };

    const userInput = () => {
        const leftSection = <IconUserFilled size={22}/>;

        return <TextInput 
                placeholder="E-post"
                leftSection={leftSection}
                classNames={classes}
                className={classes.inputWrapper}
                onChange={(event) => setEmail(event.currentTarget.value)}
                />
    }

    const passwordInput = () => {
        const leftSection = <IconKeyFilled size={22}/>;

        return <PasswordInput 
                placeholder='Passord'
                leftSection={leftSection}
                classNames={classes}
                className={classes.inputWrapper}
                onChange={(event) => setPassword(event.currentTarget.value)}
                />
    }

    return (
        <Container size="lg" my='lg' className={classes.outerContainer}>
            <Group className={classes.innerContainer}>
                <h1>Logg inn</h1>
                {userInput()}
                {passwordInput()}
                <Group>
                    <Button className={classes.button}
                    radius='sm'
                    rightSection={<IconLogin2 size={22}/>}
                    onClick={handleLogInClick}
                    >Logg inn</Button>
                </Group>
            </Group>
        </Container>
    );
};
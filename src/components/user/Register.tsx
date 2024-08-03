import React, {useState} from 'react';

import { Container, TextInput, PasswordInput, Group, Button } from '@mantine/core';
import { IconUserFilled, IconKeyFilled, IconUserPlus, IconMailFilled } from '@tabler/icons-react';
import classes from '@/styles/User.module.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConfig'
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

export function RegisterUser() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const addUserIdToDatabase = async (userId: string) => {
        await setDoc(doc(db, 'users', userId), {
            name: userName,
            email: email});
    }

    const registerUser = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)

            // Update the user's display name
            const user = auth.currentUser;

            if (user) {
                await updateProfile(user, {
                    displayName: userName
                });
                await addUserIdToDatabase(user.uid);
            }
            router.push('/planner');
        } catch (error) {
            console.error(error);
        }
    }

    const userInput = () => {
        const leftSection = <IconUserFilled size={22}/>;

        return <TextInput 
                placeholder="Brukernavn"
                leftSection={leftSection}
                classNames={classes}
                className={classes.inputWrapper}
                onChange={(event) => setUserName(event.currentTarget.value)}
                />
    }


    const emailInput = () => {
        const leftSection = <IconMailFilled size={22}/>;

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
                {emailInput()}
                {passwordInput()}
                <Group>
                    <Button className={classes.button}
                    radius='sm'
                    rightSection={<IconUserPlus size={22}/>}
                    onClick={registerUser}
                    >Registrer deg</Button>
                </Group>
            </Group>
        </Container>
    );
};
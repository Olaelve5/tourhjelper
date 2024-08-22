import { Burger, Button, Drawer, Group } from "@mantine/core";
import { IconReplace, IconRoad, IconUserCircle, IconLogin2, IconUserPlus, IconLogin } from "@tabler/icons-react";
import classes from '@/styles/Header.module.css';
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "@/providers/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useEffect, useRef, useState } from "react";

interface HeaderDrawerProps {
    active: string;
}


export default function HeaderDrawer({ active }: HeaderDrawerProps) {
    const { user } = useAuth();
    const [opened, { toggle }] = useDisclosure(false);
    const drawerRef = useRef<HTMLDivElement>(null);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchStartY, setTouchStartY] = useState(0);

    const header = () => {
        return (
            <div className={classes.drawerHeaderContainer}>
                <IconUserCircle size={45} stroke={1.5}/>
                <span>{user ? user.displayName : 'Logg inn for å lagre planer over tid'}</span>
            </div>
        )
    }

    const handleLogOut = async () => {
        if(!user) return;

        try {
            await signOut(auth);
            toggle();
            window.location.reload();
        } catch {
            console.error('Failed to log out');
        }
    }

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            setTouchStartX(e.touches[0].clientX);
            setTouchStartY(e.touches[0].clientY);
            console.log('touch start');
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            if (touchStartX - touchEndX > 40) {
                if(touchStartY - touchEndY > Math.abs(30)) return;
                console.log('closing drawer');
                toggle();
            }
        };

        const touchableElement = drawerRef.current;
        if (touchableElement) {
            touchableElement.addEventListener('touchstart', handleTouchStart);
            touchableElement.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (touchableElement) {
                touchableElement.removeEventListener('touchstart', handleTouchStart);
                touchableElement.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [touchStartX, touchStartY, opened, toggle]);

    const logInOut = () => {
        if (user) {
            return (
                <div className={classes.drawerItems}>
                    <a href='/logout'>
                        <Button
                        leftSection={<IconLogin size={20} />}
                        color="transparent"
                        style={{fontWeight: '400'}}
                        onClick={handleLogOut}
                        >
                            Logg ut
                        </Button>
                    </a>
                </div>
            )
        } else {
            return (
                <Group className={classes.drawerItems}>
                    <a href='/login'>
                        <Button
                        leftSection={<IconLogin2 size={20} />}
                        color="transparent"
                        style={{fontWeight: '400'}}
                        >
                            Logg inn
                        </Button>
                    </a>
                    <a href='/register'>
                        <Button
                        leftSection={<IconUserPlus size={20} />}
                        color="transparent"
                        style={{fontWeight: '400'}}
                        >
                            Registrer deg
                        </Button>
                    </a>
                </Group>
            )
        }
    }

    return (
        <>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color='white'/>
            
            <Drawer
            opened={opened}
            onClose={toggle}
            padding="md"
            hiddenFrom="sm"
            ref = {drawerRef}
            title={header()}
            zIndex={1000000}
            classNames={{
            root: classes.drawer,
            body: classes.drawerBody,
            inner: classes.drawerInner,
            content: classes.drawerContent,
            close: classes.drawerClose,
            header: classes.drawerHeader,
            title: classes.drawerTitle,
            overlay: classes.drawerOverlay,
            }}
            >
                <div className={classes.drawerItemsContainer}>
                    <Group className={classes.drawerItems}>
                        <a href='/' style={{fontWeight: '400', color: 'var(--yellow-tdf)'}}>
                            <Button
                            leftSection={<IconReplace size={20} />}
                            color="transparent"
                            data-active={active === '/' || undefined}
                            className={classes.drawerItem}
                            >
                                Planlegger
                            </Button>
                        </a>
                        <a href='/stages'>
                            <Button
                            leftSection={<IconRoad size={20} />}
                            color="transparent"
                            data-active={active === '/stages' || undefined}
                            className={classes.drawerItem}
                            >
                                Etapper
                            </Button>
                        </a>
                    </Group>
                    <div style={{borderBottom: '1px solid var(--highlight-grey)'}}></div>
                    {logInOut()}
                </div>
                <p style={{opacity: '0.3'}}>Tourhjelper</p>
            </Drawer>
        </>
    )
}
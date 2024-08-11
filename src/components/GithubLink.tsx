import { Image } from "@mantine/core";
import classes from '@/styles//GithubLink.module.css';


export function GithubLink() {
    return (
        <div className={classes.container}>
            <a href="https://github.com/Olaelve5" target="_blank" rel="noreferrer">
                <Image src='/GitHub_Lockup_Light.svg' 
                className={classes.image}
                alt="GitHub Logo"
                />
            </a>
        </div>
    );
}
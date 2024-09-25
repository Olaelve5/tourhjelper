// pages/planner.tsx
import React from 'react';
import Layout from '../app/layout'; // Adjust the import path according to your file structure
import { Container } from '@mantine/core';
import { StageProvider } from '@/providers/StageProvider';
import MainPlanner from '@/components/planner/MainPlanner';
import MainStage from '@/components/planner/Stage/MainStage';
import { GithubLink } from '@/components/GithubLink';
import classes from '@/styles/MainPlanner.module.css';

const PlannerPage: React.FC = () => {
    return (
        <Layout>
            <StageProvider>
                <Container size="lg" className={classes.pageContainer}>
                    <MainPlanner />
                    <MainStage />
                    <GithubLink />
                </Container>
            </StageProvider>
        </Layout>
    );
};

export default PlannerPage;
// pages/planner.tsx
import React from 'react';
import Layout from '../app/layout'; // Adjust the import path according to your file structure
import { Container } from '@mantine/core';
import { StageProvider } from '@/providers/StageProvider';
import MainPlanner from '@/components/planner/MainPlanner';
import MainStage from '@/components/planner/Stage/MainStage';
import { GithubLink } from '@/components/GithubLink';

const PlannerPage: React.FC = () => {
    return (
        <Layout>
            <StageProvider>
                <Container size="lg">
                    <div style={{margin: '100px 0'}}>
                        <MainPlanner />
                        <MainStage />
                        <GithubLink />
                    </div>
                </Container>
            </StageProvider>
        </Layout>
    );
};

export default PlannerPage;
// pages/planner.tsx
import React from 'react';
import Layout from '../app/layout'; // Adjust the import path according to your file structure
import { Container } from '@mantine/core';
import { StageRow } from '@/components/stages/StageRow'; // Adjust the import path according to your file structure

const StagesPage: React.FC = () => {
    return (
        <Layout>
            <Container size="lg">
                <div>
                    <StageRow />
                    <StageRow />
                    <StageRow />
                </div>
            </Container>
        </Layout>
    );
};

export default StagesPage;
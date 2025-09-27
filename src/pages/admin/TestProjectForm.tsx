import React from 'react';
import { ProjectFormTemp } from '@/components/admin/projects/ProjectFormTemp';

const TestProjectForm = () => {
  return (
    <div className="min-h-screen bg-background">
      <ProjectFormTemp projectId="test-project-id" />
    </div>
  );
};

export default TestProjectForm;
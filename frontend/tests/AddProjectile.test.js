import React from 'react';
import { render, screen } from '@testing-library/react';
import AddProjectile from './componets/AddProjectile';

descride('AddProjectile popup tests', () => {
    test('renders AddProjectile component', () => {
        render(<AddProjectile />);
    });

});


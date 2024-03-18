import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import HaftingShapeModal from '../src/components/HaftingShapeModal';
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock('axios');

describe('HaftingShapeModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    const props = {
      setEditHaftingShape: vi.fn(),
      selectedHaftingShape: '',
      selectedHaftingShapeID: '',
      updateHaftingShapeList: vi.fn(),
    };

    const { getByLabelText, getByText } = render(<HaftingShapeModal {...props} />);

    expect(getByLabelText('Hafting Shape')).toBeInTheDocument();
    expect(getByText('Save')).toBeInTheDocument();
  });

  it('calls handleSave when save button is clicked', async () => {
    const props = {
      setEditHaftingShape: vi.fn(),
      selectedHaftingShape: '',
      selectedHaftingShapeID: '',
      updateHaftingShapeList: vi.fn(),
    };

    const mockAxiosPost = vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: { id: '1', name: 'Hafting Shape' } });
    
    const { getByText, getByLabelText } = render(<HaftingShapeModal {...props} />);
    
    const shapeInput = getByLabelText('Hafting Shape');
    fireEvent.change(shapeInput, { target: { value: 'Test Hafting Shape' } });

    const saveButton = getByText('Save');
    fireEvent.click(saveButton);
    
    expect(mockAxiosPost).toHaveBeenCalledWith('http://localhost:3000/haftingShapes', { name: 'Test Hafting Shape' });
    await waitFor(() => expect(props.updateHaftingShapeList).toHaveBeenCalled());
    expect(props.setEditHaftingShape).toHaveBeenCalledWith(false);
  });

//   it('closes modal when handleClose is called', () => {
//     const props = {
//       setEditHaftingShape: vi.fn(),
//       selectedHaftingShape: '',
//       selectedHaftingShapeID: '',
//       updateHaftingShapeList: vi.fn(),
//     };

//     const { getByText } = render(<HaftingShapeModal {...props} />);
//     const closeButton = getByText('Close');
//     fireEvent.click(closeButton);
    
//     expect(props.setEditHaftingShape).toHaveBeenCalledWith(false);
//   });

});

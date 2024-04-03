// Import the dependencies
import { AddProjectile } from '../src/components/ProjectileModal'; // Assuming handleSubmit is exported
import axios from 'axios';
import { vi } from "vitest";

// Mock axios
vi.mock('axios');

describe('handleSubmit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should submit data correctly', async () => {
    const handleClose = vi.fn();
    const siteID = '123';
    const name = 'Test Name';
    const location = 'Test Location';
    const description = 'Test Description';
    const dimensions = 'Test Dimensions';
    const photoFilePath = 'test.jpg';
    const artifactTypeID = '1';
    const cultureID = '2';
    const bladeShapeID = '3';
    const baseShapeID = '4';
    const haftingShapeID = '5';
    const crossSectionID = '6';

    // Mock FormData and append
    global.FormData = vi.fn(() => ({
      append: vi.fn(),
    }));

    // Call the function
    await AddProjectile.handleSubmit({
      handleClose,
      siteID,
      name,
      location,
      description,
      dimensions,
      photoFilePath,
      artifactTypeID,
      cultureID,
      bladeShapeID,
      baseShapeID,
      haftingShapeID,
      crossSectionID,
    });

    // Expectations
    expect(global.FormData).toHaveBeenCalledTimes(1);
    expect(FormData.prototype.append).toHaveBeenCalledTimes(13); 
    expect(FormData.prototype.append).toHaveBeenCalledWith('name', `${siteID}-${name}`);

    // Mock axios post
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('/projectile', expect.any(FormData));

    // Simulate success response
    axios.post.mockResolvedValueOnce({ data: 'success' });

    // Await for promises to resolve
    await Promise.resolve();

    expect(console.log).toHaveBeenCalledWith('New projectile point added successfully:', 'success');
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(console.error).not.toHaveBeenCalled();
  });
});

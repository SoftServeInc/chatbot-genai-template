import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableTextfield } from '.';

describe('EditableTextfield component', () => {
  const editableTextfieldProps = {
    className: 'class',
    value: 'test',
    shouldEdit: false,
    onAfterChange: jest.fn(),
  };

  test('renders component in regular mode correctly', () => {
    const { getByText } = render(<EditableTextfield {...editableTextfieldProps} />);
    expect(getByText(editableTextfieldProps.value)).toBeInTheDocument();
  });

  test('renders component in edit mode correctly', () => {
    const props = { ...editableTextfieldProps };
    props.shouldEdit = true;
    const { getByDisplayValue } = render(<EditableTextfield {...props} />);
    expect(getByDisplayValue(props.value)).toBeInTheDocument();
  });

  test('call onAfterChange callback after edit', async () => {
    const newText = 'some nice input';
    const user = userEvent.setup();
    const props = { ...editableTextfieldProps };
    props.shouldEdit = true;
    const { getByDisplayValue } = render(<EditableTextfield {...props} />);
    await user.type(getByDisplayValue(props.value), newText);
    await user.tab(); // blur
    expect(props.onAfterChange).toHaveBeenCalledWith(props.value + newText);
  });
});

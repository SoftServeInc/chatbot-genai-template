import { useState, useEffect, ChangeEvent, KeyboardEventHandler } from 'react';
import { Input } from '../../../lib/shadcn.ui/input';

interface EditableTextfieldProps {
  className?: string;
  value: string;
  shouldEdit?: boolean;
  onAfterChange: (value: string) => void;
}

export function EditableTextfield({
  className,
  value,
  shouldEdit = false,
  onAfterChange,
}: EditableTextfieldProps) {
  const [newValue, setNewValue] = useState<string>('');
  const [editable, setEditable] = useState<boolean>(shouldEdit);

  useEffect(() => {
    setEditable(shouldEdit);
    setNewValue(value);
  }, [value, shouldEdit]);

  const handleModeChange = () => {
    setEditable((prev) => !prev);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const updated = event.target.value;
    setNewValue(updated);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      handleModeChange();
      onAfterChange(newValue.trim());
    }
  };

  const handleBlur = () => {
    handleModeChange();
    onAfterChange(newValue.trim());
  };

  return editable ? (
    <Input
      type="text"
      autoFocus
      value={newValue}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className="bg-transparent rounded-none p-0 h-auto border-blue-600 border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
    />
  ) : (
    <strong className={className}>{newValue}</strong>
  );
}

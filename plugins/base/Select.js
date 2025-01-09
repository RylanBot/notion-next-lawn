import { useState } from 'react';

/**
 * 下拉单选框
 */
const Select = ({
  label = '',
  value = '1',
  options = [
    { value: '1', text: '选项1' },
    { value: '2', text: '选项2' }
  ],
  onChange
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className="py-1 space-x-3">
      <label className="text-gray-500">{label}</label>
      <select value={selectedValue} onChange={handleChange} className="border p-1 rounded cursor-pointer">
        {options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.text}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;

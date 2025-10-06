import React, { useState, useEffect } from 'react';

const DropdownWithLabel = ({ onChange, data, title, clr, suggestion }) => {

  const isMB = () => {
    return window.innerWidth < 768;
  }

  const [selectedValue, setSelectedValue] = useState('');
  // console.log(data);

  const sortedData = data.filter(txt => txt !== '' 
    && !txt.includes('STAIR')
    && !txt.startsWith('L-')
  );
  
  // .sort((a, b) => {
  //   return customSort(a, b);
  // });

  useEffect(() => {
  if (suggestion) {
    const found = sortedData.find(item => item.includes(suggestion));
    setSelectedValue(found || '');
  } else {
    setSelectedValue('');
  }
}, [suggestion, sortedData]);


  return (
    <div style={{ color: clr, width: isMB() ? 350 : 200 }}>
      <label style={{ display: 'block', marginBottom: 6 }}>{title}</label>
      <div style={{ position: 'relative' }}>
        <select
          value={selectedValue}
          onChange={e => {
            // console.log('Onchange');
            setSelectedValue(e.target.value);
            onChange(e.target.value);
          }}
          style={{
            width: '100%',
            padding: '8px 32px 8px 12px',
            backgroundColor: clr,
            color: 'white',
            border: 'none',
            borderRadius: 4,
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            cursor: 'pointer',
          }}
        >
          {sortedData.map((item, index) => (
            <option key={`${item}-${index}`} value={item}>
              {item.toUpperCase()}
            </option>
          ))}
        </select>

        {/* Mũi tên trắng tùy chỉnh */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: 10,
            width: 0,
            height: 0,
            pointerEvents: 'none',
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid white',
            transform: 'translateY(-50%)',
          }}
        />
      </div>
    </div>
  );
};

export default DropdownWithLabel;

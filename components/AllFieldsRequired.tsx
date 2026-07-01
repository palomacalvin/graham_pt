import React from 'react';

interface AllFieldsRequiredProps {
  className?: string;
  style?: React.CSSProperties;
}

const AllFieldsRequired: React.FC<AllFieldsRequiredProps> = ({ className, style }) => {
  const defaultStyle: React.CSSProperties = {
    color: "red",
    fontStyle: "italic"
  };

  return (
    <p 
      className={className} 
      style={{ ...defaultStyle, ...style }} // Allows for passing non-default styles.
    >
      All fields in this section are required. You may choose to
      use the defaults listed below, or override them with values relevant to
      your project.
    </p>
  );
};

export default AllFieldsRequired;
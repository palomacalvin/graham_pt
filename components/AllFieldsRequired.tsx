import React from 'react';

interface AllFieldsRequiredProps {
  className?: string;
  style?: React.CSSProperties;
}

const AllFieldsRequired: React.FC<AllFieldsRequiredProps> = ({ className, style }) => {
  return (
    <div className={`landing-body-text ${className || ""}`} style={style}>
      <div 
        className="form-notice-box" 
        style={{
          borderLeft: "4px solid #d9534f",
          paddingLeft: "1rem",
          margin: "1rem 0",
          backgroundColor: "#fffdfd"
        }}
      >
        <p style={{ fontStyle: "italic", margin: 0 }}>
          <strong>Note:</strong> All fields in this section are required. You may choose to
          use the defaults listed below, or override them with values relevant to
          your project.
        </p>
      </div>
    </div>
  );
};

export default AllFieldsRequired;
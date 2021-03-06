import React, { useState } from 'react';
import ReactMde from 'react-mde';
import PropTypes from 'prop-types';
import * as Showdown from 'showdown';
import { FormElementWrapper } from './formElement';
import 'react-mde/lib/styles/css/react-mde-all.css';

const WysiwygComp = ({ value, onChange, label, showLabel }) => {
  const [tab, setTab] = useState('write');

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

  return (
    <FormElementWrapper label={label} showLabel={showLabel}>
      <span className="container">
        <ReactMde
          onChange={(value) => onChange(value)}
          onTabChange={setTab}
          value={value}
          generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
          selectedTab={tab}
        />
      </span>
    </FormElementWrapper>
  );
};

WysiwygComp.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  showLabel: PropTypes.bool,
  label: PropTypes.string,
};
export default WysiwygComp;

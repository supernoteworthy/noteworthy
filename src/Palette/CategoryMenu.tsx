import React, { Component } from 'react';
import './CategoryMenu.css';

interface CategoryMenuProps {
  options: string[];
  onChange: (newCategory: string) => void;
  currentCategory: string;
}

export default class CategoryMenu extends Component<CategoryMenuProps> {
  render() {
    const { options, onChange, currentCategory } = this.props;
    return (
      <div className="CategoryMenu">
        {options.map(option => (
          <button
            onClick={() => onChange(option)}
            className={currentCategory === option ? 'Selected' : ''}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }
}

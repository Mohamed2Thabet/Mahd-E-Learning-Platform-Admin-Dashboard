import { Dropdown, Form } from 'react-bootstrap';
import { FaSun, FaMoon, FaWater, FaLeaf, FaPalette, FaCheck, FaGem, FaHeart, FaFire, FaTree, FaSquare } from 'react-icons/fa';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const StyledDropdown = styled(Dropdown)`
  .dropdown-toggle {
    border-radius: 8px !important;
    font-weight: 600 !important;
    display: flex !important;
    align-items: center !important;
    gap: 0.5rem !important;
    padding: 0.6rem 1rem !important;
    border: 2px solid var(--primary) !important;
    color: var(--primary) !important;
    background: transparent !important;
    transition: 0.3s ease !important;
    margin-left:auto;
    margin-right:auto;
    &:hover {
      background: var(--primary) !important;
      color: var(--background-dark) !important;
      border-color: var(--primary) !important;
    }

    &:focus {
      box-shadow: 0 0 0 0.2rem var(--primary-glow) !important;
    }

    &::after {
      display: none !important;
    }
  }

  .dropdown-menu {
    background-color: var(--card-background) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: 8px !important;
    padding: 0.5rem !important;
    min-width: 250px !important;
    max-width: 300px !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
    
    /* Make it scrollable */
    max-height: 400px !important;
    overflow-y: auto !important;
    
    /* Custom scrollbar */
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--card-background);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 3px;
      
      &:hover {
        background: var(--primary);
      }
    }
  }

  .dropdown-item {
    display: flex !important;
    align-items: center !important;
    gap: 0.75rem !important;
    border-radius: 6px !important;
    padding: 0.75rem 1rem !important;
    color: var(--text-light) !important;
    transition: 0.2s ease !important;
    margin-bottom: 0.25rem !important;
    white-space: nowrap !important;

    &:hover {
      background-color: var(--primary) !important;
      color: var(--background-dark) !important;
    }

    &.active {
      background-color: var(--primary-glow) !important;
      color: var(--primary) !important;
    }
    
    &:last-child {
      margin-bottom: 0 !important;
    }
  }
`;

const StyledSelect = styled(Form.Select)`
  background-color: var(--background-dark) !important;
  border: 1px solid var(--border-color) !important;
  color: var(--text-light) !important;
  border-radius: 8px !important;
  padding: 0.6rem 1rem !important;
  font-weight: 500 !important;
  max-height: 200px !important;
  overflow-y: auto !important;

  &:focus {
    background-color: var(--background-dark) !important;
    border-color: var(--primary) !important;
    box-shadow: 0 0 0 0.2rem var(--primary-glow) !important;
    color: var(--text-light) !important;
  }

  option {
    background-color: var(--background-dark) !important;
    color: var(--text-light) !important;
    padding: 0.5rem !important;
  }
`;

const ThemeIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CheckIcon = styled(FaCheck)`
  color: var(--primary);
  margin-left: auto;
  flex-shrink: 0;
`;

const ThemeInfo = styled.div`
  flex: 1;
  min-width: 0;
  
  .theme-name {
    font-weight: 600;
    margin-bottom: 2px;
  }
  
  .theme-description {
    color: var(--text-secondary);
    font-size: 0.75rem;
    line-height: 1.2;
  }
`;

const ScrollHint = styled.div`
  text-align: center;
  padding: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.7rem;
  border-top: 1px solid var(--border-color);
  margin-top: 0.5rem;
  position: sticky;
  bottom: 0;
  background: var(--card-background);
`;

const ThemeToggle = ({ variant = 'dropdown' }) => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: 'light', name: 'Light', icon: <FaSun />, description: 'Bright and clean' },
    { key: 'dark', name: 'Dark', icon: <FaMoon />, description: 'Easy on the eyes' },
    { key: 'blue', name: 'Blue', icon: <FaWater />, description: 'Cool and professional' },
    { key: 'sepia', name: 'Sepia', icon: <FaLeaf />, description: 'Warm and natural' },
    { key: 'purple', name: 'Purple', icon: <FaGem />, description: 'Creative & modern' },
    { key: 'teal', name: 'Teal', icon: <FaWater />, description: 'Soft and calm' },
    { key: 'pink', name: 'Pink', icon: <FaHeart />, description: 'Feminine and fresh' },
    { key: 'orange', name: 'Orange', icon: <FaFire />, description: 'Energetic and warm' },
    { key: 'green', name: 'Green', icon: <FaTree />, description: 'Natural and clean' },
    { key: 'gray', name: 'Gray', icon: <FaSquare />, description: 'Minimal and neutral' }
  ];

  const currentTheme = themes.find(t => t.key === theme) || themes[1];

  if (variant === 'select') {
    return (
      <StyledSelect
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        size="sm"
      >
        {themes.map((t) => (
          <option key={t.key} value={t.key}>
            {t.name} - {t.description}
          </option>
        ))}
      </StyledSelect>
    );
  }

  return (
    <StyledDropdown>
      <Dropdown.Toggle id="theme-dropdown">
        <ThemeIcon>{currentTheme.icon}</ThemeIcon>
        {currentTheme.name}
        <FaPalette style={{ marginLeft: '0.25rem', opacity: 0.7 }} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {themes.map((t) => (
          <Dropdown.Item
            key={t.key}
            onClick={() => setTheme(t.key)}
            className={theme === t.key ? 'active' : ''}
          >
            <ThemeIcon>{t.icon}</ThemeIcon>
            <ThemeInfo>
              <div className="theme-name">{t.name}</div>
              <div className="theme-description">{t.description}</div>
            </ThemeInfo>
            {theme === t.key && <CheckIcon size={14} />}
          </Dropdown.Item>
        ))}
        <ScrollHint>
          <FaPalette size={12} /> Scroll for more themes
        </ScrollHint>
      </Dropdown.Menu>
    </StyledDropdown>
  );
};

export default ThemeToggle;

import React, { useEffect, useState } from 'react';
import BackButton from './components/BackButton';
import Button from './components/Button';
import Input from './components/Input';
import { validateRequired } from '../utils/validators';

// LockerItem component to display individual lockers or the "Add New Locker" button
const LockerItem = ({ item, onSelect, onDelete }) => {
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

  if (item.isAdd) {
    return (
      <li
        style={{
          width: '100%',
          margin: '10px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          type="primary"
          onClick={() => onSelect(item)}
          width="100%"
          height="100px"
          fontSize="2rem"
          style={{ fontWeight: 'bold' }}
        >
          + Add New Locker
        </Button>
      </li>
    );
  }

  return (
    <li
      style={{
        position: 'relative',
        width: '100%',
        height: 'var(--global-input-height)',
        margin: '10px 0',
        backgroundColor: 'var(--elevation-1)',
        border: '1px solid var(--elevation-3)',
        borderRadius: 'var(--global-border-radius)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        onClick={() => onSelect(item)}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            width: 'var(--global-input-height)',
            height: 'var(--global-input-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            style={{
              width: '50%',
              height: '50%',
              fill: 'var(--elevation-2)',
            }}
          >
            <path d="M19.683 9.515a.999.999 0 0 0-.709-.633c-.132-.031-3.268-.769-6.974-.769-1.278 0-2.49.088-3.535.205a8.6 8.6 0 0 1-.037-.813C8.428 4.524 9.577 4 11.993 4s3.065.667 3.379 1.821a1.5 1.5 0 0 0 2.895-.785C17.174 1 13.275 1 11.994 1 7.638 1 5.429 3.188 5.429 7.505c0 .453.023.876.068 1.274-.277.057-.442.095-.47.102a1 1 0 0 0-.71.636c-.038.107-.936 2.655-.936 6.039 0 3.413.898 5.937.937 6.042a.999.999 0 0 0 .709.633c.132.032 3.268.769 6.974.769s6.842-.737 6.974-.768a1 1 0 0 0 .71-.637c.038-.106.936-2.655.936-6.039 0-3.413-.898-5.936-.937-6.042ZM13 16.299a1 1 0 1 1-2 0v-1.485a1 1 0 1 1 2 0v1.485Z" />
          </svg>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '28px',
            gap: '12px',
          }}
        >
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '2rem',
              textAlign: 'left',
              color: 'var(--color-muted-dark)',
              lineHeight: '1.2',
            }}
          >
            Locker {item.number}
          </span>
          <span
            style={{
              fontSize: '1.625rem',
              textAlign: 'left',
              color: 'var(--color-muted-dark)',
              lineHeight: '1.2',
            }}
          >
            {item.location}
          </span>
        </div>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        onMouseEnter={() => setIsDeleteHovered(true)}
        onMouseLeave={() => setIsDeleteHovered(false)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          backgroundColor: isDeleteHovered ? '#6e6e6e' : 'var(--color-muted-dark)',
          color: 'var(--color-muted-light)',
          fontSize: '1rem',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s',
          padding: '0',
        }}
        aria-label={`Delete Locker ${item.number}`}
      >
        X
      </button>
    </li>
  );
};

// Main AddLocker component
function AddLocker() {
  // Initial locker data (specific to this component)
  const [lockers, setLockers] = useState([
    { id: 1, number: '1', location: 'R101' },
    { id: 2, number: '2', location: 'R101' },
    { id: 3, number: '3', location: 'R102' },
    { id: 4, number: '4', location: 'R102' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ number: '', location: '' });
  const [errors, setErrors] = useState({ number: '', location: '' });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Combine "Add New Locker" button with locker list
  const listItems = [
    { id: 'add', name: 'Add Locker', isAdd: true },
    ...lockers.map((locker) => ({ ...locker, isAdd: false })),
  ];

  // Handle selection (show form for adding new locker)
  const handleSelect = (item) => {
    if (item.isAdd) {
      setShowForm(true);
    } else {
      console.log(`Selected locker: ${item.number}`);
      // Future enhancement: Add edit functionality here if needed
    }
  };

  // Handle deletion of a locker
  const handleDelete = (id) => {
    setLockers((prevLockers) => prevLockers.filter((locker) => locker.id !== id));
    console.log(`Deleted locker with id: ${id}`);
  };

  // Handle form input changes
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {
      number: validateRequired(formData.number, 'Locker Number').error,
      location: validateRequired(formData.location, 'Location').error,
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;
    const newLocker = {
      id: lockers.length + 1, // Simple ID generation; adjust as needed
      ...formData,
    };
    setLockers((prev) => [...prev, newLocker]);
    setFormData({ number: '', location: '' });
    setShowForm(false);
  };

  // Handle form cancellation
  const handleCancel = () => {
    setFormData({ number: '', location: '' });
    setShowForm(false);
  };

  // Inline styles for action buttons
  const styles = `
    .action-button {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
  `;

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <style>{styles}</style>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: '20px',
            gap: '16px',
          }}
        >
          <BackButton onClick={showForm ? handleCancel : () => window.history.back()} />
          <h2 style={{ margin: 0 }}>Add Locker</h2>
        </div>
        {showForm ? (
          <div style={{ width: '100%' }}>
            <p style={{ marginBottom: '10px' }}>
              Please fill up the form below to add a new locker.
            </p>
            <Input
              placeholder="Locker Number"
              value={formData.number}
              onChange={handleChange('number')}
              emailError={errors.number}
            />
            {errors.number && (
              <p className="error-message" aria-live="polite">{errors.number}</p>
            )}
            <Input
              placeholder="Location"
              value={formData.location}
              onChange={handleChange('location')}
              emailError={errors.location}
            />
            {errors.location && (
              <p className="error-message" aria-live="polite">{errors.location}</p>
            )}
            <div className="action-button">
              <Button type="secondary" onClick={handleCancel}>
                CANCEL
              </Button>
              <Button type="primary" onClick={handleSubmit}>
                SUBMIT
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            <ul
              style={{
                listStyle: 'none',
                padding: '0',
                margin: '0',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              {listItems.map((item) => (
                <LockerItem
                  key={item.id}
                  item={item}
                  onSelect={handleSelect}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddLocker;
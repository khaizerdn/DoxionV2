import React, { useState, useEffect } from 'react';
import BackButton from '../pages/components/BackButton';

const SelectLocker = ({ onSelect, onBack }) => {
  // Mock locker list with assigned person data, without location
  const lockers = [
    { 
      id: 'L001', 
      number: 'L001', 
      status: 'Available', 
      assignedTo: { name: 'John Doe', email: 'john.doe@example.com', title: 'Developer' },
      image: 'https://www.qu.edu/4aabf2/globalassets/global/media/qu/photography/1_today/z-_-archive-photos-pre-2024/mohammad-elahee-headshot-580x417-2023.jpg'
    },
    { 
      id: 'L002', 
      number: 'L002', 
      status: 'Available', 
      assignedTo: { name: 'Jane Smith', email: 'jane.smith@example.com', title: 'Designer' },
      image: 'https://headshots-inc.com/wp-content/uploads/2023/02/Professional-Headshot-Photography-Example-1.jpg'
    },
    { 
      id: 'L003', 
      number: 'L003', 
      status: 'Occupied', 
      assignedTo: null,
      image: null
    }
  ];

  // Reset scroll to top on mount
  useEffect(() => {
    console.log('SelectLocker mounted, resetting scroll to top');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSelect = (locker) => {
    const updateData = {};
    updateData.lockerNumber = locker.number; // Always set lockerNumber
    if (locker.assignedTo) {
      updateData.recipientEmail = locker.assignedTo.email;
    } // Only set recipientEmail if assigned
    onSelect(updateData);
  };

  const LockerItem = ({ locker }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <li
        onClick={() => handleSelect(locker)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '100%',
          height: 'var(--global-input-height)',
          margin: '10px 0',
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'var(--elevation-1)',
          border: '1px solid var(--elevation-3)',
          borderRadius: 'var(--global-border-radius)',
          cursor: 'pointer',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        {locker.image ? (
          <img 
            src={locker.image} 
            alt={`Locker ${locker.number}`}
            style={{
              width: 'var(--global-input-height)',
              height: 'var(--global-input-height)',
              borderRadius: 'var(--global-border-radius)',
              padding: '10px',
              objectFit: 'cover',
              transition: 'filter 0.3s ease',
              filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
            }}
          />
        ) : (
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
              <path d="M19.683 9.515a.999.999 0 0 0-.709-.633c-.132-.031-3.268-.769-6.974-.769-1.278 0-2.49.088-3.535.205a8.6 8.6 0 0 1-.037-.813C8.428 4.524 9.577 4 11.993 4s3.065.667 3.379 1.821a1.5 1.5 0 0 0 2.895-.785C17.174 1 13.275 1 11.994 1 7.638 1 5.429 3.188 5.429 7.505c0 .453.023.876.068 1.274-.277.057-.442.095-.47.102a1 1 0 0 0-.71.636c-.038.107-.936 2.655-.936 6.039 0 3.413.898 5.937.937 6.042a.999.999 0 0 0 .709.633c-.132.032 3.268.769 6.974.769s6.842-.737 6.974-.768a1 1 0 0 0 .71-.637c.038-.106.936-2.655.936-6.039 0-3.413-.898-5.936-.937-6.042ZM13 16.299a1 1 0 1 1-2 0v-1.485a1 1 0 1 1 2 0v1.485Z" />
            </svg>
          </div>
        )}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '28px',
          gap: '12px'
        }}>
          <span style={{ 
            fontWeight: 'bold', 
            fontSize: '2rem',
            textAlign: 'left',
            color: 'var(--color-muted-dark)',
            lineHeight: '1.2'
          }}>
            Locker {locker.number}
          </span>
          <span style={{ 
            fontSize: '1.625rem',
            textAlign: 'left',
            color: 'var(--color-muted-dark)',
            lineHeight: '1.2'
          }}>
            {locker.assignedTo ? locker.assignedTo.name : 'Unassigned'}
          </span>
          <span style={{ 
            fontSize: '1.375rem',
            textAlign: 'left',
            color: 'rgba(var(--color-muted-dark-rgb), 0.8)',
            lineHeight: '1.2'
          }}>
            {locker.assignedTo ? locker.assignedTo.title : 'No profession'}
          </span>
        </div>
      </li>
    );
  };

  return (
    <div className="select-locker" style={{ width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        marginBottom: '20px',
        gap: '16px'
      }}>
        <BackButton onClick={onBack} />
        <h2 style={{ margin: 0 }}>Select Locker</h2>
      </div>
      <div style={{
        width: '100%',
        maxWidth: '800px',
      }}>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}>
          {lockers.map(locker => (
            <LockerItem key={locker.id} locker={locker} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectLocker;
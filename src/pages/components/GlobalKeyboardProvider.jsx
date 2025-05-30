import React, { useState, useEffect, useRef } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const GlobalKeyboardProvider = () => {
  const [inputElement, setInputElement] = useState(null);
  const [layout, setLayout] = useState('default');
  const keyboardRef = useRef(null);
  const wrapperRef = useRef(null);

  const insertTextAtCursor = (input, text) => {
    if (input.tagName === 'TEXTAREA') {
      input.focus();
      document.execCommand('insertText', false, text);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      input.focus();
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue = input.value.slice(0, start) + text + input.value.slice(end);
  
      // Update value
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(input, newValue);
  
      // Set cursor and scroll to keep it visible
      const newCaretPos = start + text.length;
      requestAnimationFrame(() => {
        input.setSelectionRange(newCaretPos, newCaretPos);
        // Scroll to cursor position
        if (input.scrollWidth > input.clientWidth) {
          const charWidth = input.scrollWidth / input.value.length;
          const scrollOffset = newCaretPos * charWidth - input.clientWidth + charWidth;
          input.scrollLeft = Math.max(0, scrollOffset);
        }
      });
  
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  const deleteTextAtCursor = (input) => {
    if (input.tagName === 'TEXTAREA') {
      input.focus();
      document.execCommand('delete', false);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      if (start === 0 && end === 0) return;
      let newStart = start;
      let newValue;
      if (start === end) {
        newValue = input.value.slice(0, start - 1) + input.value.slice(end);
        newStart = start - 1;
      } else {
        newValue = input.value.slice(0, start) + input.value.slice(end);
      }
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(input, newValue);
      input.setSelectionRange(newStart, newStart);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  const focusNextInput = (currentInput) => {
    // Get all focusable input and textarea elements in the DOM
    const focusableElements = Array.from(
      document.querySelectorAll('input, textarea')
    ).filter((el) => !el.disabled && !el.readOnly);

    // Find the index of the current input
    const currentIndex = focusableElements.indexOf(currentInput);

    // Move to the next input, if it exists
    if (currentIndex !== -1 && currentIndex < focusableElements.length - 1) {
      const nextInput = focusableElements[currentIndex + 1];
      nextInput.focus();
      setInputElement(nextInput);

      // Calculate scroll position to keep input at top (40% screen visible)
      const keyboardHeight = wrapperRef.current ? wrapperRef.current.offsetHeight : 280;
      const viewportHeight = window.innerHeight;
      const visibleHeight = viewportHeight - keyboardHeight;
      const targetScrollY = nextInput.getBoundingClientRect().top + window.scrollY - (0.4 * visibleHeight);

      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });

      // Ensure horizontal scroll for latest character
      nextInput.scrollLeft = nextInput.scrollWidth;
      return true;
    }
    return false;
  };

  const onKeyPress = (button) => {
    if (!inputElement) return;

    switch (button) {
      case '{shift}':
      case '{lock}':
        setLayout((prev) => (prev === 'default' ? 'shift' : 'default'));
        break;
      case '{bksp}':
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
        deleteTextAtCursor(inputElement);
        break;
      case '{space}':
        insertTextAtCursor(inputElement, ' ');
        break;
      case '{numbers}':
        setLayout('numbers');
        break;
      case '{abc}':
        setLayout('default');
        break;
      case '{done}':
        // Try to focus the next input; if none, hide keyboard
        if (!focusNextInput(inputElement)) {
          setInputElement(null);
        }
        break;
      default:
        insertTextAtCursor(inputElement, button);
        break;
    }
  };

  useEffect(() => {
    const handleFocusIn = (e) => {
      const el = e.target;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        setInputElement(el);
        setLayout('default');
        // Scroll to keep input visible when focused
        const keyboardHeight = wrapperRef.current ? wrapperRef.current.offsetHeight : 280;
        const viewportHeight = window.innerHeight;
        const visibleHeight = viewportHeight - keyboardHeight;
        const targetScrollY = el.getBoundingClientRect().top + window.scrollY - (0.4 * visibleHeight);

        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth',
        });
        el.scrollLeft = el.scrollWidth;
      }
    };

    let touchStartTime = 0;
    let touchMoved = false;

    const handleTouchStart = () => {
      touchStartTime = Date.now();
      touchMoved = false;
    };

    const handleTouchMove = () => {
      touchMoved = true;
    };

    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target) &&
        e.target.tagName !== 'INPUT' &&
        e.target.tagName !== 'TEXTAREA'
      ) {
        if (e.type === 'touchstart') {
          const touchDuration = Date.now() - touchStartTime;
          if (touchDuration < 200 && !touchMoved) {
            setInputElement(null);
          }
        } else if (e.type === 'mousedown') {
          setInputElement(null);
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleClickOutside);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, []);

  // Add class to body when keyboard is visible
  useEffect(() => {
    if (inputElement) {
      document.body.classList.add('keyboard-visible');
    } else {
      document.body.classList.remove('keyboard-visible');
    }
  }, [inputElement]);

  if (!inputElement) return null;

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: '#f8f8f8',
        zIndex: 9999,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        touchAction: 'none',
        minHeight: '280px',
      }}
      onPointerDown={(e) => e.preventDefault()}
    >
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layoutName={layout}
        onKeyPress={onKeyPress}
        layout={{
          default: [
            '1 2 3 4 5 6 7 8 9 0',
            'q w e r t y u i o p',
            'a s d f g h j k l',
            '{shift} z x c v b n m {bksp}',
            '{numbers} {space} . {done}',
          ],
          shift: [
            '1 2 3 4 5 6 7 8 9 0',
            'Q W E R T Y U I O P',
            'A S D F G H J K L',
            '{shift} Z X C V B N M {bksp}',
            '{numbers} {space} . {done}',
          ],
          numbers: [
            '1 2 3 4 5 6 7 8 9 0',
            '- / : ; ( ) ₱ & @',
            '. , ? ! \' " # % + = {bksp}',
            '{abc} {space} . {done}',
          ],
        }}
        display={{
          '{bksp}': '⌫',
          '{space}': '␣',
          '{shift}': '⇧',
          '{numbers}': '123',
          '{abc}': 'ABC',
          '{done}': 'Done',
        }}
        theme="hg-theme-default hg-layout-default"
        physicalKeyboardHighlight={true}
      />
    </div>
  );
};

export default GlobalKeyboardProvider;
import { useState, forwardRef } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

// password input with show/hide eye toggle
const PwInput = forwardRef(function PwInput(props, ref) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input ref={ref} {...props} type={shown ? 'text' : 'password'} className="sk-input pr-10" />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-100"
        tabIndex={-1}
        aria-label={shown ? 'Hide password' : 'Show password'}
      >
        {shown ? <FiEyeOff size={16} /> : <FiEye size={16} />}
      </button>
    </div>
  );
});

export default PwInput;

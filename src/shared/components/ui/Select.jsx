import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Check, ChevronDown } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { FormField } from './FormField';
import {
  fieldClasses,
  fieldIds,
  hasContent,
  isFieldInvalid,
  joinIds,
  resolveFieldError,
} from './internal/fieldStyles';
import { OverlayPortal } from './internal/OverlayPortal';
import {
  mergeRefs,
  useClickOutside,
  useEscapeKey,
  useOverlayStack,
} from './internal/overlayHooks';

/** Options may be `{ value, label, disabled }` objects or plain strings/numbers. */
function normalizeOption(option) {
  if (option !== null && typeof option === 'object') return option;
  return { value: option, label: String(option) };
}

/** Parses either array options or option element children into standardized option objects. */
function parseOptions(options, children) {
  if (Array.isArray(options)) {
    return options.map((raw) => {
      const opt = normalizeOption(raw);
      return {
        value: opt.value ?? '',
        label: opt.label ?? String(opt.value ?? ''),
        disabled: Boolean(opt.disabled),
      };
    });
  }
  if (children) {
    const parsed = [];
    Children.forEach(children, (child) => {
      if (!child) return;
      if (child.type === 'option') {
        parsed.push({
          value: child.props.value ?? '',
          label: child.props.children ?? String(child.props.value ?? ''),
          disabled: Boolean(child.props.disabled),
        });
      }
    });
    return parsed;
  }
  return [];
}

/**
 * Select — Custom-themed, accessible dropdown that seamlessly matches project dark & light themes.
 * Retains an underlying native <select> for seamless form handling, react-hook-form integration,
 * and test runner compatibility (e.g. user.selectOptions).
 */
export const Select = forwardRef(function Select(
  {
    label,
    hint,
    error,
    required = false,
    options,
    placeholder,
    size = 'md',
    id: idProp,
    className,
    selectClassName,
    children,
    'aria-describedby': ariaDescribedBy,
    value: valueProp,
    defaultValue,
    onChange,
    disabled = false,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const id = idProp || autoId;
  const sizeKey = size === 'sm' ? 'sm' : 'md';
  const { hintId, errorId } = fieldIds(id);
  const errorMessage = resolveFieldError(error);
  const invalid = isFieldInvalid(error);
  const showHint = errorMessage === null && hasContent(hint);
  const hasPlaceholder = hasContent(placeholder);

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: -9999, left: -9999, width: 160 });
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const nativeSelectRef = useRef(null);
  const isTop = useOverlayStack(open);

  const normalizedOptions = parseOptions(options, children);

  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() => {
    if (defaultValue !== undefined) return defaultValue;
    if (hasPlaceholder) return '';
    return normalizedOptions[0]?.value ?? '';
  });

  // Sync with native select value when uncontrolled (e.g. react-hook-form sets initial/reset value)
  useEffect(() => {
    if (!isControlled && nativeSelectRef.current) {
      const domValue = nativeSelectRef.current.value;
      if (domValue !== uncontrolledValue) {
        setUncontrolledValue(domValue);
      }
    }
  }, [isControlled, uncontrolledValue]);

  const selectedValue = isControlled ? valueProp : uncontrolledValue;

  const currentOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(selectedValue),
  );

  let displayText = '';
  if (currentOption) {
    displayText = currentOption.label;
  } else if (hasPlaceholder && (selectedValue === '' || selectedValue === undefined)) {
    displayText = placeholder;
  } else if (selectedValue !== undefined && selectedValue !== '') {
    displayText = String(selectedValue);
  } else if (hasPlaceholder) {
    displayText = placeholder;
  } else if (normalizedOptions.length > 0) {
    displayText = normalizedOptions[0].label;
  }

  const updatePosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const menuEl = menuRef.current;
    const menuWidth = Math.max(triggerEl.offsetWidth, 160);
    const menuHeight = menuEl?.offsetHeight || 0;
    const gap = 4;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = rect.left;
    if (left + menuWidth > viewportWidth - 8) {
      left = Math.max(8, viewportWidth - menuWidth - 8);
    }

    let top = rect.bottom + gap;
    if (menuHeight && top + menuHeight > viewportHeight - 8 && rect.top - gap - menuHeight > 8) {
      top = rect.top - gap - menuHeight;
    }
    setPosition({ top, left, width: Math.max(triggerEl.offsetWidth, 160) });
  }, []);

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(updatePosition, 0);
    const handleViewportChange = (event) => {
      if (event?.target && menuRef.current?.contains(event.target)) return;
      updatePosition();
    };
    window.addEventListener('scroll', handleViewportChange, true);
    window.addEventListener('resize', handleViewportChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleViewportChange, true);
      window.removeEventListener('resize', handleViewportChange);
    };
  }, [open, updatePosition]);

  useClickOutside([triggerRef, menuRef], () => setOpen(false), open);
  useEscapeKey(
    () => {
      setOpen(false);
      triggerRef.current?.focus?.();
    },
    open,
    isTop,
  );

  useEffect(() => {
    if (open) {
      const idx = normalizedOptions.findIndex(
        (opt) => String(opt.value) === String(selectedValue),
      );
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [open, selectedValue, normalizedOptions]);

  const handleSelectOption = (optionValue) => {
    if (!isControlled) {
      setUncontrolledValue(optionValue);
    }
    setOpen(false);
    triggerRef.current?.focus?.();

    if (nativeSelectRef.current) {
      nativeSelectRef.current.value = optionValue;
      nativeSelectRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (onChange) {
      const syntheticEvent = {
        target: { name: rest.name, value: optionValue, id },
        currentTarget: { name: rest.name, value: optionValue, id },
        preventDefault: () => {},
        stopPropagation: () => {},
      };
      onChange(syntheticEvent);
    }
  };

  const handleNativeChange = (event) => {
    const newVal = event.target.value;
    if (!isControlled) {
      setUncontrolledValue(newVal);
    }
    onChange?.(event);
  };

  const handleKeyDown = (event) => {
    if (disabled) return;

    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % normalizedOptions.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev <= 0 ? normalizedOptions.length - 1 : prev - 1,
        );
        break;
      case 'Home':
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setHighlightedIndex(normalizedOptions.length - 1);
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const highlighted = normalizedOptions[highlightedIndex];
        if (highlighted && !highlighted.disabled) {
          handleSelectOption(highlighted.value);
        }
        break;
      }
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <FormField
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <div className="relative">
        {/* Hidden accessible native select preserved for form submissions, react-hook-form & test runners */}
        <select
          ref={mergeRefs(ref, nativeSelectRef)}
          id={id}
          name={rest.name}
          {...(isControlled ? { value: valueProp ?? '' } : defaultValue !== undefined ? { defaultValue } : {})}
          onChange={handleNativeChange}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-describedby={joinIds(
            ariaDescribedBy,
            errorMessage !== null ? errorId : null,
            showHint ? hintId : null,
          )}
          tabIndex={-1}
          className="sr-only"
          {...rest}
        >
          {hasPlaceholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {normalizedOptions.map((opt, i) => (
            <option
              key={`${String(opt.value)}-${i}`}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom Themed Trigger Button */}
        <button
          ref={triggerRef}
          type="button"
          id={`${id}-trigger`}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? `${id}-listbox` : undefined}
          disabled={disabled}
          onClick={() => {
            if (!disabled) setOpen((prev) => !prev);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            fieldClasses({ error: invalid, size: sizeKey, hasRightElement: true }),
            'relative flex items-center justify-between text-left cursor-pointer transition-all select-none',
            open &&
              'border-brand-500 ring-4 ring-brand-500/15 dark:border-brand-500 dark:ring-brand-500/20',
            disabled && 'cursor-not-allowed opacity-60',
            selectClassName,
          )}
        >
          <span
            className={cn(
              'truncate block pr-4',
              !currentOption && hasPlaceholder && 'text-slate-400 dark:text-slate-500',
              currentOption && 'text-slate-900 dark:text-slate-100 font-medium',
            )}
          >
            {displayText}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform duration-200 dark:text-slate-400',
              sizeKey === 'sm' ? 'right-2.5' : 'right-3',
              open && 'rotate-180 text-brand-600 dark:text-brand-400',
            )}
          />
        </button>

        {/* Custom Themed Floating Dropdown Menu */}
        {open && (
          <OverlayPortal>
            <div
              ref={menuRef}
              id={`${id}-listbox`}
              role="listbox"
              aria-label={rest['aria-label']}
              onKeyDown={handleKeyDown}
              style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                width: position.width,
                zIndex: 70,
              }}
              className="max-h-60 overflow-y-auto scrollbar-thin animate-scale-in rounded-xl border border-slate-200 bg-white p-1 shadow-elevated focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {normalizedOptions.map((opt, index) => {
                const isSelected = String(opt.value) === String(selectedValue);
                const isHighlighted = highlightedIndex === index;
                return (
                  <div
                    key={`${String(opt.value)}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled || undefined}
                    onClick={() => {
                      if (opt.disabled) return;
                      handleSelectOption(opt.value);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer select-none',
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed'
                        : isSelected
                          ? 'bg-brand-50 font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                          : isHighlighted
                            ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white',
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </OverlayPortal>
        )}
      </div>
    </FormField>
  );
});

export default Select;

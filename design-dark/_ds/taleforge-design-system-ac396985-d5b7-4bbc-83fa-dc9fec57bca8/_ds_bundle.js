/* @ds-bundle: {"format":4,"namespace":"TaleforgeDesignSystem_ac3969","components":[{"name":"Card","sourcePath":"components/cards/Card.jsx"},{"name":"QueryChip","sourcePath":"components/cards/QueryChip.jsx"},{"name":"ResultCard","sourcePath":"components/cards/ResultCard.jsx"},{"name":"ScoreBreakdown","sourcePath":"components/cards/ScoreBreakdown.jsx"},{"name":"SideGroup","sourcePath":"components/cards/SideGroup.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Banner","sourcePath":"components/feedback/Banner.jsx"},{"name":"EvidenceTag","sourcePath":"components/feedback/EvidenceTag.jsx"},{"name":"LoadingSteps","sourcePath":"components/feedback/LoadingSteps.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"MixSlider","sourcePath":"components/forms/MixSlider.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"ThemeToggle","sourcePath":"components/navigation/ThemeToggle.jsx"}],"sourceHashes":{"components/cards/Card.jsx":"5a67c763cb31","components/cards/QueryChip.jsx":"7dea6b9fe107","components/cards/ResultCard.jsx":"298b48730a4c","components/cards/ScoreBreakdown.jsx":"5ec80f646f03","components/cards/SideGroup.jsx":"4fffe34db701","components/feedback/Badge.jsx":"90aa48d48198","components/feedback/Banner.jsx":"a40641250e98","components/feedback/EvidenceTag.jsx":"1f30b1c6f23b","components/feedback/LoadingSteps.jsx":"069b529702f9","components/feedback/Tooltip.jsx":"922438fd4ed3","components/forms/Button.jsx":"6aa8c8a07cc0","components/forms/Checkbox.jsx":"96575d5112bf","components/forms/IconButton.jsx":"075247d99e8a","components/forms/Input.jsx":"9e4f6b2461cd","components/forms/MixSlider.jsx":"8abb74a6e196","components/forms/Select.jsx":"2ba33607f42e","components/forms/Switch.jsx":"cd4b06443b95","components/navigation/Tabs.jsx":"d20ccce3cd05","components/navigation/ThemeToggle.jsx":"5ce0656b13f0","ui_kits/taleforge/App.jsx":"d500ab1b31c0","ui_kits/taleforge/BottomSheet.jsx":"a3fa17c83f93","ui_kits/taleforge/Header.jsx":"963e257d84dc","ui_kits/taleforge/Home.jsx":"02ff675356df","ui_kits/taleforge/Results.jsx":"289f48153d3a","ui_kits/taleforge/States.jsx":"fc4e6525808d","ui_kits/taleforge/sampleData.js":"d7959cf8877f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TaleforgeDesignSystem_ac3969 = window.TaleforgeDesignSystem_ac3969 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/cards/Card.jsx
try { (() => {
function Card({
  children,
  padding = 'var(--space-20)',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding,
      boxShadow: 'var(--shadow-card)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/Card.jsx", error: String((e && e.message) || e) }); }

// components/cards/QueryChip.jsx
try { (() => {
function QueryChip({
  label,
  onRemove
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 8px 6px 14px',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)'
    }
  }, label, onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onRemove,
    "aria-label": `Remove ${label}`,
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      border: 'none',
      background: 'var(--n-4)',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      lineHeight: 1
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { QueryChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/QueryChip.jsx", error: String((e && e.message) || e) }); }

// components/cards/ScoreBreakdown.jsx
try { (() => {
function ScoreBreakdown({
  story,
  synergy,
  similarity
}) {
  const rows = [['Story', story, 'var(--side-violet)'], ['Synergy', synergy, 'var(--side-teal)'], ['Similarity', similarity, 'var(--side-slate)']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      minWidth: 180
    }
  }, rows.map(([label, val, color]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      width: 68,
      flex: 'none'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 5,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--n-5)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: '100%',
      width: `${Math.round(val * 100)}%`,
      background: color
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-secondary)',
      width: 28,
      textAlign: 'right'
    }
  }, Math.round(val * 100)))));
}
Object.assign(__ds_scope, { ScoreBreakdown });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ScoreBreakdown.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
const tones = {
  neutral: {
    background: 'var(--n-4)',
    color: 'var(--text-secondary)'
  },
  accent: {
    background: 'var(--accent-soft)',
    color: 'var(--accent-9)'
  },
  success: {
    background: 'color-mix(in oklch, var(--success-9) 18%, transparent)',
    color: 'var(--success-9)'
  },
  warning: {
    background: 'color-mix(in oklch, var(--warning-9) 18%, transparent)',
    color: 'var(--warning-9)'
  },
  danger: {
    background: 'color-mix(in oklch, var(--danger-9) 18%, transparent)',
    color: 'var(--danger-9)'
  }
};
function Badge({
  children,
  tone = 'neutral'
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      ...tones[tone]
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Banner.jsx
try { (() => {
const tones = {
  info: {
    border: 'var(--border-subtle)',
    icon: 'ⓘ',
    color: 'var(--info-9)'
  },
  warning: {
    border: 'var(--warning-9)',
    icon: '!',
    color: 'var(--warning-9)'
  },
  danger: {
    border: 'var(--danger-9)',
    icon: '!',
    color: 'var(--danger-9)'
  }
};
function Banner({
  tone = 'info',
  title,
  children,
  action
}) {
  const t = tones[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      background: 'var(--surface-card)',
      border: '1px solid ' + t.border,
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-16) var(--space-20)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.color,
      fontFamily: 'var(--font-mono)',
      fontSize: 14,
      lineHeight: 1,
      flex: 'none',
      marginTop: 2
    }
  }, t.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      fontSize: 'var(--text-md)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-normal)'
    }
  }, children)), action);
}
Object.assign(__ds_scope, { Banner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Banner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EvidenceTag.jsx
try { (() => {
const kinds = {
  'name match': 'var(--side-amber)',
  'story link': 'var(--side-violet)',
  'deck synergy': 'var(--side-teal)',
  'similarity': 'var(--side-slate)'
};
function EvidenceTag({
  kind
}) {
  const color = kinds[kind.toLowerCase()] || 'var(--text-muted)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-pill)',
      padding: '4px 10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: color,
      flex: 'none'
    }
  }), kind);
}
Object.assign(__ds_scope, { EvidenceTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EvidenceTag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/LoadingSteps.jsx
try { (() => {
function LoadingSteps({
  steps,
  activeIndex
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-12)',
      fontFamily: 'var(--font-body)'
    }
  }, steps.map((step, i) => {
    const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'pending';
    return /*#__PURE__*/React.createElement("div", {
      key: step,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 18,
        height: 18,
        borderRadius: '50%',
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid ' + (state === 'pending' ? 'var(--border-strong)' : 'var(--accent-9)'),
        background: state === 'done' ? 'var(--accent-9)' : 'transparent',
        transition: 'background var(--dur-base) var(--ease-standard)'
      }
    }, state === 'done' && /*#__PURE__*/React.createElement("svg", {
      width: "9",
      height: "9",
      viewBox: "0 0 12 12"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M2 6l3 3 5-6",
      stroke: "var(--accent-contrast)",
      strokeWidth: "1.8",
      fill: "none",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })), state === 'active' && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'var(--accent-9)',
        animation: 'tf-pulse 1.2s var(--ease-standard) infinite'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: state === 'pending' ? 'var(--text-muted)' : 'var(--text-primary)'
      }
    }, step));
  }), /*#__PURE__*/React.createElement("style", null, '@keyframes tf-pulse{0%,100%{opacity:.4}50%{opacity:1}}'));
}
Object.assign(__ds_scope, { LoadingSteps });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/LoadingSteps.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
const {
  useState
} = React;
function Tooltip({
  children,
  content,
  placement = 'top'
}) {
  const [open, setOpen] = useState(false);
  const pos = placement === 'top' ? {
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: 8
  } : {
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginTop: 8
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, children, open && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      ...pos,
      zIndex: 20,
      background: 'var(--surface-raised)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 12px',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-popover)'
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/cards/ResultCard.jsx
try { (() => {
const {
  useState
} = React;
function ResultCard({
  name,
  reason,
  evidence,
  sourceLabel = 'Source',
  sourceHref = '#',
  scores
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      width: 200,
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      aspectRatio: '5/7',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
      background: 'repeating-linear-gradient(135deg, var(--n-3), var(--n-3) 10px, var(--n-2) 10px, var(--n-2) 20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 10,
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-standard)',
      boxShadow: hover ? 'var(--shadow-popover)' : 'none'
    }
  }, "Card art placeholder"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-primary)',
      fontWeight: 700,
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-snug)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-xs)',
      lineHeight: 'var(--leading-normal)'
    }
  }, reason), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, scores ? /*#__PURE__*/React.createElement(__ds_scope.Tooltip, {
    content: /*#__PURE__*/React.createElement(__ds_scope.ScoreBreakdown, scores)
  }, /*#__PURE__*/React.createElement(__ds_scope.EvidenceTag, {
    kind: evidence
  })) : /*#__PURE__*/React.createElement(__ds_scope.EvidenceTag, {
    kind: evidence
  }), /*#__PURE__*/React.createElement("a", {
    href: sourceHref,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--link)',
      textDecoration: 'none',
      letterSpacing: '.04em'
    }
  }, sourceLabel, " \u2197")));
}
Object.assign(__ds_scope, { ResultCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ResultCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/SideGroup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const glows = {
  amber: 'var(--side-amber)',
  teal: 'var(--side-teal)',
  violet: 'var(--side-violet)',
  rose: 'var(--side-rose)',
  sage: 'var(--side-sage)',
  slate: 'var(--side-slate)'
};
function SideGroup({
  label,
  glow = 'amber',
  title,
  explanation,
  cards = []
}) {
  const color = glows[glow];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-subtle)',
      background: 'var(--bg-section-alt)',
      padding: 'var(--space-24)',
      boxShadow: `0 0 48px -20px ${color}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: color,
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label)), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'var(--text-2xl)',
      color: 'var(--text-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-relaxed)',
      maxWidth: 640
    }
  }, explanation), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-16)',
      flexWrap: 'wrap'
    }
  }, cards.map(c => /*#__PURE__*/React.createElement(__ds_scope.ResultCard, _extends({
    key: c.name
  }, c)))));
}
Object.assign(__ds_scope, { SideGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/SideGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
const sizes = {
  sm: {
    padding: '7px 14px',
    fontSize: 'var(--text-xs)'
  },
  md: {
    padding: '10px 18px',
    fontSize: 'var(--text-sm)'
  },
  lg: {
    padding: '13px 24px',
    fontSize: 'var(--text-md)'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon = null,
  onClick,
  type = 'button'
}) {
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    borderRadius: 'var(--radius-pill)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: 'var(--accent-9)',
      color: 'var(--accent-contrast)'
    },
    secondary: {
      background: 'var(--surface-raised)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)'
    },
    danger: {
      background: 'var(--danger-9)',
      color: 'var(--accent-contrast)'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      ...base,
      ...variants[variant]
    },
    onMouseEnter: e => {
      if (!disabled && variant === 'primary') e.currentTarget.style.background = 'var(--accent-10)';
      if (!disabled && variant === 'secondary') e.currentTarget.style.background = 'var(--n-4)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = variants[variant].background;
    },
    onFocus: e => {
      e.currentTarget.style.boxShadow = 'var(--glow-focus)';
    },
    onBlur: e => {
      e.currentTarget.style.boxShadow = 'none';
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-md)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--radius-sm)',
      border: '1px solid ' + (checked ? 'var(--accent-9)' : 'var(--border-strong)'),
      background: checked ? 'var(--accent-9)' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--dur-fast) var(--ease-standard)',
      flex: 'none'
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 6l3 3 5-6",
    stroke: "var(--accent-contrast)",
    strokeWidth: "1.6",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  label,
  variant = 'ghost',
  onClick,
  active = false
}) {
  const variants = {
    ghost: {
      background: active ? 'var(--n-4)' : 'transparent',
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)'
    },
    outline: {
      background: 'var(--surface-raised)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-subtle)'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    title: label,
    onClick: onClick,
    style: {
      width: 40,
      height: 40,
      minWidth: 40,
      borderRadius: 'var(--radius-md)',
      border: '1px solid transparent',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background var(--dur-fast) var(--ease-standard)',
      ...variants[variant]
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--n-4)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = variants[variant].background;
    }
  }, icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
const {
  useState
} = React;
function Input({
  value,
  onChange,
  placeholder = '',
  label,
  size = 'md',
  multiline = false,
  rows = 3
}) {
  const [focused, setFocused] = useState(false);
  const pad = size === 'lg' ? '16px 18px' : '10px 14px';
  const style = {
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
    fontSize: size === 'lg' ? 'var(--text-lg)' : 'var(--text-md)',
    color: 'var(--text-primary)',
    background: 'var(--surface-raised)',
    border: '1px solid ' + (focused ? 'var(--accent-9)' : 'var(--border-subtle)'),
    borderRadius: 'var(--radius-md)',
    padding: pad,
    boxShadow: focused ? 'var(--glow-focus)' : 'none',
    transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
    outline: 'none',
    resize: multiline ? 'vertical' : 'none'
  };
  const Tag = multiline ? 'textarea' : 'input';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      width: '100%'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement(Tag, {
    value: value,
    placeholder: placeholder,
    rows: multiline ? rows : undefined,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: style
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/MixSlider.jsx
try { (() => {
function MixSlider({
  label,
  value,
  onChange,
  color = 'var(--accent-9)',
  min = 0,
  max = 100
}) {
  const pct = (value - min) / (max - min) * 100;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, value, "%")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: min,
    max: max,
    value: value,
    onChange: e => onChange && onChange(Number(e.target.value)),
    style: {
      WebkitAppearance: 'none',
      appearance: 'none',
      height: 6,
      borderRadius: 'var(--radius-pill)',
      outline: 'none',
      background: `linear-gradient(90deg, ${color} ${pct}%, var(--n-4) ${pct}%)`,
      cursor: 'pointer'
    }
  }));
}
Object.assign(__ds_scope, { MixSlider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/MixSlider.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const {
  useState,
  useRef,
  useEffect
} = React;
function Select({
  value,
  options,
  onChange,
  label
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const current = options.find(o => o.value === value);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative',
      display: 'inline-flex',
      flexDirection: 'column',
      gap: 6
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(o => !o),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      minWidth: 160,
      background: 'var(--surface-raised)',
      color: 'var(--text-primary)',
      border: '1px solid ' + (open ? 'var(--accent-9)' : 'var(--border-subtle)'),
      borderRadius: 'var(--radius-md)',
      padding: '10px 14px',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-md)',
      cursor: 'pointer'
    }
  }, current ? current.label : 'Select', /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 11
    }
  }, "\u25BE")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 6,
      minWidth: '100%',
      zIndex: 10,
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-popover)',
      overflow: 'hidden'
    }
  }, options.map(o => /*#__PURE__*/React.createElement("div", {
    key: o.value,
    onClick: () => {
      onChange && onChange(o.value);
      setOpen(false);
    },
    style: {
      padding: '10px 14px',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-md)',
      color: 'var(--text-primary)',
      cursor: 'pointer',
      background: o.value === value ? 'var(--accent-soft)' : 'transparent'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--n-4)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = o.value === value ? 'var(--accent-soft)' : 'transparent';
    }
  }, o.label))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-md)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 40,
      height: 24,
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'var(--accent-9)' : 'var(--n-5)',
      position: 'relative',
      transition: 'background var(--dur-fast) var(--ease-standard)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: checked ? 19 : 3,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: checked ? 'var(--accent-contrast)' : 'var(--n-8)',
      transition: 'left var(--dur-base) var(--ease-standard)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 4,
      background: 'var(--n-2)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-pill)',
      padding: 4
    }
  }, items.map(item => {
    const active = item.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: item.value,
      type: "button",
      onClick: () => onChange && onChange(item.value),
      style: {
        border: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-pill)',
        padding: '7px 16px',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        background: active ? 'var(--accent-9)' : 'transparent',
        color: active ? 'var(--accent-contrast)' : 'var(--text-secondary)',
        transition: 'background var(--dur-fast) var(--ease-standard)'
      }
    }, item.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/ThemeToggle.jsx
try { (() => {
function ThemeToggle({
  theme,
  onChange
}) {
  const isDark = theme === 'dark';
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onChange && onChange(isDark ? 'light' : 'dark'),
    "aria-label": "Toggle theme",
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
      background: 'var(--surface-raised)',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, isDark ? /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
  })));
}
Object.assign(__ds_scope, { ThemeToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/ThemeToggle.jsx", error: String((e && e.message) || e) }); }

// ui_kits/taleforge/App.jsx
try { (() => {
function App() {
  const [screen, setScreen] = React.useState('home');
  const [theme, setTheme] = React.useState('dark');
  const [device, setDevice] = React.useState('desktop');
  const {
    Header,
    Home,
    Results,
    States
  } = window.TaleforgeKit;
  const isPhone = device === 'phone';
  const frameStyle = isPhone ? {
    width: 390,
    height: 780,
    margin: '24px auto',
    border: '1px solid var(--border-strong)',
    borderRadius: 36,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-popover)'
  } : {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };
  return /*#__PURE__*/React.createElement("div", {
    "data-theme": theme,
    style: {
      background: isPhone ? 'var(--n-1)' : 'var(--bg-page)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    screen: screen,
    setScreen: setScreen,
    theme: theme,
    setTheme: setTheme,
    device: device,
    setDevice: setDevice
  }), /*#__PURE__*/React.createElement("div", {
    style: frameStyle
  }, screen === 'home' && /*#__PURE__*/React.createElement(Home, {
    device: device,
    onSearch: () => setScreen('results')
  }), screen === 'results' && /*#__PURE__*/React.createElement(Results, {
    device: device,
    onBack: () => setScreen('home')
  }), screen === 'states' && /*#__PURE__*/React.createElement(States, {
    device: device
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/taleforge/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/taleforge/BottomSheet.jsx
try { (() => {
function BottomSheet({
  open,
  onClose,
  title,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--surface-raised)',
      borderTop: '1px solid var(--border-subtle)',
      borderTopLeftRadius: 'var(--radius-xl)',
      borderTopRightRadius: 'var(--radius-xl)',
      padding: 'var(--space-20)',
      boxShadow: 'var(--shadow-popover)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: 'var(--n-5)',
      margin: '0 auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      color: 'var(--text-primary)',
      fontSize: 15
    }
  }, title), children));
}
window.TaleforgeKit = Object.assign(window.TaleforgeKit || {}, {
  BottomSheet
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/taleforge/BottomSheet.jsx", error: String((e && e.message) || e) }); }

// ui_kits/taleforge/Header.jsx
try { (() => {
function Header({
  screen,
  setScreen,
  theme,
  setTheme,
  device,
  setDevice
}) {
  const {
    ThemeToggle,
    IconButton
  } = window.TaleforgeDesignSystem_ac3969;
  const navItem = (id, label) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setScreen(id),
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      color: screen === id ? 'var(--text-primary)' : 'var(--text-muted)',
      padding: '6px 2px',
      borderBottom: screen === id ? '2px solid var(--accent-9)' : '2px solid transparent'
    }
  }, label);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 20px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-page)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 20,
      color: 'var(--text-primary)'
    }
  }, "Taleforge"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 18
    }
  }, navItem('home', 'Home'), navItem('results', 'Results'), navItem('states', 'States'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      background: 'var(--n-2)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-pill)',
      padding: 3,
      gap: 2
    }
  }, ['desktop', 'phone'].map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => setDevice(d),
    style: {
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-pill)',
      padding: '5px 12px',
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      textTransform: 'uppercase',
      letterSpacing: '.05em',
      background: device === d ? 'var(--accent-9)' : 'transparent',
      color: device === d ? 'var(--accent-contrast)' : 'var(--text-muted)'
    }
  }, d))), /*#__PURE__*/React.createElement(ThemeToggle, {
    theme: theme,
    onChange: setTheme
  })));
}
window.TaleforgeKit = Object.assign(window.TaleforgeKit || {}, {
  Header
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/taleforge/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/taleforge/Home.jsx
try { (() => {
function Home({
  device,
  onSearch
}) {
  const {
    Button,
    Input,
    MixSlider,
    Badge
  } = window.TaleforgeDesignSystem_ac3969;
  const {
    BottomSheet
  } = window.TaleforgeKit;
  const [query, setQuery] = React.useState('A grixis control deck built around Nicol Bolas, the dragon-god who plays the long game.');
  const [story, setStory] = React.useState(60);
  const [synergy, setSynergy] = React.useState(70);
  const [similarity, setSimilarity] = React.useState(35);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const isPhone = device === 'phone';
  const sliders = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(MixSlider, {
    label: "Story",
    value: story,
    onChange: setStory,
    color: "var(--side-violet)"
  }), /*#__PURE__*/React.createElement(MixSlider, {
    label: "Synergy",
    value: synergy,
    onChange: setSynergy,
    color: "var(--side-teal)"
  }), /*#__PURE__*/React.createElement(MixSlider, {
    label: "Similarity",
    value: similarity,
    onChange: setSimilarity,
    color: "var(--side-slate)"
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-stars",
    style: {
      position: 'relative',
      flex: 1,
      overflow: 'auto',
      background: 'var(--bg-page)',
      padding: isPhone ? '28px 18px' : '64px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-grid",
    style: {
      position: 'absolute',
      inset: 0,
      maskImage: 'linear-gradient(to bottom, black, transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 720,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      alignItems: isPhone ? 'stretch' : 'center',
      textAlign: isPhone ? 'left' : 'center'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, "Beta \xB7 free & unofficial"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      color: 'var(--text-primary)',
      fontSize: isPhone ? 34 : 56,
      lineHeight: 'var(--leading-tight)'
    }
  }, "Describe your deck idea.", /*#__PURE__*/React.createElement("br", null), "We'll find the cards."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--text-secondary)',
      fontSize: isPhone ? 15 : 17,
      maxWidth: 520,
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "A character, a guild, a storyline \u2014 Taleforge groups Commander-legal cards into themes, each with a short explanation and a source."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      alignItems: 'stretch',
      textAlign: 'left',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Input, {
    multiline: true,
    rows: isPhone ? 3 : 4,
    size: "lg",
    value: query,
    onChange: setQuery,
    placeholder: "A grixis control deck built around..."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      justifyContent: isPhone ? 'space-between' : 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => onSearch && onSearch()
  }, "Find cards"), isPhone ? /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => setSheetOpen(true)
  }, "Mix") : null), !isPhone && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-20)',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 14
    }
  }, "Mix weights"), sliders)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 12,
      marginTop: 24,
      maxWidth: 480
    }
  }, "Explanations are written by AI from the linked sources and may be imperfect. Taleforge is not affiliated with or endorsed by Wizards of the Coast.")), /*#__PURE__*/React.createElement(BottomSheet, {
    open: sheetOpen,
    onClose: () => setSheetOpen(false),
    title: "Mix weights"
  }, sliders));
}
window.TaleforgeKit = Object.assign(window.TaleforgeKit || {}, {
  Home
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/taleforge/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/taleforge/Results.jsx
try { (() => {
function Results({
  device,
  onBack
}) {
  const {
    QueryChip,
    SideGroup,
    Button
  } = window.TaleforgeDesignSystem_ac3969;
  const data = window.TaleforgeSample;
  const [chips, setChips] = React.useState(data.chips);
  const isPhone = device === 'phone';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      background: 'var(--bg-page)',
      padding: isPhone ? '20px 16px 40px' : '32px 40px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1040,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-24)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, chips.map(c => /*#__PURE__*/React.createElement(QueryChip, {
    key: c.id,
    label: c.label,
    onRemove: () => setChips(chips.filter(x => x.id !== c.id))
  }))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: onBack
  }, "Edit search")), data.sides.map(s => /*#__PURE__*/React.createElement(SideGroup, {
    key: s.id,
    label: s.label,
    glow: s.glow,
    title: s.title,
    explanation: s.explanation,
    cards: s.cards
  }))));
}
window.TaleforgeKit = Object.assign(window.TaleforgeKit || {}, {
  Results
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/taleforge/Results.jsx", error: String((e && e.message) || e) }); }

// ui_kits/taleforge/States.jsx
try { (() => {
function States({
  device
}) {
  const {
    Tabs,
    Banner,
    Button,
    LoadingSteps,
    Badge
  } = window.TaleforgeDesignSystem_ac3969;
  const [tab, setTab] = React.useState('maintenance');
  const isPhone = device === 'phone';
  const wrap = children => /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560,
      margin: '40px auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      padding: isPhone ? '0 16px' : 0
    }
  }, children);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      background: 'var(--bg-page)',
      padding: isPhone ? '20px 0 40px' : '32px 0 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: 'maintenance',
      label: 'Maintenance'
    }, {
      value: 'limit',
      label: 'Daily limit'
    }, {
      value: 'loading',
      label: 'Loading'
    }, {
      value: 'beta',
      label: 'Beta & privacy'
    }]
  })), tab === 'maintenance' && wrap(/*#__PURE__*/React.createElement(Banner, {
    tone: "info",
    title: "Search is paused for maintenance"
  }, "We're tending the stacks. Taleforge will be back shortly \u2014 try again in a few minutes.")), tab === 'limit' && wrap(/*#__PURE__*/React.createElement(Banner, {
    tone: "warning",
    title: "Daily limit reached",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "Notify me")
  }, "You've used today's free searches. Limits reset at midnight UTC.")), tab === 'loading' && wrap(/*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-24)'
    }
  }, /*#__PURE__*/React.createElement(LoadingSteps, {
    steps: ['Reading your idea', 'Matching cards', 'Writing explanations'],
    activeIndex: 1
  }))), tab === 'beta' && wrap(/*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, "Beta")), /*#__PURE__*/React.createElement(Banner, {
    tone: "info",
    title: "A note on privacy"
  }, "Taleforge doesn't require an account. Your deck ideas are used only to generate this search and aren't stored with your identity."))));
}
window.TaleforgeKit = Object.assign(window.TaleforgeKit || {}, {
  States
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/taleforge/States.jsx", error: String((e && e.message) || e) }); }

// ui_kits/taleforge/sampleData.js
try { (() => {
window.TaleforgeSample = {
  chips: [{
    id: 'character',
    label: 'Character: Nicol Bolas'
  }, {
    id: 'colors',
    label: 'Colors: Grixis'
  }, {
    id: 'theme',
    label: 'Theme: Forced sacrifice'
  }],
  sides: [{
    id: 'long-game',
    label: 'Grixis Control',
    glow: 'violet',
    title: 'The Long Game',
    explanation: "Written by AI from the linked sources. Bolas's plan across Dominaria rewards patience — card advantage and forced sacrifice outpace raw aggression, so this group leans into grind rather than generic big-mana synergy.",
    cards: [{
      name: 'Toxic Deluge',
      reason: 'Clears small boards without touching your own high-toughness threats.',
      evidence: 'Deck synergy',
      sourceLabel: 'Scryfall',
      sourceHref: '#',
      scores: {
        story: 0.3,
        synergy: 0.8,
        similarity: 0.4
      }
    }, {
      name: 'Dark Confidant',
      reason: 'Steady card advantage that fits a grindy control shell.',
      evidence: 'Similarity',
      sourceLabel: 'Scryfall',
      sourceHref: '#',
      scores: {
        story: 0.1,
        synergy: 0.6,
        similarity: 0.7
      }
    }, {
      name: 'Bolas\u2019s Citadel',
      reason: 'Namesake card; reads your whole library as mana for a turn.',
      evidence: 'Name match',
      sourceLabel: 'Scryfall',
      sourceHref: '#',
      scores: {
        story: 0.9,
        synergy: 0.5,
        similarity: 0.2
      }
    }, {
      name: 'Mutilate',
      reason: 'A second sweeper that favors a black-heavy manabase, same grind plan.',
      evidence: 'Deck synergy',
      sourceLabel: 'Scryfall',
      sourceHref: '#',
      scores: {
        story: 0.2,
        synergy: 0.7,
        similarity: 0.5
      }
    }]
  }, {
    id: 'dragon-god',
    label: 'Mythology',
    glow: 'amber',
    title: 'Dragon-God\u2019s Inner Circle',
    explanation: 'Written by AI from the linked sources. Cards that reference Bolas directly in flavor or mechanics, grouped for players who want the story thread visible on the table.',
    cards: [{
      name: 'Nicol Bolas, the Ravager',
      reason: 'Front half of the planeswalker transformation that defines Bolas in recent sets.',
      evidence: 'Name match',
      sourceLabel: 'Scryfall',
      sourceHref: '#',
      scores: {
        story: 0.95,
        synergy: 0.3,
        similarity: 0.2
      }
    }, {
      name: 'Bolas\u2019s Minion',
      reason: 'Flavor text ties this creature directly to Bolas\u2019s schemes.',
      evidence: 'Story link',
      sourceLabel: 'Scryfall',
      sourceHref: '#',
      scores: {
        story: 0.8,
        synergy: 0.2,
        similarity: 0.3
      }
    }]
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/taleforge/sampleData.js", error: String((e && e.message) || e) }); }

__ds_ns.Card = __ds_scope.Card;

__ds_ns.QueryChip = __ds_scope.QueryChip;

__ds_ns.ResultCard = __ds_scope.ResultCard;

__ds_ns.ScoreBreakdown = __ds_scope.ScoreBreakdown;

__ds_ns.SideGroup = __ds_scope.SideGroup;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Banner = __ds_scope.Banner;

__ds_ns.EvidenceTag = __ds_scope.EvidenceTag;

__ds_ns.LoadingSteps = __ds_scope.LoadingSteps;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.MixSlider = __ds_scope.MixSlider;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.ThemeToggle = __ds_scope.ThemeToggle;

})();

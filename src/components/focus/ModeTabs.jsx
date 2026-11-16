import SegmentedControl from '../ui/SegmentedControl.jsx';
import {
  POMODORO_MODE_ORDER,
  POMODORO_MODE_TAB_LABELS,
} from '../../utils/constants.js';

const OPTIONS = POMODORO_MODE_ORDER.map((value) => ({
  value,
  label: POMODORO_MODE_TAB_LABELS[value],
}));

export default function ModeTabs({ mode, onChange, compact = false, className }) {
  return (
    <SegmentedControl
      options={OPTIONS}
      value={mode}
      onChange={onChange}
      columns={3}
      size={compact ? 'sm' : 'md'}
      name="pomodoro-mode"
      ariaLabel="Modo do timer"
      className={className}
    />
  );
}

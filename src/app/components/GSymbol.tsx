import { child } from 'firebase/database';
import Link from 'next/link';

export const FILL_DEFAULT = 1;

export const WEIGHT_DEFAULT = 400;
export const WEIGHT_MIN = 100;
export const WEIGHT_MAX = 700;
const WEIGHT_STEP = 100;

export const GRADE_DEFAULT = 0;

export const OPTICAL_SIZE_DEFAULT = 24;
export const OPTICAL_SIZE_MIN = 20;
export const OPTICAL_SIZE_MAX = 48;
const OPTICAL_SIZE_STEP = 1;

const COLOR_DEFAULT = 'black';

interface SymbolAxes {
  size: number;
  fill: number;
  weight: number;
  grade: -25 | 0 | 200;
  opticalSize: number;
}

export const DEFAULT_AXES: SymbolAxes = {
  size: OPTICAL_SIZE_DEFAULT,
  fill: FILL_DEFAULT,
  weight: WEIGHT_DEFAULT,
  grade: GRADE_DEFAULT,
  opticalSize: OPTICAL_SIZE_DEFAULT,
};

function axesCheck(axes: SymbolAxes): SymbolAxes {
  const fixedWeight =
    axes.weight >= WEIGHT_MIN && axes.weight <= WEIGHT_MAX
      ? Math.round(axes.weight / WEIGHT_STEP) * WEIGHT_STEP
      : WEIGHT_DEFAULT;
  const fixedOpticalSize =
    axes.opticalSize >= OPTICAL_SIZE_MIN && axes.opticalSize <= OPTICAL_SIZE_MAX
      ? Math.round(axes.opticalSize / OPTICAL_SIZE_STEP) * OPTICAL_SIZE_STEP
      : OPTICAL_SIZE_DEFAULT;
  return {
    size: axes.size,
    fill: axes.fill,
    weight: fixedWeight,
    grade: axes.grade,
    opticalSize: fixedOpticalSize,
  };
}

export function GSymbol({
  className = '',
  type,
  size = OPTICAL_SIZE_DEFAULT,
  fill = FILL_DEFAULT,
  weight = WEIGHT_DEFAULT,
  grade = GRADE_DEFAULT,
  opticalSize = OPTICAL_SIZE_DEFAULT,
  iconColor = COLOR_DEFAULT,
  children,
}: {
  className: string;
  type: 'outlined' | 'rounded' | 'sharp';
  size: number;
  fill: number;
  weight: number;
  grade: -25 | 0 | 200;
  opticalSize: number;
  iconColor: string;
  children: React.ReactNode;
}) {
  const fixedAxes = axesCheck({ size, fill, weight, grade, opticalSize });
  return (
    <span
      className={`material-symbols-${type} ${className}`}
      style={{
        ['fontVariationSettings' as any]: `'FILL' ${fixedAxes.fill}, 'wght' ${fixedAxes.weight}, 'GRAD' ${fixedAxes.grade}, 'opsz' ${fixedAxes.opticalSize}`,
        fontSize: fixedAxes.size,
        color: iconColor,
      }}
    >
      {children}
    </span>
  );
}
export function GSymbolOutlined({
  className = '',
  size = 0,
  fill = FILL_DEFAULT,
  weight = WEIGHT_DEFAULT,
  grade = GRADE_DEFAULT,
  opticalSize = OPTICAL_SIZE_DEFAULT,
  iconColor = COLOR_DEFAULT,
  children,
}: {
  className?: string;
  fill?: number;
  size?: number;
  weight?: number;
  grade?: -25 | 0 | 200;
  opticalSize?: number;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <GSymbol
      className={className}
      type="outlined"
      size={size === 0 ? opticalSize : size}
      fill={fill}
      weight={weight}
      grade={grade}
      opticalSize={opticalSize}
      iconColor={iconColor}
    >
      {children}
    </GSymbol>
  );
}

export function GSymbolRounded({
  className = '',
  size = 0,
  fill = FILL_DEFAULT,
  weight = WEIGHT_DEFAULT,
  grade = GRADE_DEFAULT,
  opticalSize = OPTICAL_SIZE_DEFAULT,
  iconColor = COLOR_DEFAULT,
  children,
}: {
  className?: string;
  fill?: number;
  size?: number;
  weight?: number;
  grade?: -25 | 0 | 200;
  opticalSize?: number;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <GSymbol
      className={className}
      type="rounded"
      size={size === 0 ? opticalSize : size}
      fill={fill}
      weight={weight}
      grade={grade}
      opticalSize={opticalSize}
      iconColor={iconColor}
    >
      {children}
    </GSymbol>
  );
}

export function GSymbolSharp({
  className = '',
  size = 0,
  fill = FILL_DEFAULT,
  weight = WEIGHT_DEFAULT,
  grade = GRADE_DEFAULT,
  opticalSize = OPTICAL_SIZE_DEFAULT,
  iconColor = COLOR_DEFAULT,
  children,
}: {
  className?: string;
  fill?: number;
  size?: number;
  weight?: number;
  grade?: -25 | 0 | 200;
  opticalSize?: number;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <GSymbol
      className={className}
      type="sharp"
      size={size === 0 ? opticalSize : size}
      fill={fill}
      weight={weight}
      grade={grade}
      opticalSize={opticalSize}
      iconColor={iconColor}
    >
      {children}
    </GSymbol>
  );
}

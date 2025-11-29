// Map de talles a sus IDs en la base de datos
export const SIZE_MAP: Record<string, number> = {
  'XS': 1,
  'S': 2,
  'M': 3,
  'L': 4,
  'XL': 5
};

export function getSizeId(sizeLabel: string): number | null {
  return SIZE_MAP[sizeLabel] ?? null;
}

export function getSizeLabel(sizeId: number): string | null {
  const entry = Object.entries(SIZE_MAP).find(([_, id]) => id === sizeId);
  return entry ? entry[0] : null;
}

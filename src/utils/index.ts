
export function getValueByPath(obj: any, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function includesIgnoringCase(source: string, target: string): boolean {
  return source.toLowerCase().includes(target.toLowerCase());
}
  
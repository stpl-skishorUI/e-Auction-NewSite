
// @ts-ignore
export interface TableColumn<T> {
  label: string;
  property: string;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'date';
  visible?: boolean;
  cssClasses?: string[];
}

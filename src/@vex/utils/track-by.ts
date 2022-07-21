import { KeyValue } from '@angular/common';

export function trackByRoute<T extends { route: string | string[] }>(index: number, item: T) {
  return item.route;
  console.log(index);
}

export function trackById<T extends { id: string | number }>(index: number, item: T) {
  return item.id;
  console.log(index);
}

export function trackByKey(index: number, item: KeyValue<any, any>) {
  return item.key;
  console.log(index);
}

export function trackByValue(index: number, value: string) {
  return value;
  console.log(index);
}

export function trackByLabel<T extends { label: string }>(index: number, value: T) {
  return value.label;
  console.log(index);
}

import { useSyncExternalStore } from 'react';
import type { Employee } from '../data/mockEmployees';

let employees: Employee[] = [];
const listeners = new Set<() => void>();

function emit() {
    listeners.forEach((l) => l());
}

export function setEmployees(next: Employee[]) {
    employees = next;
    emit();
}

export function appendEmployees(extra: Employee[]) {
    employees = [...employees, ...extra];
    emit();
}

export function clearEmployees() {
    employees = [];
    emit();
}

export function getEmployees(): Employee[] {
    return employees;
}

export function getEmployeeById(id: string): Employee | undefined {
    return employees.find((e) => e.id === id);
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function useEmployees(): Employee[] {
    return useSyncExternalStore(subscribe, getEmployees, getEmployees);
}

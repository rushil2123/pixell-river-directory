export interface DepartmentGroup {
  id: number;
  department: string;
  employees: string[];
  createdAt: string;
}

export interface OrgRole {
  id: number;
  title: string;
  person?: string;
  description?: string;
  createdAt: string;
}

export interface EntryFormValuesEmployee {
  kind: "employee";
  name: string;
  department: string;  
}

export interface EntryFormValuesRole {
  kind: "role";
  title: string;
  person?: string;
  description?: string;
}

export type EntryFormValues = EntryFormValuesEmployee | EntryFormValuesRole;

export type EntryFormErrors = {
  name?: string;
  department?: string;
  title?: string;
  person?: string;
};

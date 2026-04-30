export interface ProductFormData {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export interface ProductFormErrors {
  id?: string;
  name?: string;
  description?: string;
  logo?: string;
  date_release?: string;
}

export const INITIAL_FORM: ProductFormData = {
  id: '',
  name: '',
  description: '',
  logo: '',
  date_release: '',
  date_revision: '',
};

export interface SurgeFormFields extends FormFields {
  key: string
}

export interface RegularFormFields extends FormFields {
  name: string
  host: string
  port: number
  key: string
  useTls: boolean
}

export interface FormFields {
  keepCredential: boolean
}

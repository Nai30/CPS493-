export { DataEnvelope, DataListEnvelope } from "./dataEnvelopes"

export type User = {
    id: number
    name: string
    username: string
    email: string
    role: string
    passwordHash: string
    friends?: number[] 
    
}
